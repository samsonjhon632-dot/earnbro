import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { useAuth } from '@/hooks/use-auth';
import { trpc } from '@/lib/trpc';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'offer' | 'game' | 'cashback'>('all');

  // Fetch wallet balance
  const walletQuery = trpc.wallet.getBalance.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch available offers
  const offersQuery = trpc.offers.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch available games
  const gamesQuery = trpc.games.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const wallet = walletQuery.data;
  const offers = offersQuery.data || [];
  const games = gamesQuery.data || [];

  // Combine all tasks
  const allTasks = [
    ...offers.map(offer => ({
      id: `offer-${offer.id}`,
      title: offer.title,
      description: offer.description,
      reward: offer.reward,
      type: 'offer' as const,
      icon: '🎁',
      data: offer,
    })),
    ...games.map(game => ({
      id: `game-${game.id}`,
      title: game.title,
      description: game.description,
      reward: game.reward,
      type: 'game' as const,
      icon: '🎮',
      time: '1-5 min',
      data: game,
    })),
  ];

  const filteredTasks = selectedFilter === 'all' ? allTasks : allTasks.filter(t => t.type === selectedFilter);

  const handleTaskPress = (task: any) => {
    if (task.type === 'offer') {
      Alert.alert('Offer', `Claim ${task.title}? You'll earn $${parseFloat(task.reward).toFixed(2)}`);
    } else if (task.type === 'game') {
      Alert.alert('Game', `Play ${task.title}? Win up to $${parseFloat(task.reward).toFixed(2)}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Please log in to view available tasks</Text>
      </ScreenContainer>
    );
  }

  const isLoading = walletQuery.isLoading || offersQuery.isLoading || gamesQuery.isLoading;

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="px-6 py-6 gap-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted">Welcome back,</Text>
              <Text className="text-2xl font-bold text-foreground">{user?.name || 'User'}</Text>
            </View>
            <Text className="text-4xl">💰</Text>
          </View>

          {/* Balance Card */}
          <FuturisticCard className="p-6 gap-3" gradient="cyan">
            <Text className="text-sm text-muted">Your Balance</Text>
            {walletQuery.isLoading ? (
              <ActivityIndicator size="large" color="#00D9FF" />
            ) : (
              <>
                <Text className="text-4xl font-bold text-primary">
                  ${wallet?.balance ? parseFloat(wallet.balance).toFixed(2) : '0.00'}
                </Text>
                <View className="flex-row gap-4 pt-2">
                  <View>
                    <Text className="text-xs text-muted">Total Earned</Text>
                    <Text className="text-lg font-bold text-success mt-1">
                      ${wallet?.totalEarned ? parseFloat(wallet.totalEarned).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                  <View className="w-px bg-border" />
                  <View>
                    <Text className="text-xs text-muted">Withdrawn</Text>
                    <Text className="text-lg font-bold text-warning mt-1">
                      ${wallet?.totalWithdrawn ? parseFloat(wallet.totalWithdrawn).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </FuturisticCard>
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-4 flex-row gap-3">
          <FuturisticCard className="flex-1 p-4 items-center gap-2" gradient="purple">
            <Text className="text-2xl">📋</Text>
            <Text className="text-lg font-bold text-foreground">{offers.length}</Text>
            <Text className="text-xs text-muted">Offers</Text>
          </FuturisticCard>
          <FuturisticCard className="flex-1 p-4 items-center gap-2" gradient="pink">
            <Text className="text-2xl">🎮</Text>
            <Text className="text-lg font-bold text-foreground">{games.length}</Text>
            <Text className="text-xs text-muted">Games</Text>
          </FuturisticCard>
          <FuturisticCard className="flex-1 p-4 items-center gap-2" gradient="blue">
            <Text className="text-2xl">⭐</Text>
            <Text className="text-lg font-bold text-foreground">4.8</Text>
            <Text className="text-xs text-muted">Rating</Text>
          </FuturisticCard>
        </View>

        {/* Filters */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Available Tasks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            {['all', 'offer', 'game'].map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter as any)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View
                  className={`px-4 py-2 rounded-full ${
                    selectedFilter === filter
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold capitalize ${
                      selectedFilter === filter ? 'text-background' : 'text-foreground'
                    }`}
                  >
                    {filter}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Tasks List */}
        <View className="px-6 pb-6">
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#00D9FF" />
            </View>
          ) : filteredTasks.length === 0 ? (
            <FuturisticCard className="p-8 items-center gap-2" gradient="purple">
              <Text className="text-3xl">📭</Text>
              <Text className="text-sm text-muted">No tasks available</Text>
              <Text className="text-xs text-muted mt-2">Check back soon for more!</Text>
            </FuturisticCard>
          ) : (
            <FlatList
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleTaskPress(item)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <FuturisticCard className="p-4 gap-3 mb-3" gradient="cyan">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-row gap-3 flex-1">
                        <Text className="text-3xl">{item.icon}</Text>
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-foreground">{item.title}</Text>
                          <Text className="text-xs text-muted mt-1">{item.description}</Text>
                          {item.type === 'game' && <Text className="text-xs text-primary mt-1">⏱️ {item.time}</Text>}
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-lg font-bold text-success">
                          ${parseFloat(item.reward).toFixed(2)}
                        </Text>
                        <Pressable
                          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                          className="mt-2"
                        >
                          <View className="bg-primary px-3 py-1 rounded-full">
                            <Text className="text-background text-xs font-bold">Start</Text>
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  </FuturisticCard>
                </Pressable>
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
