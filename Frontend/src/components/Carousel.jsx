import React, { useState, useEffect, useRef, useCallback } from "react";
import CarouselModal from "./CarouselModal";

const Carousel = ({ jsonFilePath }) => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(5);
  const itemsPerPage = 5;
  const carouselSlideRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoSlideInterval = useRef(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch JSON data
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(jsonFilePath);
        if (!response.ok) throw new Error("Failed to fetch JSON data");

        const data = await response.json();
        const recipesArray = Object.values(data);

        setRecipes([
          ...recipesArray.slice(-itemsPerPage),
          ...recipesArray,
          ...recipesArray.slice(0, itemsPerPage),
        ]);

        setCurrentIndex(itemsPerPage);
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    };

    fetchRecipes();
  }, [jsonFilePath]);

  // Stop auto-slide
  const stopAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
    }
  };

  // Start auto-slide
  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    autoSlideInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5000);
  }, []);

  // Move the carousel slide
  const moveSlide = useCallback(
    (direction) => {
      stopAutoSlide();
      setCurrentIndex((prevIndex) => prevIndex + direction);
      startAutoSlide();
    },
    [startAutoSlide]
  );

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide]);

  // Handle infinite loop effect - CHANGED THIS PART ONLY
  useEffect(() => {
    if (carouselSlideRef.current && recipes.length > 0) {
      const totalItems = recipes.length;
      const originalItems = totalItems - 2 * itemsPerPage;
      
      if (currentIndex >= originalItems + itemsPerPage) {
        // Immediately jump to the corresponding item in the original set without animation
        setIsTransitioning(false);
        setCurrentIndex(currentIndex - originalItems);
      } else if (currentIndex <= 0) {
        // Immediately jump to the corresponding item at the end without animation
        setIsTransitioning(false);
        setCurrentIndex(originalItems + currentIndex);
      } else {
        // Normal slide with animation
        setIsTransitioning(true);
      }
    }
  }, [currentIndex, recipes.length]);

  // Move slides smoothly
  useEffect(() => {
    if (carouselSlideRef.current) {
      const itemWidth = carouselSlideRef.current.children[0]?.offsetWidth || 0;
      carouselSlideRef.current.style.transition = isTransitioning
        ? "transform 0.5s ease-in-out"
        : "none";
      carouselSlideRef.current.style.transform = `translateX(-${
        currentIndex * itemWidth
      }px)`;
    }
  }, [currentIndex, isTransitioning]);

  // Handle "See Recipe" button click
  const handleSeeRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  return (
    <section className="text-gray-600 body-font">
      {/* Rest of your JSX remains exactly the same */}
      <div className="container mx-auto px-2 text-xs lg:text-sm">
        <div className="carousel-container relative max-w-7xl mx-auto overflow-hidden">
          <h1 className="text-lg font-semibold">Featured Recipes</h1>

          <button
            className="carousel-button prev absolute top-1/2 -translate-y-1/2 left-4 bg-black/50 text-white p-2 rounded-full cursor-pointer z-10"
            onClick={() => moveSlide(-1)}
          >
            &#10094;
          </button>
          <button
            className="carousel-button next absolute top-1/2 -translate-y-1/2 right-4 bg-black/50 text-white p-2 rounded-full cursor-pointer z-10"
            onClick={() => moveSlide(1)}
          >
            &#10095;
          </button>

          <div
            className="carousel-slide flex transition-transform duration-500 ease-in-out"
            ref={carouselSlideRef}
          >
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="carousel-item flex-shrink-0 w-full w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 py-1.5"
              >
                <div className="recipe-card h-[360px] md:h-[400px] shadow-md hover:shadow-lg duration-300 flex flex-col justify-between p-3 bg-white rounded-lg">
                  <div className="recipe-image h-[180px] md:h-[200px] rounded-lg overflow-hidden">
                    <img
                      alt="content"
                      className="object-cover object-center h-full w-full"
                      src={recipe.image}
                    />
                  </div>
                  <div className="recipe-text flex-1 flex flex-col py-2 overflow-hidden">
                    <h2 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-2">
                      {recipe.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-1 flex-grow">
                      {recipe.gist}
                    </p>
                    <div className="mt-1">
                      <button
                        className="w-full text-indigo-500 hover:text-indigo-700 duration-200 inline-flex items-center justify-center py-1 border-t border-gray-100"
                        onClick={() => handleSeeRecipeClick(recipe)}
                      >
                        See Recipe
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CarouselModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          recipeData={selectedRecipe}
          recipes={recipes}
        />
      )}
    </section>
  );
};

export default Carousel;