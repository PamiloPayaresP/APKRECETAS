import { getRecipesByCategory } from '@/data/recipes';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const category = pathSegments[pathSegments.length - 1];

    if (!category) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Categoría no especificada',
          recipes: [],
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const categoryRecipes = getRecipesByCategory(category);

    return new Response(
      JSON.stringify({
        success: true,
        recipes: categoryRecipes,
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
    console.error('Error fetching recipes by category:', error);
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