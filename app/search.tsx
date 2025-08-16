import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Search as SearchIcon, Filter, X } from 'lucide-react-native';
import { searchRecipes } from '@/services/recipeService';

interface Recipe {
  _id: string;
  name: string;
  category: string;
  preparationTime: number;
  difficulty: string;
  image: string;
  ingredients: string[];
}

const difficulties = ['Fácil', 'Intermedio', 'Difícil'];
const categories = ['Desayunos', 'Almuerzos', 'Cenas', 'Postres', 'Bebidas'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchRecipes({
        query: searchQuery,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        maxTime: maxTime ? parseInt(maxTime) : undefined,
      });
      setRecipes(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDifficulty('');
    setMaxTime('');
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timeoutId = setTimeout(handleSearch, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, maxTime]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#7F8C8D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o ingrediente..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#BDC3C7"
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Categoría:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.selectedChip
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category ? '' : category
                  )}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.selectedChipText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Dificultad:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.filterChip,
                    selectedDifficulty === difficulty && styles.selectedChip
                  ]}
                  onPress={() => setSelectedDifficulty(
                    selectedDifficulty === difficulty ? '' : difficulty
                  )}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedDifficulty === difficulty && styles.selectedChipText
                  ]}>
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Tiempo máximo (min):</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="30"
              value={maxTime}
              onChangeText={setMaxTime}
              keyboardType="numeric"
              placeholderTextColor="#BDC3C7"
            />
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <X size={16} color="#E74C3C" />
              <Text style={styles.clearText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Buscando recetas...</Text>
          </View>
        ) : recipes.length > 0 ? (
          <View style={styles.recipesList}>
            {recipes.map((recipe) => (
              <TouchableOpacity key={recipe._id} style={styles.recipeItem}>
                <Image source={{ uri: recipe.image }} style={styles.recipeThumb} />
                <View style={styles.recipeContent}>
                  <Text style={styles.recipeTitle}>{recipe.name}</Text>
                  <Text style={styles.recipeCategory}>{recipe.category}</Text>
                  <View style={styles.recipeMetadata}>
                    <Text style={styles.metadataText}>{recipe.preparationTime} min</Text>
                    <Text style={styles.metadataText}>•</Text>
                    <Text style={styles.metadataText}>{recipe.difficulty}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : searchQuery.length > 2 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No se encontraron recetas para "{searchQuery}"
            </Text>
          </View>
        ) : (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Escribe algo para buscar recetas deliciosas
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 8,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  timeInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
    marginRight: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  clearText: {
    color: '#E74C3C',
    fontSize: 12,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
  },
  recipesList: {
    paddingTop: 16,
  },
  recipeItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeThumb: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  recipeContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  recipeCategory: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    marginBottom: 8,
  },
  recipeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataText: {
    fontSize: 12,
    color: '#7F8C8D',
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
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  welcomeText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});