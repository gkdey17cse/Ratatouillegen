import React, { useState, useEffect, useRef } from "react";

export default function MultiSelectDropdown({
  ingredients = [],
  selectedIngredients = [],
  onSelect,
  isLoading,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleIngredientSelect = (ingredient) => {
    onSelect(ingredient);
  };

  const handleIngredientDeselect = (ingredient, e) => {
    e.stopPropagation();
    onSelect(ingredient);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displaySelectedIngredients = () => {
    if (selectedIngredients.length === 0) {
      return <span className="text-gray-500">Select ingredients...</span>;
    }

    const maxDisplayedItems = isMobile ? 1 : 3;
    const displayedItems = selectedIngredients.slice(0, maxDisplayedItems);
    const remainingItemsCount = selectedIngredients.length - maxDisplayedItems;

    return (
      <div className="flex flex-wrap gap-2">
        {displayedItems.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center bg-yellow-200 rounded-md px-2 py-1 text-xs"
            onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle when clicking tags
          >
            <span>{ingredient}</span>
            <span 
              className="ml-2 text-gray-700 hover:text-gray-800 cursor-pointer"
              onClick={(e) => handleIngredientDeselect(ingredient, e)}
            >
              ×
            </span>
          </div>
        ))}
        {remainingItemsCount > 0 && (
          <div className="flex items-center bg-yellow-200 rounded-md px-2 py-1 text-xs">
            <span>+{remainingItemsCount} items</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full min-h-[40px] flex justify-between items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      >
        <span className="truncate">
          {isLoading ? "Loading..." : displaySelectedIngredients()}
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
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
      </button>

      {isDropdownOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-10">
          <input
            type="text"
            className="w-full p-2 border-b border-gray-200 outline-none text-gray-700 focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="p-2 space-y-1 max-h-48 overflow-y-auto text-left">
            {ingredients
              .filter((item) =>
                item.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((ingredient, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer ${
                    selectedIngredients.includes(ingredient)
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleIngredientSelect(ingredient)}
                >
                  {ingredient}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}