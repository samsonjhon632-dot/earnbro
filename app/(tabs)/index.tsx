import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, FlatList, Image } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { useAuth } from '@/lib/auth-context';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number | string;
  type: 'video' | 'offer' | 'game' | 'cashback';
  icon: string;
  time?: string;
  completed?: boolean;
}

const TASKS: Task[] = [
  {
    id: '1',
    title: 'Watch Video - Tech Review',
    description: 'Watch a 2-min video about new tech',
    reward: 0.5,
    type: 'video',
    icon: '🎬',
    time: '2 min',
  },
  {
    id: '2',
    title: 'Amazon Cashback',
    description: 'Shop on Amazon and earn 5% cashback',
    reward: 'Variable',
    type: 'cashback',
    icon: '🛍️',
  },
  {
    id: '3',
    title: 'DoorDash Offer',
    description: '$5 off on your next order',
    reward: 2.5,
    type: 'offer',
    icon: '🍔',
  },
  {
    id: '4',
    title: 'Play Mini Game',
    description: 'Play scratch-off game and win',
    reward: 0.25,
    type: 'game',
    icon: '🎮',
    time: '1 min',
  },
  {
    id: '5',
    title: 'Watch Video - Movie Trailer',
    description: 'Watch upcoming movie trailer',
    reward: 0.75,
    type: 'video',
    icon: '🎬',
    time: '3 min',
  },
  {
    id: '6',
    title: 'Uber Eats Bonus',
    description: 'Get $10 credit on first order',
    reward: 3.0,
    type: 'offer',
    icon: '🚗',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'offer' | 'game' | 'cashback'>('all');

  const filteredTasks = selectedFilter === 'all' ? TASKS : TASKS.filter(t => t.type === selectedFilter);

  const renderTaskCard = ({ item }: { item: Task }) => (
    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
      <FuturisticCard className="p-4 gap-3 mb-3" gradient="cyan">
        <View className="flex-row justify-between items-start">
          <View className="flex-row gap-3 flex-1">
            <Text className="text-3xl">{item.icon}</Text>
            <View className="flex-1">
              <Text className="text-sm font-bold text-foreground">{item.title}</Text>
              <Text className="text-xs text-muted mt-1">{item.description}</Text>
              {item.time && <Text className="text-xs text-primary mt-1">⏱️ {item.time}</Text>}
            </View>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-success">
              {typeof item.reward === 'number' ? `$${item.reward.toFixed(2)}` : item.reward}
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
  );

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header with Balance */}
        <View className="px-6 py-6 gap-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-muted">Welcome back,</Text>
              <Text className="text-2xl font-bold text-foreground">{user?.name || 'User'}</Text>
            </View>
            <Text className="text-3xl">💰</Text>
          </View>

          {/* Balance Card */}
          <FuturisticCard className="p-6 gap-3" gradient="purple">
            <Text className="text-sm text-muted">Your Balance</Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-4xl font-bold text-success">$245.50</Text>
              <Text className="text-xs text-muted">+$12.50 this week</Text>
            </View>
            <View className="flex-row gap-2 mt-2">
              <Pressable className="flex-1" style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View className="bg-primary/20 border border-primary rounded-lg py-2 items-center">
                  <Text className="text-xs font-bold text-primary">Withdraw</Text>
                </View>
              </Pressable>
              <Pressable className="flex-1" style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View className="bg-primary/20 border border-primary rounded-lg py-2 items-center">
                  <Text className="text-xs font-bold text-primary">History</Text>
                </View>
              </Pressable>
            </View>
          </FuturisticCard>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {['all', 'video', 'offer', 'game', 'cashback'].map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter as any)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className={`px-4 py-2 rounded-full border ${
                  selectedFilter === filter
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedFilter === filter ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {filter === 'all' && '🌟 All'}
                  {filter === 'video' && '🎬 Videos'}
                  {filter === 'offer' && '🎁 Offers'}
                  {filter === 'game' && '🎮 Games'}
                  {filter === 'cashback' && '💳 Cashback'}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Tasks List */}
        <View className="px-6 py-4 pb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">Available Tasks</Text>
            <Text className="text-sm text-muted">{filteredTasks.length} tasks</Text>
          </View>

          <FlatList
            data={filteredTasks}
            renderItem={renderTaskCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 0 }}
          />
        </View>

        {/* Referral Banner */}
        <View className="mx-6 mb-8">
          <FuturisticCard className="p-4 gap-2" gradient="pink">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">👥</Text>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">Refer & Earn</Text>
                <Text className="text-xs text-muted mt-1">Get $5 for each friend who joins</Text>
              </View>
              <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                <View className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-background text-xs font-bold">Share</Text>
                </View>
              </Pressable>
            </View>
          </FuturisticCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
