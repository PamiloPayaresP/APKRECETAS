import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = 'mongodb+srv://mypersonalblog255:3226325537@mypersonalblog.jiu416h.mongodb.net/';
const JWT_SECRET = 'your-jwt-secret-key-change-this-in-production';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request: Request) {
  try {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Todos los campos son requeridos'
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

    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
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
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      await client.close();
      return new Response(
        JSON.stringify({
          success: false,
          message: 'El usuario ya existe con este email'
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      _id: new ObjectId(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await users.insertOne(newUser);

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    };

    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        user: userResponse,
        token,
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
    console.error('Register error:', error);
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