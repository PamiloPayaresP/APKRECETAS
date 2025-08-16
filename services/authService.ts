interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export const authUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Error de autenticación');
    }

    if (data.token) {
      // Store token for future requests
      // In a real app, you'd use secure storage
      localStorage.setItem('authToken', data.token);
    }

    return data.user!;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  name: string, 
  email: string, 
  password: string
): Promise<User> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data: RegisterResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Error en el registro');
    }

    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data.user!;
  } catch (error) {
    throw error;
  }
};

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
};