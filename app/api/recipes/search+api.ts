import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://mypersonalblog255:3226325537@mypersonalblog.jiu416h.mongodb.net/';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request: Request) {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const category = url.searchParams.get('category');
    const difficulty = url.searchParams.get('difficulty');
    const maxTime = url.searchParams.get('maxTime');

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('recetapp');
    const recipes = db.collection('recipes');

    // Build search criteria
    const searchCriteria: any = {};

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { ingredients: { $elemMatch: { $regex: query, $options: 'i' } } }
      ];
    }

    if (category) {
      searchCriteria.category = category.toLowerCase();
    }

    if (difficulty) {
      searchCriteria.difficulty = difficulty;
    }

    if (maxTime) {
      searchCriteria.preparationTime = { $lte: parseInt(maxTime) };
    }

    const searchResults = await recipes
      .find(searchCriteria)
      .limit(50)
      .toArray();

    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        recipes: searchResults,
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
    console.error('Error searching recipes:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
        recipes: [],
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