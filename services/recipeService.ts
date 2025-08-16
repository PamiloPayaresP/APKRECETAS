interface Recipe {
  _id: string;
  name: string;
  category: string;
  preparationTime: number;
  difficulty: string;
  servings: number;
  image: string;
  ingredients: string[];
  instructions: string[];
  rating: number;
}

interface SearchFilters {
  query: string;
  category?: string;
  difficulty?: string;
  maxTime?: number;
}

export const getRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`/api/recipes/category/${category}`);
    
    if (!response.ok) {
      throw new Error('Error fetching recipes');
    }

    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error('Error in getRecipesByCategory:', error);
    return [];
  }
};

export const searchRecipes = async (filters: SearchFilters): Promise<Recipe[]> => {
  try {
    const params = new URLSearchParams();
    params.append('query', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.maxTime) params.append('maxTime', filters.maxTime.toString());

    const response = await fetch(`/api/recipes/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Error searching recipes');
    }

    const data = await response.json();
    return data.recipes || [];
  } catch (error) {
    console.error('Error in searchRecipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetch(`/api/recipes/${id}`);
    
    if (!response.ok) {
      throw new Error('Error fetching recipe');
    }

    const data = await response.json();
    return data.recipe || null;
  } catch (error) {
    console.error('Error in getRecipeById:', error);
    return null;
  }
};