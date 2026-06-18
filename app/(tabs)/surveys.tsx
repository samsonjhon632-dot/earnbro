import React, { useState, useMemo } from 'react';
import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { trpc } from '@/lib/trpc';

type SortOption = 'reward-high' | 'reward-low' | 'time-short' | 'time-long' | 'newest';

export default function SurveysScreen() {
  const { data: surveys, isLoading, refetch } = trpc.surveys.list.useQuery();
  const completeMutation = trpc.surveys.complete.useMutation({
    onSuccess: () => refetch(),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('reward-high');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'General', 'Technology', 'Shopping', 'Health', 'Entertainment'];

  // Filter and sort surveys
  const filteredSurveys = useMemo(() => {
    let results = surveys || [];

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (survey) =>
          survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          survey.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
        sorted.sort((a, b) => parseFloat(b.reward) - parseFloat(a.reward));
        break;
      case 'reward-low':
        sorted.sort((a, b) => parseFloat(a.reward) - parseFloat(b.reward));
        break;
      case 'time-short':
        sorted.sort((a, b) => a.estimatedTime - b.estimatedTime);
        break;
      case 'time-long':
        sorted.sort((a, b) => b.estimatedTime - a.estimatedTime);
        break;
      case 'newest':
        sorted.reverse();
        break;
    }

    return sorted;
  }, [surveys, searchQuery, selectedCategory, sortBy]);

  const handleCompleteSurvey = async (surveyId: number) => {
    try {
      await completeMutation.mutateAsync({ surveyId });
    } catch (error) {
      console.error('Failed to complete survey:', error);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border">
          <Text className="text-2xl font-bold text-foreground mb-4">Available Surveys</Text>
          <TextInput
            placeholder="Search surveys..."
            placeholderTextColor="#687076"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category === 'All' ? null : category)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View
                className={`px-4 py-2 rounded-full border ${
                  (selectedCategory === category || (category === 'All' && !selectedCategory))
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    (selectedCategory === category || (category === 'All' && !selectedCategory))
                      ? 'text-background'
                      : 'text-foreground'
                  }`}
                >
                  {category}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Sort Options */}
        <View className="px-6 py-4 flex-row gap-2 flex-wrap">
          {(['reward-high', 'reward-low', 'time-short'] as SortOption[]).map((option) => (
            <Pressable
              key={option}
              onPress={() => setSortBy(option)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className={`px-3 py-1 rounded-full ${
                  sortBy === option ? 'bg-primary' : 'bg-surface border border-border'
                }`}
              >
                <Text className={`text-xs font-semibold ${sortBy === option ? 'text-background' : 'text-foreground'}`}>
                  {option === 'reward-high' && '💰 High Pay'}
                  {option === 'reward-low' && '💵 Low Pay'}
                  {option === 'time-short' && '⚡ Quick'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Surveys List */}
        <View className="px-6 py-4 gap-3 pb-8">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => (
              <NeonCard key={survey.id} className="p-4 gap-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">{survey.title}</Text>
                    <Text className="text-xs text-muted mt-1">{survey.description}</Text>
                  </View>
                  <Text className="text-lg font-bold text-success">${survey.reward}</Text>
                </View>

                <View className="flex-row gap-4 items-center">
                  <View className="flex-row gap-1 items-center">
                    <Text className="text-xs text-muted">⏱️</Text>
                    <Text className="text-xs text-muted">{survey.estimatedTime} min</Text>
                  </View>
                  <View className="flex-row gap-1 items-center">
                    <Text className="text-xs text-muted">📋</Text>
                    <Text className="text-xs text-muted">{survey.questions} questions</Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => handleCompleteSurvey(survey.id)}
                  disabled={completeMutation.isPending}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <View className="bg-primary rounded-lg py-2 px-4 items-center">
                    <Text className="text-background font-bold">
                      {completeMutation.isPending ? 'Starting...' : 'Start Survey'}
                    </Text>
                  </View>
                </Pressable>
              </NeonCard>
            ))
          ) : (
            <Text className="text-muted text-center py-8">No surveys available</Text>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
