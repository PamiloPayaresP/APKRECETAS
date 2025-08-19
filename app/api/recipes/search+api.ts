import { searchRecipes } from '@/data/recipes';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const category = url.searchParams.get('category');
    const difficulty = url.searchParams.get('difficulty');
    const maxTime = url.searchParams.get('maxTime');

    const searchResults = searchRecipes({
      query,
      category: category || undefined,
      difficulty: difficulty || undefined,
      maxTime: maxTime ? parseInt(maxTime) : undefined,
    });

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