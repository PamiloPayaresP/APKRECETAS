import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://mypersonalblog255:3226325537@mypersonalblog.jiu416h.mongodb.net/';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request: Request, { category }: { category: string }) {
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
    const recipes = db.collection('recipes');

    // Ensure we have some sample data
    const count = await recipes.countDocuments();
    if (count === 0) {
      await seedRecipes(recipes);
    }

    const categoryRecipes = await recipes
      .find({ category })
      .limit(20)
      .toArray();

    await client.close();

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

async function seedRecipes(recipesCollection: any) {
  const sampleRecipes = [
    {
      name: 'Pancakes Esponjosos',
      category: 'desayunos',
      preparationTime: 20,
      difficulty: 'Fácil',
      servings: 4,
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=300',
      ingredients: ['2 tazas de harina', '2 huevos', '1½ tazas de leche', '2 cdas de azúcar', '1 cda de polvo de hornear'],
      instructions: ['Mezclar ingredientes secos', 'Agregar huevos y leche', 'Cocinar en sartén caliente'],
      rating: 4.8,
      createdAt: new Date(),
    },
    {
      name: 'Ensalada César',
      category: 'almuerzos',
      preparationTime: 15,
      difficulty: 'Fácil',
      servings: 2,
      image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=300',
      ingredients: ['Lechuga romana', 'Queso parmesano', 'Crutones', 'Aderezo césar'],
      instructions: ['Lavar y picar lechuga', 'Agregar crutones', 'Mezclar con aderezo'],
      rating: 4.5,
      createdAt: new Date(),
    },
    {
      name: 'Salmón Teriyaki',
      category: 'cenas',
      preparationTime: 30,
      difficulty: 'Intermedio',
      servings: 3,
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=300',
      ingredients: ['Filete de salmón', 'Salsa teriyaki', 'Arroz', 'Verduras'],
      instructions: ['Marinar el salmón', 'Cocinar a la plancha', 'Servir con arroz'],
      rating: 4.9,
      createdAt: new Date(),
    },
    {
      name: 'Tiramisu Clásico',
      category: 'postres',
      preparationTime: 45,
      difficulty: 'Difícil',
      servings: 6,
      image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=300',
      ingredients: ['Mascarpone', 'Café expreso', 'Bizcochos de soletilla', 'Cacao en polvo'],
      instructions: ['Preparar café', 'Mezclar mascarpone', 'Armar capas', 'Refrigerar 4 horas'],
      rating: 4.7,
      createdAt: new Date(),
    },
    {
      name: 'Smoothie Verde',
      category: 'bebidas',
      preparationTime: 5,
      difficulty: 'Fácil',
      servings: 1,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=300',
      ingredients: ['Espinaca', 'Plátano', 'Manzana verde', 'Agua de coco'],
      instructions: ['Lavar verduras', 'Mezclar en licuadora', 'Servir inmediatamente'],
      rating: 4.3,
      createdAt: new Date(),
    },
  ];

  await recipesCollection.insertMany(sampleRecipes);
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}