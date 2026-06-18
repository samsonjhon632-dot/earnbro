import { ScrollView, Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { useAppContext } from '@/lib/app-context';
import { mockDashboardStats } from '@/lib/mock-data';

export default function HomeScreen() {
  const { user } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const recentTasks = [
    { id: '1', title: 'Consumer Survey', reward: 2.5, status: 'completed' },
    { id: '2', title: 'Tech Survey', reward: 3.75, status: 'pending' },
    { id: '3', title: 'Shopping Survey', reward: 1.5, status: 'completed' },
  ];

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
      >
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-8 border-b border-border">
          <Text className="text-sm text-muted mb-2">Hi, Rider Title 👋</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-muted mb-1">Balance</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-4xl font-bold text-foreground">
                  {mockDashboardStats.balance.toFixed(0)}
                </Text>
                <Text className="text-sm text-primary">BroCoin$</Text>
              </View>
            </View>
            <View className="w-16 h-16 rounded-full bg-surface border-2 border-primary items-center justify-center">
              <Text className="text-2xl font-bold text-primary">R</Text>
            </View>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View className="px-6 py-6 gap-3">
          <NeonCard className="bg-surface border-primary/50">
            <Text className="text-xs text-muted mb-2">Instant Tasks Loading...</Text>
            <View className="w-full h-1 bg-border rounded-full overflow-hidden">
              <View className="w-1/3 h-full bg-primary rounded-full" />
            </View>
          </NeonCard>

          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-primary/20 border border-primary rounded-lg py-3 px-4 items-center">
              <Text className="text-primary font-semibold text-sm">🎯 Daily Check</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-success/20 border border-success rounded-lg py-3 px-4 items-center">
              <Text className="text-success font-semibold text-sm">✨ Bonus</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-warning/20 border border-warning rounded-lg py-3 px-4 items-center">
              <Text className="text-warning font-semibold text-sm">🎁 Rewards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Tasks Section */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Recent Tasks</Text>
          <FlatList
            scrollEnabled={false}
            data={recentTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NeonCard className="mb-3 bg-surface border-border">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">{item.title}</Text>
                    <Text className="text-xs text-muted mt-1">
                      {item.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-success">${item.reward.toFixed(2)}</Text>
                </View>
              </NeonCard>
            )}
          />
        </View>

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}
