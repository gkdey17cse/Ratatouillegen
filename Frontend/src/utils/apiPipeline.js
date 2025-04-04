const API_BASE_URL = "/ratatouillegen-api";   // New API path (HTTPS)
// const API_BASE_URL = "http://192.168.1.92:8003";   // API for Debugg & Test

// Function to load and parse the JSON file
const loadIngredientFrequencies = async () => {
  try {
    // console.log("Loading ingredient frequencies from JSON file..."); // Debugging Code 
    // const response = await fetch("/data/ingredients_freq_count.json"); // Path to the JSON file
    const response = await fetch(`${process.env.PUBLIC_URL}/data/ingredients_freq_count.json`);
    if (!response.ok) {
      console.error("Failed to fetch JSON file:", response.statusText);
      return {};
    }

    const data = await response.json();
    // console.log("JSON file loaded successfully:", data);  // Debugging Code
    return data; // Return the parsed JSON data
  } catch (error) {
    console.error("Error loading ingredient frequencies:", error);
    return {};
  }
};

export const fetchIngredients = async (region) => {
  try {
    // console.log("Fetching ingredients from API for region:", region);  // Debugging Code
    const response = await fetch(`${API_BASE_URL}/fetch_ing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ region }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }

    const data = await response.json();
    // console.log("API response received:", data); // Debugging Code

    let ingredients = JSON.parse(data.ingredients);
    let ingredientList = Array.isArray(ingredients) ? ingredients : [];
    // console.log("Ingredients parsed from API:", ingredientList); // Debugging Code

    // Load the frequency map from the JSON file
    const frequencyMap = await loadIngredientFrequencies();
    // console.log("Frequency map loaded:", frequencyMap); // Debugging Code

    // Get the frequency data for the selected region
    const regionFrequencies = frequencyMap[region] || {};
    // console.log("Region frequencies:", regionFrequencies); // Debugging Code

    // Ensure case-insensitive matching and clean ingredient names
    ingredientList = ingredientList.map((ingredient) =>
      ingredient
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .toLowerCase()
    );

    // Sort ingredients based on frequency (descending order)
    ingredientList.sort((a, b) => {
      const freqA = regionFrequencies[a] || 0; // Default to 0 if not found
      const freqB = regionFrequencies[b] || 0; // Default to 0 if not found
      return freqB - freqA; // Sort in descending order
    });

    // console.log("Sorted ingredients:", ingredientList); // Debugging Code
    return ingredientList;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

export const generateRecipe = async (ingredients, region) => {
  // console.log(ingredients, region); // Debugging Code
  try {
    // console.log(
    //   "Generating recipe for ingredients:",
    //   ingredients,
    //   "and region:",
    //   region
    // ); // Debugging Code
    const response = await fetch(`${API_BASE_URL}/generate_recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients, region }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate recipe");
    }

    const data = await response.json();
    // console.log("Recipe generated successfully:", data);  // Debugging Code
    return data;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};
