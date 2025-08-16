import { MongoClient, ObjectId } from 'npm:mongodb@latest';

const MONGODB_URI = 'mongodb+srv://mypersonalblog255:3226325537@mypersonalblog.jiu416h.mongodb.net/';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request: Request, { userId }: { userId: string }) {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('recetapp');
    const favorites = db.collection('favorites');
    const recipes = db.collection('recipes');

    // Get user's favorite recipe IDs
    const userFavorites = await favorites
      .find({ userId })
      .toArray();

    const favoriteRecipeIds = userFavorites.map(fav => new ObjectId(fav.recipeId));

    // Get the actual recipe data
    const favoriteRecipes = await recipes
      .find({ _id: { $in: favoriteRecipeIds } })
      .toArray();

    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        favorites: favoriteRecipes,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
        favorites: [],
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}