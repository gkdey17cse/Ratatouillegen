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
  className="relative w-full h-[400px] xl:h-[395px] bg-cover bg-center"
  style={{ backgroundImage: `url(${banner})` }}
>
  <div className="absolute inset-0 bg-black opacity-30"></div>
  <div className="max-w-7xl mx-auto relative flex justify-center items-center w-full h-full text-center px-4">
    <div className="w-full flex flex-col justify-center items-center px-2">
      {/* Headline */}
      <h1 className="text-2xl lg:text-4xl font-bold tracking-wider text-yellow-200 py-1">
        Create Novel Recipes
      </h1>
      {/* Main Action Row */}
      <div className="flex flex-col items-center justify-center w-full">
        {/* Surprise Me Section */}
        <div className="flex flex-col items-center rounded-lg p-2">
          <p className="text-base font-medium text-white mb-2">
            Stuck in a dinner dilemma?
          </p>
          <button
            id="btn_surprise_me"
            className="text-xs lg:text-sm py-2 px-5 w-32 lg:w-40 h-12 hover:bg-opacity-80 text-red-700 bg-white border border-red-800 flex justify-center items-center"
            onClick={handleSurpriseMe}
            disabled={isGeneratingRecipe || isRegenerating || isSurpriseMeLoading}
          >
            {isSurpriseMeLoading ? <Spinner progress={progress} /> : "Surprise Me"}
          </button>
        </div>
        {/* OR Divider - improved */}
        <div className="flex items-center w-full max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl py-0.5 my-1">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-300 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        {/* Custom Recipe Section */}
        <div className="flex flex-col gap-2 rounded-lg p-1">
          <span className="text-base font-medium text-white my-1 tracking-widest">
            Generate novel recipes with ingredients of your choice.
          </span>
          <div className="w-full flex gap-2 text-xs justify-center items-center">
            {/* Cuisine Dropdown */}
            <div className="relative w-52 xl:w-80">
              <select
                className="appearance-none w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 text-xs focus:ring-2 focus:ring-blue-500"
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
                xmlns="http://www.w3.org/2000/svg"
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
            {/* Ingredients MultiSelectDropdown */}
            <div
              className="relative w-52 xl:w-80"
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
          <button
            id="btn_generate_recipe"
            className="text-xs lg:text-sm py-2 px-5 w-32 lg:w-48 h-12 hover:bg-opacity-80 text-red-700 border border-red-800 bg-yellow-200 flex justify-center items-center mx-auto mt-2"
            disabled={
              !selectedCuisine ||
              selectedIngredients.length === 0 ||
              isGeneratingRecipe ||
              isRegenerating ||
              isSurpriseMeLoading
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
        {/* Stepper/Guidance */}
        <div className="flex items-center justify-center gap-2 text-sm text-yellow-100 my-1 tracking-wide">
          <span>Select Cuisine</span>
          <span>→</span>
          <span>Select Ingredients</span>
          <span>→</span>
          <span>Generate Recipe</span>
        </div>
      </div>
    </div>
  </div>
  {/* Recipe Modal */}
  <RecipeModal
    isOpen={isModalOpen}
    onClose={handleModalClose}
    recipeData={recipeData}
    onRegenerate={handleRegenerateRecipe}
    isRegenerating={isRegenerating}
    progress={progress}
    isSurpriseMeRecipe={isSurpriseMeRecipe}
  />
</section>


  );
}
