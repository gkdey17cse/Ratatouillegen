// src/pages/Home.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import RecipeModal from "../components/RecipeModal";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Header />
      <Banner />
      {/* <button onClick={() => setIsModalOpen(true)}>Open Modal</button> */}
      <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Carousel jsonFilePath={`${process.env.PUBLIC_URL}/data/recipe.json`} />
      <Footer />
    </div>
  );
}
