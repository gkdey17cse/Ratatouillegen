import React, { useState, useEffect, useRef } from "react";

export default function MultiSelectDropdown({
  ingredients = [],
  selectedIngredients = [],
  onSelect,
  isLoading,
  disabled,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Responsive: detect mobile
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 640);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when input is focused
  const handleInputFocus = () => {
    if (!disabled && !isLoading) setIsDropdownOpen(true);
  };

  // Toggle ingredient selection and flash search
  const handleIngredientToggle = (ingredient) => {
    onSelect(ingredient);
    setSearchTerm(""); // Flash the search box
    if (inputRef.current) inputRef.current.focus();
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  // Remove a single ingredient
  const handleIngredientDeselect = (ingredient, e) => {
    e.stopPropagation();
    onSelect(ingredient);
    setSearchTerm(""); // Flash the search box
    if (inputRef.current) inputRef.current.focus();
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  // Clear all selected ingredients and reset dropdown scroll
  const handleClearAll = (e) => {
    e.stopPropagation();
    selectedIngredients.forEach((ingredient) => onSelect(ingredient));
    setSearchTerm("");
    if (inputRef.current) inputRef.current.focus();
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  // Filtered ingredient list (show all for toggle, highlight selected)
  const filteredIngredients = ingredients.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tag display logic: show max 2 (desktop) or 1 (mobile), then "+N items"
  const maxDisplayed = isMobile ? 1 : 2;
  const displayedTags = selectedIngredients.slice(0, maxDisplayed);
  const remainingCount = selectedIngredients.length - maxDisplayed;

  // Disabled state: block interaction, but keep color
  const blockAllInteraction = disabled || isLoading;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`flex items-center w-full min-h-[40px] px-4 py-1.5 pr-10 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 relative`}
        style={{
          cursor: blockAllInteraction ? "not-allowed" : "text",
          pointerEvents: blockAllInteraction ? "none" : "auto",
          opacity: 1, // Always looks enabled
        }}
        onClick={() => {
          if (!blockAllInteraction && inputRef.current) inputRef.current.focus();
        }}
      >
        {/* Tags */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          {selectedIngredients.length === 0 && (
            <span className="text-gray-500 mr-2 text-xs truncate">Select ingredients...</span>
          )}
          {displayedTags.map((ingredient) => (
            <span
              key={ingredient}
              className="bg-yellow-200 rounded-md px-2 py-1 text-xs flex items-center whitespace-nowrap mr-1"
              onClick={e => e.stopPropagation()}
            >
              {ingredient}
              <span
                className="ml-2 text-gray-700 hover:text-gray-800 cursor-pointer"
                onClick={e => handleIngredientDeselect(ingredient, e)}
                title="Remove"
              >
                ×
              </span>
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="bg-yellow-200 rounded-md px-2 py-1 text-xs whitespace-nowrap mr-1">
              +{remainingCount} items
            </span>
          )}
          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-[60px] outline-none bg-transparent border-none shadow-none text-gray-700"
            style={{ minWidth: 0, padding: 0, margin: 0, height: "1.5rem" }}
            placeholder={isLoading ? "Loading..." : ""}
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={handleInputFocus}
            disabled={blockAllInteraction}
            tabIndex={blockAllInteraction ? -1 : 0}
            autoComplete="off"
          />
        </div>
        {/* Cross button (clear all) - fixed at right */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900 cursor-pointer"
          style={{
            zIndex: 2,
            opacity: selectedIngredients.length > 0 ? 1 : 0,
            pointerEvents: selectedIngredients.length > 0 ? "auto" : "none",
            userSelect: "none",
            transition: "opacity 0.2s",
          }}
          onClick={handleClearAll}
          title="Clear all selected"
        >
          ×
        </span>
      </div>

      {/* Dropdown list */}
      {isDropdownOpen && !isLoading && filteredIngredients.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-10">
          <ul
            ref={listRef}
            className="p-1.5 space-y-1 max-h-48 overflow-y-auto text-left"
          >
            {filteredIngredients.map((ingredient) => {
              const isSelected = selectedIngredients.includes(ingredient);
              return (
                <li
                  key={ingredient}
                  className={`p-1.5 cursor-pointer flex items-center ${
                    isSelected
                      ? "bg-gray-200 font-semibold text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleIngredientToggle(ingredient)}
                >
                  {isSelected && (
                    <span className="mr-1 text-blue-500">✔</span>
                  )}
                  {ingredient}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
