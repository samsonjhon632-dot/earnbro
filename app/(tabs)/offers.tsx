import { ScrollView, Text, View, TouchableOpacity, FlatList, TextInput, RefreshControl } from 'react-native';
import { useState, useMemo } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { mockOffers } from '@/lib/mock-data';
import type { Offer } from '@/lib/types';

type SortOption = 'reward-high' | 'reward-low' | 'expiring-soon' | 'newest';

export default function OffersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('reward-high');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'App Install', 'Sign Up', 'Shopping', 'Free Sample', 'Financial'];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter and sort offers
  const filteredOffers = useMemo(() => {
    let results = mockOffers;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      results = results.filter((offer) => offer.category === selectedCategory);
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
      case 'expiring-soon':
        sorted.sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());
        break;
      case 'newest':
        sorted.reverse();
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  const getDaysUntilExpiry = (expiryDate: Date): number => {
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (daysLeft: number): string => {
    if (daysLeft <= 1) return 'text-error';
    if (daysLeft <= 3) return 'text-warning';
    return 'text-success';
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
      >
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border">
          <Text className="text-sm text-muted mb-2">Special Offers</Text>
          <Text className="text-3xl font-bold text-foreground">Claim Rewards</Text>
          <Text className="text-xs text-muted mt-1">{filteredOffers.length} offers available</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 py-4 gap-3">
          <View className="flex-row gap-2 items-center">
            <View className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center gap-2">
              <Text className="text-primary text-lg">🔍</Text>
              <TextInput
                placeholder="Search offers..."
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
                    { id: 'expiring-soon', label: 'Expiring Soon' },
                    { id: 'newest', label: 'Newest' },
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

        {/* Offers List */}
        <View className="px-6 pb-6">
          {filteredOffers.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={filteredOffers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const daysLeft = getDaysUntilExpiry(item.expiresAt);
                const expiryColor = getExpiryColor(daysLeft);

                return (
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
                          <Text className="text-xs text-muted mt-2">
                            📋 {item.actionRequired}
                          </Text>
                        </View>
                        <View className="bg-primary/20 rounded-lg px-3 py-2">
                          <Text className="text-lg font-bold text-success">
                            ${item.reward.toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      {/* Meta Info */}
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row gap-3 items-center">
                          <View className="flex-row items-center gap-1">
                            <Text className="text-xs text-muted">📁</Text>
                            <Text className="text-xs text-muted">{item.category}</Text>
                          </View>
                          <View className={`flex-row items-center gap-1 ${expiryColor}`}>
                            <Text className="text-xs">⏰</Text>
                            <Text className={`text-xs font-semibold ${expiryColor}`}>
                              {daysLeft} days left
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity className="bg-primary rounded-lg px-4 py-2">
                          <Text className="text-xs font-bold text-background">Claim</Text>
                        </TouchableOpacity>
                      </View>
                    </NeonCard>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-4xl mb-3">🎁</Text>
              <Text className="text-foreground font-semibold mb-1">No offers found</Text>
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
