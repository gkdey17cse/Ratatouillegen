import React, { useState, useEffect } from "react";
import banner from "../Images/7_banner.jpg";
import MultiSelectDropdown from "./MultiSelectDropdown";
import RecipeModal from "./RecipeModal";
import Spinner from "./Spinner"; // Import the updated Spinner component
import { fetchIngredients, generateRecipe } from "../utils/apiPipeline";

export default function Banner() {
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For first API call
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false); // For second API call
  const [isRegenerating, setIsRegenerating] = useState(false); // For regeneration API call
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeData, setRecipeData] = useState(null);
  const [progress, setProgress] = useState(0); // Progress state
  const [isSurpriseMeLoading, setIsSurpriseMeLoading] = useState(false); // For Surprise Me API call
  const [isSurpriseMeRecipe, setIsSurpriseMeRecipe] = useState(false); // Track if recipe is from Surprise Me

  const cuisineRegions = [
    "US",
    "Canadian",
    "Chinese and Mongolian",
    "Belgian",
    "French",
    "South American",
    "Australian",
    "Indian Subcontinent",
    "Korean",
    "Irish",
    "Deutschland ",
    "Thai",
    "Rest Africa",
    "Scandinavian",
    "Middle Eastern",
    "Italian",
    "UK",
    "Japanese",
    "Central American",
    "Spanish and Portuguese",
    "Eastern European",
    "Mexican",
    "Caribbean",
    "Southeast Asian",
    "Greek",
    "Northern Africa",
  ];

  useEffect(() => {
    if (selectedCuisine) {
      setIsLoading(true); // Set loading state for first API call
      setSelectedIngredients([]);
      fetchIngredients(selectedCuisine)
        .then((data) => {
          setIngredientsList(data);
          setIsLoading(false); // Stop loading after first API call
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
          setIngredientsList([]);
          setIsLoading(false); // Stop loading on error
        });
    } else {
      setIngredientsList([]);
    }
  }, [selectedCuisine]);

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const fetchIngredientsFromCSV = async () => {
    try {
      const response = await fetch(
        `${process.env.PUBLIC_URL}/data/processed_ingredient_data.csv`
      );
      const text = await response.text();
      const rows = text.split("\n").slice(1); // Remove header if present
      const ingredients = rows.map((row) => row.split(",")[0].trim()); // Extract ingredient names
      return ingredients;
    } catch (error) {
      console.error("Error fetching CSV:", error);
      return [];
    }
  };

  const handleSurpriseMe = async () => {
    setIsSurpriseMeLoading(true); // Set loading state for Surprise Me API call
    setIsSurpriseMeRecipe(true); // Mark recipe as from Surprise Me
    setProgress(0); // Reset progress

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10; // Increment by 10% every 6 seconds
      });
    }, 6000); // 6 seconds per increment

    try {
      const allIngredients = await fetchIngredientsFromCSV();
      const topIngredients = allIngredients.slice(0, 50); // Take the first 50
      const randomIngredients = topIngredients
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, Math.floor(Math.random() * 6) + 5); // Pick 5-10

      setSelectedCuisine("Indian Subcontinent");
      setSelectedIngredients(randomIngredients);

      const recipe = await generateRecipe(
        randomIngredients,
        "Indian Subcontinent"
      );
      setRecipeData(recipe);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      clearInterval(interval); // Stop the progress simulation
      setIsSurpriseMeLoading(false); // Stop loading after API call
      setProgress(0); // Reset progress
    }
  };

  const handleGenerateRecipe = async () => {
    if (selectedCuisine && selectedIngredients.length > 0) {
      setIsGeneratingRecipe(true); // Set loading state for second API call
      setIsSurpriseMeRecipe(false); // Mark recipe as not from Surprise Me
      setProgress(0); // Reset progress

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10; // Increment by 10% every 6 seconds
        });
      }, 6000); // 6 seconds per increment

      try {
        const recipe = await generateRecipe(
          selectedIngredients,
          selectedCuisine
        );
        setRecipeData(recipe);
        setIsModalOpen(true); // Open the modal
      } catch (error) {
        console.error("Error generating recipe:", error);
      } finally {
        clearInterval(interval); // Stop the progress simulation
        setIsGeneratingRecipe(false); // Stop loading after second API call
        setProgress(0); // Reset progress
      }
    }
  };

  // Function to handle recipe regeneration
  const handleRegenerateRecipe = async () => {
    if (!selectedCuisine || selectedIngredients.length === 0) {
      console.error("Cannot regenerate: Missing cuisine or ingredients.");
      return;
    }

    setIsRegenerating(true); // Set loading state for regeneration
    setProgress(0); // Reset progress

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10; // Increment by 10% every 6 seconds
      });
    }, 6000); // 6 seconds per increment

    try {
      const recipe = await generateRecipe(selectedIngredients, selectedCuisine);
      setRecipeData(recipe); // Update recipe data
      setIsModalOpen(true); // Keep modal open after regeneration
    } catch (error) {
      console.error("Error regenerating recipe:", error);
    } finally {
      clearInterval(interval); // Stop the progress simulation
      setIsRegenerating(false); // Stop loading after regeneration
      setProgress(0); // Reset progress
    }
  };

  // Function to handle modal close and flush selected items
  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedCuisine(""); // Reset selected cuisine
    setSelectedIngredients([]); // Reset selected ingredients
  };

  return (
    <section
      className="relative w-full h-[380px] bg-cover bg-center"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="max-w-5xl mx-auto relative flex justify-center items-center w-full h-full text-center">
        <div className="w-full text-white flex flex-col justify-center items-center gap-2 lg:gap-4 px-2 lg:px-4 py-1 lg:py-2">
          <h1 className="text-2xl 2xl:text-5xl lg:text-4xl font-bold tracking-wider text-yellow-200 mb-2 lg:mb-2">
            Create Novel Recipes
          </h1>
          <div className="md:text-lg xl:text-xl my-1 lg:my-2 tracking-widest">
            <p>Stuck in a dinner dilemma?</p>
            <p>Generate novel recipes with ingredients of your choice.</p>
          </div>
          <div className="flex flex-col text-xs xl:text-sm 2xl:gap-4 w-full justify-center text-black">
            <div className="w-full grid grid-cols-2 gap-2 2xl:gap-8 py-4 lg:py-3 px-1 lg:px-6 rounded-lg">
              <div className="relative w-full">
                <select
                  className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  <option value="" disabled>
                    Select Cuisine...
                  </option>
                  {cuisineRegions.map((cuisine, index) => (
                    <option key={index} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className="relative w-full"
                style={{ pointerEvents: !selectedCuisine ? "none" : "auto" }}
              >
                <MultiSelectDropdown
                  ingredients={ingredientsList}
                  selectedIngredients={selectedIngredients}
                  onSelect={handleIngredientSelect}
                  disabled={!selectedCuisine}
                  isLoading={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 w-auto mt-6 lg:mt-2">
              <button
                id="btn_surprise_me"
                className="text-xs lg:text-sm py-1.5 lg:py-2.5 px-5 lg:px-7 w-32 w-32 lg:w-48 h-12 hover:bg-opacity-80 text-red-700 bg-white border border-red-800 flex justify-center items-center"
                onClick={handleSurpriseMe}
                disabled={
                  isGeneratingRecipe || isRegenerating || isSurpriseMeLoading
                } // Disable if any API call is in progress
              >
                {isSurpriseMeLoading ? (
                  <Spinner progress={progress} />
                ) : (
                  "Surprise Me"
                )}
              </button>

              <button
                id="btn_generate_recipe"
                className="text-xs lg:text-sm py-1.5 lg:py-2.5 px-5 lg:px-7 w-32 w-32 lg:w-48 h-12 hover:bg-opacity-80 text-red-700 border border-red-800 bg-yellow-200 flex justify-center items-center"
                disabled={
                  !selectedCuisine ||
                  selectedIngredients.length === 0 ||
                  isGeneratingRecipe ||
                  isRegenerating ||
                  isSurpriseMeLoading // Disable if any API call is in progress
                }
                onClick={handleGenerateRecipe}
              >
                {isGeneratingRecipe || isRegenerating ? (
                  <Spinner progress={progress} />
                ) : (
                  "Generate Recipe"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={handleModalClose} // Use the new handleModalClose function
        recipeData={recipeData}
        onRegenerate={handleRegenerateRecipe}
        isRegenerating={isRegenerating}
        progress={progress}
        isSurpriseMeRecipe={isSurpriseMeRecipe} // Pass the state to RecipeModal
      />
    </section>
  );
}
