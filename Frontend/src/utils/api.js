// const API_BASE_URL = "/ratatouillegen-api";   // New API path (HTTPS) / Deployement
const API_BASE_URL = "http://192.168.1.92:8003";   // API for Debugg & Test / Development

export const fetchIngredients = async (region) => {
  const response = await fetch(`${API_BASE_URL}/fetch_ing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ region }),
  });
  return response.json();
};

export const generateRecipe = async (ingredients, region) => {
  const response = await fetch(`${API_BASE_URL}/generate_recipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients, region }),
  });
  return response.json();
};


