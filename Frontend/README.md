# Ratatouille Frontend (React)

The **Ratatouille React** project is a recipe recommendation web application built with React. It fetches ingredient data and generates recipes based on user-selected cuisine and ingredients. The application interacts with APIs and displays recipes using modals and carousels.

## 1. Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (Recommended: v16 or later)
- **npm** (Comes with Node.js)

## 2. Getting Started

### 2.1. Clone or Download the Project

- Download from Google Drive, extract the ZIP file to a local directory.

Navigate to the project folder:

```sh
cd ratatouille-react/Frontend
```

### 2.2. Install Dependencies

Run the following command to install the required dependencies:

```sh
npm install
```

### 2.3. Start the Development Server

To start the project in development mode, run:

```sh
npm start
```

This will launch the app in your default browser at `http://localhost:3000/`.

### 2.4. Build for Production

To generate an optimized build for production, use:

```sh
npm run build
```

This will create a `build/` folder containing all the optimized assets.

### 2.5. Running Tests (Optional)

If you want to run tests, use:

```sh
npm test
```

## 3. Project Directory Structure

```bash
ratatouille-react/
├── public/
│   ├── index.html
│   ├── data/
│   │   ├── recipe.json
│   │   ├── logo.png
│   │   ├── ingredients_freq_count.json
│   │   ├── processed_ingredient_data.csv
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Banner.jsx
│   │   ├── RecipeModal.jsx
│   │   ├── MultiSelectDropdown.jsx
│   │   ├── Carousel.jsx
│   │   ├── Footer.jsx
│   │   ├── CarouselModal.jsx
│   │   ├── Spinner.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   ├── Images/
│   ├── utils/
│   │   ├── api.js
│   │   ├── apiPipeline.js
│   ├── App.js
│   ├── index.js
│   ├── index.css
├── package.json
├── package-lock.json
├── README.md
├── .dockerignore
├── Dockerfile
```

## 4. Project Structure Explanation

### 4.1. `public/`

- **index.html**: The main HTML file that serves as the entry point.
- **data/**: Contains JSON and CSV data files:
  - `recipe.json`: Stores preloaded recipe data.
  - `ingredients_freq_count.json`: Stores ingredient frequency data for sorting.
  - `processed_ingredient_data.csv`: Stores preprocessed ingredient data.

### 4.2. `src/`

Contains all the React components, pages, and utilities.

#### 4.2.1. `components/`

- **Header.jsx**: Displays the header with the project name and social media links.

  - `Header()`: Renders the application header with logos and social media links.

- **Banner.jsx**: The main user interface for selecting cuisines and ingredients. It fetches ingredient data and handles recipe generation.
  - `useEffect()`: Fetches ingredient data when cuisine is selected.
  - `handleIngredientSelect(ingredient)`: Toggles ingredient selection.
  - `fetchIngredientsFromCSV()`: Loads ingredient data from a CSV file.
  - `handleSurpriseMe()`: Selects random ingredients and generates a recipe.
  - `handleGenerateRecipe()`: Generates a recipe based on selected ingredients.
  - `handleRegenerateRecipe()`: Regenerates the recipe based on the same inputs.
- **RecipeModal.jsx**: Displays generated recipes, including title, ingredients, and instructions.

  - `parseRecipeData()`: Extracts recipe title, ingredients, and instructions from API response.
  - `capitalizeFirstLetter(str)`: Capitalizes the first letter of a given string.

- **MultiSelectDropdown.jsx**: A dropdown component for selecting multiple ingredients.

  - `toggleDropdown()`: Opens and closes the dropdown menu.
  - `handleIngredientSelect(ingredient)`: Selects an ingredient from the dropdown.
  - `handleIngredientDeselect(ingredient)`: Removes an ingredient from selection.
  - `displaySelectedIngredients()`: Displays selected ingredients with a limit.

- **Carousel.jsx**: Displays featured recipes in a sliding format.

  - `fetchRecipes()`: Loads recipe data from JSON.
  - `moveSlide(direction)`: Moves the carousel in the specified direction.
  - `startAutoSlide()`: Initiates automatic sliding of the carousel.
  - `stopAutoSlide()`: Stops the automatic sliding.
  - `handleSeeRecipeClick(recipe)`: Opens the recipe details modal.

- **CarouselModal.jsx**: Displays detailed recipe information from the carousel.

  - `parseRecipeData()`: Extracts recipe details and structures them for display.

- **Spinner.jsx**: A loading spinner used while waiting for API responses.

#### 4.2.2. `pages/`

- **Home.jsx**: The main page that integrates components like `Header`, `Banner`, and `Carousel`.
  - `Home()`: Renders the homepage layout and initializes the UI.

#### 4.2.3. `utils/`

- **api.js**: Handles API calls for fetching ingredients and generating recipes.

  - `fetchIngredients(region)`: Fetches ingredient data for a selected cuisine.
  - `generateRecipe(ingredients, region)`: Requests a recipe based on selected ingredients and region.

- **apiPipeline.js**: Fetches and processes ingredient data from the API and JSON files.
  - `loadIngredientFrequencies()`: Loads ingredient frequency data from JSON.
  - `fetchIngredients(region)`: Fetches and sorts ingredients based on frequency.
  - `generateRecipe(ingredients, region)`: Calls the API to generate a recipe.

#### 4.3. Other Files

- **App.js**: The main application component that integrates all core functionalities.
  - `App()`: Manages modal states and integrates key components.
- **index.js**: The entry point for rendering the React app.
- **index.css**: Contains global styles.
- **tailwind.config.js**: Configures Tailwind CSS.
- **package.json**: Defines project dependencies and scripts.

## 5. Debugging & Troubleshooting

- **Issues with API Calls**:
  - Check `api.js` and `apiPipeline.js` for incorrect API endpoints.
  - Ensure the backend is running and accessible.
- **UI Not Updating**:
  - Verify state updates in components using `useState` and `useEffect`.
- **Carousel Not Sliding Properly**:
  - Inspect `Carousel.jsx` to ensure `useEffect` dependencies are correct.

## 6. Conclusion

This documentation provides an overview of the project's structure and functionalities. If any bug arises, refer to the relevant component or API function based on the issue.
