

import React from "react"; // Removed useState since we don't need it
import bannerImage from "../Images/8_MiddleEastern.jpg";

const CarouselModal = ({ isOpen, onClose, recipeData }) => {
  // Only added this one new function
  const handleShareClick = () => {
    navigator.clipboard.writeText("https://cosylab.iiitd.edu.in/ratatouillegen/")
      // .then(() => alert("Link copied to clipboard!"))
      .catch(err => console.error('Failed to copy:', err));
  };

  // Existing parse function remains exactly the same
  const parseRecipeData = () => {
    if (!recipeData) return { title: "", ingredients: [], instructions: [] };
    const { title, ingredients, instructions } = recipeData;
    return { title, ingredients, instructions }; // No changes here
  };

  // Destructuring remains the same
  const { title, ingredients, instructions } = parseRecipeData();

  return (
    <div
      id="modal"
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-30 p-2 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white px-4 xl:px-6 py-6 rounded-lg shadow-lg max-w-5xl w-full max-h-screen overflow-y-auto">
        {/* Only changed the share button */}
        <div className="flex items-center justify-between py-1">
          <div className="flex justify-center items-center gap-4">
            <h1 className="text-lg lg:text-xl 2xl:text-2xl font-bold">
              {title}
            </h1>
            <button
              onClick={handleShareClick}
              className="text-gray-700 xl:text-2xl hover:text-gray-500 active:translate-x-0.5 active:translate-y-0.5 duration-100"
              title="Share recipe link"
            >
              <i className="fas fa-share"></i>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-white px-2 xl:text-2xl bg-red-500 rounded-full hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 duration-75"
          >
            <i className="fas fa-close"></i>
          </button>
        </div>

        {/* Everything below remains EXACTLY as in your original code */}
        <div className="py-0.5 2xl:py-2">
          <div className="flex justify-center items-center py-1 2xl:py-2">
            <img
              src={bannerImage}
              alt=""
              className="w-full xl:h-[200px] object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-1.5 pb-4 w-full text-xs lg:text-sm">
          <div className="col-span-2 bg-[radial-gradient(circle,rgba(253,253,220,0.5)_0%,rgba(255,220,148,0.65)_100%)]">
            <div className="flex flex-col justify-center items-start px-1.5 pb-8 pt-1.5 2xl:pt-2 text-justify">
              <h3 className="text-sm lg:text-base 2xl:text-xl tracking-wide font-semibold py-3">
                Ingredients
              </h3>
              <div className="flex flex-col justify-center items-start gap-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <i className="fas fa-hamburger text-red-500 2xl:px-2 pt-1"></i>
                    <p className="flex-1">{ingredient} .</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex flex-col justify-center items-start p-1.5 2xl:p-2 text-justify">
              <h3 className="text-sm lg:text-base 2xl:text-xl tracking-wide font-semibold py-3">
                Instructions
              </h3>
              <div className="flex flex-col justify-center items-start gap-3">
                {instructions.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <i className="fas fa-pizza-slice text-red-500 2xl:px-2 pt-1"></i>
                    <p className="flex-1">{step} . </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="py-2 flex justify-between items-center gap-1.5">
            <a
              href="https://www.facebook.com/@IIITDelhi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
            </a>
            <a
              href="https://www.instagram.com/iiit.delhi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/cosylab-iiitd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-x bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/cosylab-iiitd/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselModal;