// src/App.js
import React, { useState } from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import RecipeModal from "./components/RecipeModal";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      {/* Header Component */}
      <Header />

      {/* Banner Component */}
      <Banner />

      {/* Button to Open Modal (for testing) */}
      <div className="flex justify-center mt-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden py-2.5 px-7 hover:bg-opacity-80 text-red-700 border border-red-800 bg-yellow-200"
        >
          Open Modal
        </button>
      </div>

      {/* Featured Section */}
      <div className="container mx-auto px-2">
        {/* <Carousel jsonFilePath="/data/recipe.json" />   */}
        <Carousel jsonFilePath={`${process.env.PUBLIC_URL}/data/recipe.json`} />
      </div>

      {/* Recipe Modal Component */}
      <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Footer Component */}
      <Footer />
    </div>
    
  );
}

export default App;
