import { ScrollView, Text, View, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { useAuth } from '@/lib/auth-context';

interface Game {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  type: 'scratch' | 'spin' | 'trivia';
  dailyLimit: number;
  playsRemaining: number;
}

export default function GamesScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameResult, setGameResult] = useState<{ won: boolean; amount: number } | null>(null);

  const games: Game[] = [
    {
      id: '1',
      title: 'Lucky Scratch',
      description: 'Scratch off cards to reveal instant prizes',
      reward: 2.5,
      icon: '🎫',
      type: 'scratch',
      dailyLimit: 5,
      playsRemaining: 3,
    },
    {
      id: '2',
      title: 'Spin & Win',
      description: 'Spin the wheel for a chance to win big',
      reward: 5.0,
      icon: '🎡',
      type: 'spin',
      dailyLimit: 3,
      playsRemaining: 2,
    },
    {
      id: '3',
      title: 'Daily Trivia',
      description: 'Answer trivia questions to earn rewards',
      reward: 1.5,
      icon: '🧠',
      type: 'trivia',
      dailyLimit: 10,
      playsRemaining: 7,
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const playGame = (game: Game) => {
    setSelectedGame(game);
    // Simulate game result (70% win rate)
    const won = Math.random() < 0.7;
    const amount = won ? game.reward : 0;
    setGameResult({ won, amount });
  };

  const closeGameResult = () => {
    setGameResult(null);
    setSelectedGame(null);
  };

  if (selectedGame && gameResult) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <View className="items-center gap-6 bg-surface border border-border rounded-2xl p-8">
          <Text className="text-7xl">
            {gameResult.won ? '🎉' : '😅'}
          </Text>
          <Text className="text-3xl font-bold text-foreground text-center">
            {gameResult.won ? 'You Won!' : 'Better Luck Next Time'}
          </Text>
          {gameResult.won && (
            <View className="bg-success/20 border border-success rounded-lg px-6 py-3">
              <Text className="text-2xl font-bold text-success">
                +${gameResult.amount.toFixed(2)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={closeGameResult}
            className="bg-primary rounded-lg py-3 px-8 w-full items-center"
          >
            <Text className="text-background font-bold">Play Again</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
      >
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border">
          <Text className="text-sm text-muted mb-2">Have Fun</Text>
          <Text className="text-3xl font-bold text-foreground">Play & Earn</Text>
          <Text className="text-xs text-muted mt-1">
            Play daily games and win instant rewards
          </Text>
        </View>

        {/* Daily Bonus */}
        <View className="px-6 py-4">
          <NeonCard className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary">
            <View className="flex-row items-center gap-3">
              <Text className="text-4xl">🎁</Text>
              <View className="flex-1">
                <Text className="text-sm font-bold text-primary">Daily Bonus</Text>
                <Text className="text-xs text-muted mt-1">
                  Play 3 games today to unlock $1 bonus
                </Text>
              </View>
              <Text className="text-2xl">2/3</Text>
            </View>
          </NeonCard>
        </View>

        {/* Games List */}
        <View className="px-6 pb-6">
          <FlatList
            scrollEnabled={false}
            data={games}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => playGame(item)}
                disabled={item.playsRemaining === 0}
                className="mb-3"
              >
                <NeonCard
                  className={`bg-surface border-border ${
                    item.playsRemaining === 0 ? 'opacity-50' : ''
                  }`}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-4xl">{item.icon}</Text>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-foreground">
                          {item.title}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-success/20 rounded-lg px-3 py-2">
                      <Text className="text-lg font-bold text-success">
                        ${item.reward.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Game Stats */}
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row gap-3">
                      <View className="flex-row items-center gap-1">
                        <Text className="text-xs text-muted">📊</Text>
                        <Text className="text-xs text-muted">
                          {item.dailyLimit} daily
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Text className="text-xs text-muted">⏱</Text>
                        <Text className="text-xs text-muted">
                          {item.playsRemaining} left
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => playGame(item)}
                      disabled={item.playsRemaining === 0}
                      className={`rounded-lg px-4 py-2 ${
                        item.playsRemaining === 0
                          ? 'bg-muted'
                          : 'bg-primary'
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          item.playsRemaining === 0
                            ? 'text-foreground'
                            : 'text-background'
                        }`}
                      >
                        {item.playsRemaining === 0 ? 'No Plays' : 'Play Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </NeonCard>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}
