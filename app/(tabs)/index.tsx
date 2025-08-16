import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Clock, Users, Star } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { getRecipesByCategory } from '@/services/recipeService';

const { width } = Dimensions.get('window');

interface Recipe {
  _id: string;
  name: string;
  category: string;
  preparationTime: number;
  difficulty: string;
  servings: number;
  image: string;
  rating: number;
}

const categories = [
  { id: 'desayunos', name: 'Desayunos', color: '#FFE4B5' },
  { id: 'almuerzos', name: 'Almuerzos', color: '#E6F3FF' },
  { id: 'cenas', name: 'Cenas', color: '#F0E6FF' },
  { id: 'postres', name: 'Postres', color: '#FFE6F3' },
  { id: 'bebidas', name: 'Bebidas', color: '#E6FFE6' },
];

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('desayunos');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadRecipes = async (category: string) => {
    setLoading(true);
    try {
      const categoryRecipes = await getRecipesByCategory(category);
      setRecipes(categoryRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes(selectedCategory);
  }, [selectedCategory]);

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <View style={styles.recipeDetails}>
          <View style={styles.detailItem}>
            <Clock size={14} color="#666" />
            <Text style={styles.detailText}>{recipe.preparationTime} min</Text>
          </View>
          <View style={styles.detailItem}>
            <Users size={14} color="#666" />
            <Text style={styles.detailText}>{recipe.servings} porciones</Text>
          </View>
          <View style={styles.detailItem}>
            <Star size={14} color="#FFD700" />
            <Text style={styles.detailText}>{recipe.rating}</Text>
          </View>
        </View>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola, {user?.name || 'Chef'}! 👨‍🍳</Text>
        <Text style={styles.subtitle}>¿Qué cocinaremos hoy?</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              { backgroundColor: category.color },
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.recipesContainer}>
        <Text style={styles.sectionTitle}>
          Recetas de {categories.find(c => c.id === selectedCategory)?.name}
        </Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando recetas...</Text>
          </View>
        ) : (
          <View style={styles.recipesGrid}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
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
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  categoriesContainer: {
    marginVertical: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  recipesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  recipeCard: {
    width: (width - 52) / 2,
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
  },
  recipeImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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