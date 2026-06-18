import { ScrollView, Text, View, TouchableOpacity, FlatList, TextInput, RefreshControl } from 'react-native';
import { useState, useMemo } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { mockSurveys } from '@/lib/mock-data';
import type { Survey } from '@/lib/types';

type SortOption = 'reward-high' | 'reward-low' | 'time-short' | 'time-long' | 'newest';

export default function SurveysScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('reward-high');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'General', 'Technology', 'Shopping', 'Health', 'Entertainment'];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter and sort surveys
  const filteredSurveys = useMemo(() => {
    let results = mockSurveys;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (survey) =>
          survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          survey.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      results = results.filter((survey) => survey.category === selectedCategory);
    }

    // Sort
    const sorted = [...results];
    switch (sortBy) {
      case 'reward-high':
        sorted.sort((a, b) => b.reward - a.reward);
        break;
      case 'reward-low':
        sorted.sort((a, b) => a.reward - b.reward);
        break;
      case 'time-short':
        sorted.sort((a, b) => a.estimatedTime - b.estimatedTime);
        break;
      case 'time-long':
        sorted.sort((a, b) => b.estimatedTime - a.estimatedTime);
        break;
      case 'newest':
        // Assume newer surveys are at the end of the array
        sorted.reverse();
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
      >
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border">
          <Text className="text-sm text-muted mb-2">Available Surveys</Text>
          <Text className="text-3xl font-bold text-foreground">Earn Cash</Text>
          <Text className="text-xs text-muted mt-1">{filteredSurveys.length} surveys available</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 py-4 gap-3">
          <View className="flex-row gap-2 items-center">
            <View className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center gap-2">
              <Text className="text-primary text-lg">🔍</Text>
              <TextInput
                placeholder="Search surveys..."
                placeholderTextColor="#8892B0"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-foreground text-sm"
              />
            </View>
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              className="bg-surface border border-border rounded-lg p-3"
            >
              <Text className="text-primary text-lg">⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Panel */}
          {showFilters && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-3">
              {/* Sort Options */}
              <View>
                <Text className="text-xs text-primary font-bold mb-2 uppercase">Sort By</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { id: 'reward-high', label: 'Highest Reward' },
                    { id: 'reward-low', label: 'Lowest Reward' },
                    { id: 'time-short', label: 'Quickest' },
                    { id: 'time-long', label: 'Longest' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => setSortBy(option.id as SortOption)}
                      className={`px-3 py-2 rounded-lg border ${
                        sortBy === option.id
                          ? 'bg-primary border-primary'
                          : 'bg-transparent border-border'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          sortBy === option.id ? 'text-background' : 'text-foreground'
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category Filter */}
              <View>
                <Text className="text-xs text-primary font-bold mb-2 uppercase">Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() =>
                        setSelectedCategory(category === 'All' ? null : category)
                      }
                      className={`px-3 py-2 rounded-lg border ${
                        (category === 'All' && !selectedCategory) ||
                        selectedCategory === category
                          ? 'bg-primary border-primary'
                          : 'bg-transparent border-border'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          (category === 'All' && !selectedCategory) ||
                          selectedCategory === category
                            ? 'text-background'
                            : 'text-foreground'
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Surveys List */}
        <View className="px-6 pb-6">
          {filteredSurveys.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={filteredSurveys}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="mb-3"
                >
                  <NeonCard className="bg-surface border-border">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1 pr-3">
                        <Text className="text-base font-bold text-foreground">
                          {item.title}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {item.description}
                        </Text>
                      </View>
                      <View className="bg-primary/20 rounded-lg px-3 py-2">
                        <Text className="text-lg font-bold text-success">
                          ${item.reward.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="w-full bg-border rounded-full h-1.5 mb-3 overflow-hidden">
                      <View
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${item.completionPercentage}%` }}
                      />
                    </View>

                    {/* Meta Info */}
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row gap-3">
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs text-muted">⏱</Text>
                          <Text className="text-xs text-muted">
                            {item.estimatedTime} min
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Text className="text-xs text-muted">📁</Text>
                          <Text className="text-xs text-muted">{item.category}</Text>
                        </View>
                      </View>
                      <TouchableOpacity className="bg-primary rounded-lg px-4 py-2">
                        <Text className="text-xs font-bold text-background">Start</Text>
                      </TouchableOpacity>
                    </View>
                  </NeonCard>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-4xl mb-3">🔍</Text>
              <Text className="text-foreground font-semibold mb-1">No surveys found</Text>
              <Text className="text-muted text-sm text-center">
                Try adjusting your filters or search query
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}
