import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://mypersonalblog255:3226325537@mypersonalblog.jiu416h.mongodb.net/';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
  try {
    const { userId, recipeId } = await request.json();

    if (!userId || !recipeId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Usuario y receta son requeridos'
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

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('recetapp');
    const favorites = db.collection('favorites');

    // Check if already exists
    const existing = await favorites.findOne({ userId, recipeId });

    if (existing) {
      await client.close();
      return new Response(
        JSON.stringify({
          success: false,
          message: 'La receta ya está en favoritos'
        }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    await favorites.insertOne({
      userId,
      recipeId,
      createdAt: new Date(),
    });

    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Receta agregada a favoritos'
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error adding favorite:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor'
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

export async function DELETE(request: Request) {
  try {
    const { userId, recipeId } = await request.json();

    if (!userId || !recipeId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Usuario y receta son requeridos'
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

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('recetapp');
    const favorites = db.collection('favorites');

    const result = await favorites.deleteOne({ userId, recipeId });

    await client.close();

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Favorito no encontrado'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Receta eliminada de favoritos'
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
    console.error('Error removing favorite:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor'
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