const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Mock data since MongoDB might not be available in this environment
const mockRecipes = {
  desayunos: [
    {
      _id: '1',
      name: 'Huevos Benedictinos',
      category: 'desayunos',
      preparationTime: 25,
      difficulty: 'Intermedio',
      servings: 4,
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['4 huevos', '2 muffins ingleses', '4 lonchas de jamón', 'Salsa holandesa', 'Mantequilla'],
      instructions: ['Tostar muffins', 'Pochar huevos', 'Preparar salsa holandesa', 'Montar el plato'],
      rating: 4.8,
    },
    {
      _id: '2',
      name: 'Avocado Toast Gourmet',
      category: 'desayunos',
      preparationTime: 10,
      difficulty: 'Fácil',
      servings: 2,
      image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['2 rebanadas de pan integral', '1 aguacate maduro', 'Tomate cherry', 'Queso feta', 'Aceite de oliva'],
      instructions: ['Tostar el pan', 'Machacar aguacate', 'Agregar toppings', 'Servir inmediatamente'],
      rating: 4.6,
    },
    {
      _id: '3',
      name: 'Smoothie Bowl de Açaí',
      category: 'desayunos',
      preparationTime: 15,
      difficulty: 'Fácil',
      servings: 1,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Pulpa de açaí', 'Plátano', 'Granola', 'Fresas', 'Coco rallado', 'Miel'],
      instructions: ['Licuar açaí con plátano', 'Servir en bowl', 'Decorar con toppings'],
      rating: 4.7,
    },
  ],
  almuerzos: [
    {
      _id: '4',
      name: 'Paella Valenciana',
      category: 'almuerzos',
      preparationTime: 45,
      difficulty: 'Difícil',
      servings: 6,
      image: 'https://images.pexels.com/photos/16743486/pexels-photo-16743486.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Arroz bomba', 'Pollo', 'Conejo', 'Judías verdes', 'Garrofón', 'Azafrán', 'Aceite de oliva'],
      instructions: ['Sofreír carnes', 'Agregar verduras', 'Añadir arroz y caldo', 'Cocinar 20 minutos'],
      rating: 4.9,
    },
    {
      _id: '5',
      name: 'Risotto de Hongos',
      category: 'almuerzos',
      preparationTime: 35,
      difficulty: 'Intermedio',
      servings: 4,
      image: 'https://images.pexels.com/photos/8477552/pexels-photo-8477552.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Arroz arborio', 'Hongos mixtos', 'Caldo de verduras', 'Vino blanco', 'Queso parmesano'],
      instructions: ['Saltear hongos', 'Tostar arroz', 'Agregar caldo gradualmente', 'Finalizar con queso'],
      rating: 4.7,
    },
    {
      _id: '6',
      name: 'Tacos de Pescado',
      category: 'almuerzos',
      preparationTime: 20,
      difficulty: 'Fácil',
      servings: 3,
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Pescado blanco', 'Tortillas de maíz', 'Repollo morado', 'Salsa de yogur', 'Cilantro'],
      instructions: ['Cocinar pescado', 'Preparar salsa', 'Calentar tortillas', 'Armar tacos'],
      rating: 4.5,
    },
  ],
  cenas: [
    {
      _id: '7',
      name: 'Filete Wellington',
      category: 'cenas',
      preparationTime: 60,
      difficulty: 'Difícil',
      servings: 4,
      image: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Filete de res', 'Masa hojaldre', 'Hongos', 'Paté', 'Huevo para barnizar'],
      instructions: ['Sellar la carne', 'Preparar duxelles', 'Envolver en hojaldre', 'Hornear 25 minutos'],
      rating: 4.9,
    },
    {
      _id: '8',
      name: 'Salmón a la Plancha',
      category: 'cenas',
      preparationTime: 20,
      difficulty: 'Fácil',
      servings: 2,
      image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Filete de salmón', 'Espárragos', 'Limón', 'Aceite de oliva', 'Hierbas frescas'],
      instructions: ['Sazonar salmón', 'Cocinar a la plancha', 'Saltear espárragos', 'Servir con limón'],
      rating: 4.6,
    },
    {
      _id: '9',
      name: 'Pasta Carbonara',
      category: 'cenas',
      preparationTime: 25,
      difficulty: 'Intermedio',
      servings: 4,
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Spaghetti', 'Panceta', 'Huevos', 'Queso pecorino', 'Pimienta negra'],
      instructions: ['Cocinar pasta', 'Dorar panceta', 'Mezclar huevos y queso', 'Combinar todo'],
      rating: 4.8,
    },
  ],
  postres: [
    {
      _id: '10',
      name: 'Cheesecake de Frutos Rojos',
      category: 'postres',
      preparationTime: 45,
      difficulty: 'Difícil',
      servings: 6,
      image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Queso crema', 'Galletas graham', 'Frutos rojos', 'Azúcar', 'Huevos'],
      instructions: ['Preparar base', 'Mezclar relleno', 'Hornear 50 minutos', 'Refrigerar 4 horas'],
      rating: 4.7,
    },
    {
      _id: '11',
      name: 'Crème Brûlée',
      category: 'postres',
      preparationTime: 40,
      difficulty: 'Difícil',
      servings: 4,
      image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Crema de leche', 'Yemas de huevo', 'Azúcar', 'Vainilla', 'Azúcar para caramelizar'],
      instructions: ['Calentar crema', 'Mezclar con yemas', 'Hornear al baño maría', 'Caramelizar superficie'],
      rating: 4.8,
    },
    {
      _id: '12',
      name: 'Tarta de Chocolate',
      category: 'postres',
      preparationTime: 35,
      difficulty: 'Intermedio',
      servings: 8,
      image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Chocolate negro', 'Mantequilla', 'Huevos', 'Azúcar', 'Harina'],
      instructions: ['Derretir chocolate', 'Batir huevos', 'Mezclar ingredientes', 'Hornear 30 minutos'],
      rating: 4.9,
    },
  ],
  bebidas: [
    {
      _id: '13',
      name: 'Mojito Clásico',
      category: 'bebidas',
      preparationTime: 8,
      difficulty: 'Fácil',
      servings: 1,
      image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Ron blanco', 'Hojas de menta', 'Limón', 'Azúcar', 'Agua con gas', 'Hielo'],
      instructions: ['Machacar menta', 'Agregar limón y azúcar', 'Añadir ron', 'Completar con soda'],
      rating: 4.5,
    },
    {
      _id: '14',
      name: 'Café Frappé',
      category: 'bebidas',
      preparationTime: 5,
      difficulty: 'Fácil',
      servings: 1,
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Café expreso frío', 'Leche', 'Azúcar', 'Hielo', 'Crema batida'],
      instructions: ['Mezclar café con azúcar', 'Agregar leche y hielo', 'Batir hasta espumar', 'Decorar con crema'],
      rating: 4.4,
    },
    {
      _id: '15',
      name: 'Agua de Jamaica',
      category: 'bebidas',
      preparationTime: 15,
      difficulty: 'Fácil',
      servings: 4,
      image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
      ingredients: ['Flores de jamaica', 'Agua', 'Azúcar', 'Limón', 'Hielo'],
      instructions: ['Hervir agua', 'Infusionar jamaica', 'Endulzar al gusto', 'Servir con hielo'],
      rating: 4.2,
    },
  ],
};

export async function GET(request: Request, { category }: { category: string }) {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Return mock data for the requested category
    const categoryRecipes = mockRecipes[category as keyof typeof mockRecipes] || [];

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