import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Heart, Clock, Users, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { getUserFavorites, removeFavorite } from '@/services/favoriteService';

interface Recipe {
  _id: string;
  name: string;
  category: string;
  preparationTime: number;
  difficulty: string;
  servings: number;
  image: string;
  ingredients: string[];
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userFavorites = await getUserFavorites(user.id);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId: string) => {
    Alert.alert(
      'Eliminar de favoritos',
      '¿Estás seguro de que quieres eliminar esta receta de tus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFavorite(user!.id, recipeId);
              setFavorites(favorites.filter(recipe => recipe._id !== recipeId));
            } catch (error) {
              console.error('Error removing favorite:', error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Heart size={64} color="#BDC3C7" />
          <Text style={styles.emptyTitle}>Inicia sesión</Text>
          <Text style={styles.emptyText}>
            Necesitas iniciar sesión para ver tus recetas favoritas
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        {favorites.length} receta{favorites.length !== 1 ? 's' : ''} guardada{favorites.length !== 1 ? 's' : ''}
      </Text>

      <ScrollView style={styles.favoritesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando favoritos...</Text>
          </View>
        ) : favorites.length > 0 ? (
          <View style={styles.favoritesList}>
            {favorites.map((recipe) => (
              <View key={recipe._id} style={styles.favoriteCard}>
                <TouchableOpacity style={styles.favoriteContent}>
                  <Image source={{ uri: recipe.image }} style={styles.favoriteImage} />
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{recipe.name}</Text>
                    <Text style={styles.favoriteCategory}>{recipe.category}</Text>
                    <View style={styles.favoriteDetails}>
                      <View style={styles.detailItem}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.detailText}>{recipe.preparationTime} min</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Users size={14} color="#666" />
                        <Text style={styles.detailText}>{recipe.servings} porciones</Text>
                      </View>
                    </View>
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFavorite(recipe._id)}
                >
                  <Trash2 size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Heart size={64} color="#BDC3C7" />
            <Text style={styles.emptyTitle}>No hay favoritos</Text>
            <Text style={styles.emptyText}>
              Aún no has guardado ninguna receta. Explora las recetas y guarda las que más te gusten.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3E9',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  favoritesContainer: {
    flex: 1,
  },
  favoritesList: {
    paddingBottom: 20,
  },
  favoriteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  favoriteContent: {
    flex: 1,
    flexDirection: 'row',
  },
  favoriteImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  favoriteInfo: {
    flex: 1,
    padding: 16,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  favoriteCategory: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    marginBottom: 8,
  },
  favoriteDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  difficultyBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  removeButton: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flex: 1,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
});