import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChefHat, Search, Heart, User, Home } from 'lucide-react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Drawer
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#FF6B35',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerStyle: {
              backgroundColor: '#FFFFFF',
              width: 280,
            },
            drawerActiveTintColor: '#FF6B35',
            drawerInactiveTintColor: '#7F8C8D',
            drawerLabelStyle: {
              fontSize: 16,
              fontWeight: '500',
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: 'Inicio',
              headerTitle: 'RecetApp',
              drawerIcon: ({ size, color }) => (
                <Home size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="search"
            options={{
              title: 'Buscar Recetas',
              drawerIcon: ({ size, color }) => (
                <Search size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="favorites"
            options={{
              title: 'Mis Favoritos',
              drawerIcon: ({ size, color }) => (
                <Heart size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="profile"
            options={{
              title: 'Mi Perfil',
              drawerIcon: ({ size, color }) => (
                <User size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="auth"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
        </Drawer>
        <StatusBar style="light" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}