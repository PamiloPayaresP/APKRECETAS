interface Recipe {
  _id: string;
  name: string;
  category: string;
  preparationTime: number;
  difficulty: string;
  servings: number;
  image: string;
  ingredients: string[];
}

export const getUserFavorites = async (userId: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`/api/favorites/${userId}`);
    
    if (!response.ok) {
      throw new Error('Error fetching favorites');
    }

    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    return [];
  }
};

export const addFavorite = async (userId: string, recipeId: string): Promise<void> => {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, recipeId }),
    });

    if (!response.ok) {
      throw new Error('Error adding favorite');
    }
  } catch (error) {
    console.error('Error in addFavorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId: string, recipeId: string): Promise<void> => {
  try {
    const response = await fetch('/api/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, recipeId }),
    });

    if (!response.ok) {
      throw new Error('Error removing favorite');
    }
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    throw error;
  }
};