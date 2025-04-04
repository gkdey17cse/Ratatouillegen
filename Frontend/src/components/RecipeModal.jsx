// import React from "react";
// import bannerImage from "../Images/8_MiddleEastern.jpg";
// import Spinner from "./Spinner"; // Import the Spinner component

// // Utility function to capitalize the first letter of a string
// const capitalizeFirstLetter = (str) => {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

// const RecipeModal = ({
//   isOpen,
//   onClose,
//   recipeData,
//   onRegenerate,
//   isRegenerating,
//   progress,
//   isSurpriseMeRecipe, // New prop to track Surprise Me mode
// }) => {
//   // Parse the recipe data
//   const parseRecipeData = () => {
//     if (!recipeData || !recipeData.output_text)
//       return { title: "", ingredients: [], instructions: [] };

//     const { output_text } = recipeData;

//     // Extract the title
//     const titleMatch = output_text.match(/TITLE: (.+)\n/);
//     const title = titleMatch ? titleMatch[1] : "Untitled Recipe";

//     // Extract ingredients
//     const ingredientsMatch = output_text.match(/Ingredients: (.+)\n/);
//     const ingredients = ingredientsMatch
//       ? ingredientsMatch[1].split(" <NEXT_INGR> ").map((ing) => ing.trim())
//       : [];

//     // Extract instructions
//     const instructionsMatch = output_text.match(/Recipe: (.+)/);
//     const instructions = instructionsMatch
//       ? instructionsMatch[1].split(" <NEXT_INSTR> ").map((step) => step.trim())
//       : [];

//     return { title, ingredients, instructions };
//   };

//   const { title, ingredients, instructions } = parseRecipeData();

//   return (
//     <div
//       id="modal"
//       className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-30 p-2 ${
//         isOpen ? "" : "hidden"
//       }`}
//     >
//       <div className="bg-white px-4 xl:px-6 py-6 rounded-lg shadow-lg max-w-5xl w-full max-h-screen overflow-y-auto">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between py-1">
//           <h1 className="text-lg lg:text-xl 2xl:text-2xl font-bold">{title}</h1>
//           <button
//             onClick={onClose}
//             disabled={isRegenerating} // Disable button during regeneration
//             className={`text-white px-2 xl:text-2xl ${
//               isRegenerating
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-red-500 hover:bg-red-700"
//             } rounded-full`}
//           >
//             <i className="fas fa-close"></i>
//           </button>
//         </div>

//         {/* Banner Image */}
//         <div className="py-0.5 2xl:py-2">
//           <div className="flex justify-center items-center py-1 2xl:py-2">
//             <img
//               src={bannerImage}
//               alt="Recipe Banner"
//               className="w-full xl:h-[200px] object-cover"
//             />
//           </div>
//         </div>
//         {/* Banner Image End */}

//         {/* Ingredients & Instructions */}
//         <div className="grid grid-cols-5 gap-2 pt-1.5 pb-4 w-full text-xs lg:text-sm">
//           <div className="col-span-2 bg-[radial-gradient(circle,rgba(253,253,220,0.5)_0%,rgba(255,220,148,0.65)_100%)]">
//             <div className="flex flex-col justify-center items-start px-1.5 pb-8 pt-1.5 2xl:pt-2 text-justify">
//               <h3 className="text-sm lg:text-base 2xl:text-xl tracking-wide font-semibold py-3">
//                 Ingredients
//               </h3>
//               <div className="flex flex-col justify-center items-start gap-2">
//                 {ingredients.length > 0 ? (
//                   ingredients.map((ingredient, index) => (
//                     <div key={index} className="flex items-start gap-2">
//                       <i className="fas fa-hamburger text-red-500 2xl:px-2 pt-1"></i>
//                       <p className="flex-1">{ingredient}.</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No ingredients available.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="col-span-3">
//             <div className="flex flex-col justify-center items-start p-1.5 2xl:p-2 text-justify">
//               <h3 className="text-sm lg:text-base 2xl:text-xl tracking-wide font-semibold py-3">
//                 Instructions
//               </h3>
//               <div className="flex flex-col justify-center items-start gap-3">
//                 {instructions.length > 0 ? (
//                   instructions.map((step, index) => (
//                     <div key={index} className="flex items-start gap-2">
//                       <i className="fas fa-pizza-slice text-red-500 2xl:px-2 pt-1"></i>
//                       <p className="flex-1">{capitalizeFirstLetter(step)}.</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No instructions available.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Ingredients & Instructions End */}

//         {/* Footer */}
//         <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
//           <div className="py-2 flex justify-between items-center gap-1.5">
//             <a
//               href="https://www.facebook.com/@IIITDelhi"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <i className="fab fa-facebook-f bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
//             </a>
//             <a
//               href="https://www.instagram.com/iiit.delhi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <i className="fab fa-instagram bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
//             </a>
//             <a
//               href="https://www.linkedin.com/company/cosylab-iiitd/"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <i className="fab fa-linkedin bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
//             </a>
//           </div>

//           {/* Regenerate Button (Hidden for Surprise Me) */}
//           {!isSurpriseMeRecipe && (
//             <button
//               onClick={onRegenerate}
//               className="py-2.5 px-2 w-44 lg:w-48 lg:h-12 text-sm hover:bg-opacity-80 text-red-700 border border-red-800 bg-yellow-200 flex justify-center items-center"
//               disabled={isRegenerating}
//             >
//               {isRegenerating ? <Spinner progress={progress} /> : "Regenerate"}
//             </button>
//           )}
//         </div>
//         {/* Footer End */}
//       </div>
//     </div>
//   );
// };

// export default RecipeModal;



import React from "react";
import bannerImage from "../Images/8_MiddleEastern.jpg";
import Spinner from "./Spinner";

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const RecipeModal = ({
  isOpen,
  onClose,
  recipeData,
  onRegenerate,
  isRegenerating,
  progress,
  isSurpriseMeRecipe,
}) => {
  // Only added this new function
  const handleShareClick = () => {
    navigator.clipboard.writeText("https://cosylab.iiitd.edu.in/ratatouillegen/")
      .catch(err => console.error('Failed to copy:', err));
  };

  const parseRecipeData = () => {
    if (!recipeData || !recipeData.output_text)
      return { title: "", ingredients: [], instructions: [] };

    const { output_text } = recipeData;
    const titleMatch = output_text.match(/TITLE: (.+)\n/);
    const title = titleMatch ? titleMatch[1] : "Untitled Recipe";

    const ingredientsMatch = output_text.match(/Ingredients: (.+)\n/);
    const ingredients = ingredientsMatch
      ? ingredientsMatch[1].split(" <NEXT_INGR> ").map((ing) => ing.trim())
      : [];

    const instructionsMatch = output_text.match(/Recipe: (.+)/);
    const instructions = instructionsMatch
      ? instructionsMatch[1].split(" <NEXT_INSTR> ").map((step) => step.trim())
      : [];

    return { title, ingredients, instructions };
  };

  const { title, ingredients, instructions } = parseRecipeData();

  return (
    <div
      id="modal"
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-30 p-2 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white px-4 xl:px-6 py-6 rounded-lg shadow-lg max-w-5xl w-full max-h-screen overflow-y-auto">
        {/* Modal Header - Only changed this section */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl 2xl:text-2xl font-bold">{title}</h1>
            <button 
              onClick={handleShareClick}
              className="text-gray-700 hover:text-gray-500 active:translate-x-0.5 active:translate-y-0.5 duration-200"
              title="Share recipe"
            >
              <i className="fas fa-share text-lg"></i>
            </button>
          </div>
          <button
            onClick={onClose}
            disabled={isRegenerating}
            className={`text-white px-2 xl:text-2xl ${
              isRegenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-700"
            } rounded-full`}
          >
            <i className="fas fa-close"></i>
          </button>
        </div>

        {/* Everything below remains EXACTLY the same */}
        <div className="py-0.5 2xl:py-2">
          <div className="flex justify-center items-center py-1 2xl:py-2">
            <img
              src={bannerImage}
              alt="Recipe Banner"
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
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <i className="fas fa-hamburger text-red-500 2xl:px-2 pt-1"></i>
                      <p className="flex-1">{ingredient}.</p>
                    </div>
                  ))
                ) : (
                  <p>No ingredients available.</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="flex flex-col justify-center items-start p-1.5 2xl:p-2 text-justify">
              <h3 className="text-sm lg:text-base 2xl:text-xl tracking-wide font-semibold py-3">
                Instructions
              </h3>
              <div className="flex flex-col justify-center items-start gap-3">
                {instructions.length > 0 ? (
                  instructions.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <i className="fas fa-pizza-slice text-red-500 2xl:px-2 pt-1"></i>
                      <p className="flex-1">{capitalizeFirstLetter(step)}.</p>
                    </div>
                  ))
                ) : (
                  <p>No instructions available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
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
              <i className="fab fa-linkedin bg-blue-500 hover:bg-blue-700 text-white px-2 py-1.5 border-1 border-white rounded-full"></i>
            </a>
          </div>

          {!isSurpriseMeRecipe && (
            <button
              onClick={onRegenerate}
              className="py-2.5 px-2 w-44 lg:w-48 lg:h-12 text-sm hover:bg-opacity-80 text-red-700 border border-red-800 bg-yellow-200 flex justify-center items-center"
              disabled={isRegenerating}
            >
              {isRegenerating ? <Spinner progress={progress} /> : "Regenerate"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;