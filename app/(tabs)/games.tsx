import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';

interface GameStats {
  played: number;
  won: number;
  earned: number;
}

interface Game {
  id: string;
  name: string;
  description: string;
  maxReward: number;
  dailyLimit: number;
  icon: string;
  color: 'cyan' | 'purple' | 'pink' | 'blue' | 'green';
}

const GAMES: Game[] = [
  {
    id: 'scratch',
    name: 'Scratch Card',
    description: 'Scratch and reveal prizes instantly',
    maxReward: 1.0,
    dailyLimit: 5,
    icon: '🎟️',
    color: 'cyan',
  },
  {
    id: 'spin',
    name: 'Spin Wheel',
    description: 'Spin the wheel and win cash prizes',
    maxReward: 2.0,
    dailyLimit: 3,
    icon: '🎡',
    color: 'purple',
  },
  {
    id: 'trivia',
    name: 'Daily Trivia',
    description: 'Answer questions and earn rewards',
    maxReward: 0.5,
    dailyLimit: 10,
    icon: '🧠',
    color: 'pink',
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs and win prizes',
    maxReward: 1.5,
    dailyLimit: 4,
    icon: '🎮',
    color: 'blue',
  },
];

export default function GamesScreen() {
  const [gameStats, setGameStats] = useState<Record<string, GameStats>>({
    scratch: { played: 2, won: 1, earned: 0.5 },
    spin: { played: 1, won: 1, earned: 1.25 },
    trivia: { played: 5, won: 4, earned: 2.0 },
    memory: { played: 0, won: 0, earned: 0 },
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingGameId, setPlayingGameId] = useState<string | null>(null);

  const handlePlayGame = async (gameId: string) => {
    setIsPlaying(true);
    setPlayingGameId(gameId);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const won = Math.random() > 0.4;
    const reward = won ? Math.random() * 2 : 0;

    setGameStats((prev) => ({
      ...prev,
      [gameId]: {
        played: prev[gameId].played + 1,
        won: prev[gameId].won + (won ? 1 : 0),
        earned: prev[gameId].earned + reward,
      },
    }));

    setIsPlaying(false);
    setPlayingGameId(null);

    if (won) {
      Alert.alert('You Won!', `You earned $${reward.toFixed(2)}!`, [
        {
          text: 'Play Again',
          onPress: () => handlePlayGame(gameId),
        },
        {
          text: 'OK',
        },
      ]);
    } else {
      Alert.alert('Try Again', 'Better luck next time!', [
        {
          text: 'Play Again',
          onPress: () => handlePlayGame(gameId),
        },
        {
          text: 'OK',
        },
      ]);
    }
  };

  const totalEarned = Object.values(gameStats).reduce((sum, stat) => sum + stat.earned, 0);
  const totalPlayed = Object.values(gameStats).reduce((sum, stat) => sum + stat.played, 0);
  const totalWon = Object.values(gameStats).reduce((sum, stat) => sum + stat.won, 0);

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="px-6 py-6 gap-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-muted">Games</Text>
              <Text className="text-2xl font-bold text-foreground">Play & Earn</Text>
            </View>
            <Text className="text-3xl">🎮</Text>
          </View>

          {/* Stats Cards */}
          <View className="flex-row gap-3">
            <FuturisticCard className="flex-1 p-3 gap-1" gradient="cyan">
              <Text className="text-xs text-muted">Total Earned</Text>
              <Text className="text-xl font-bold text-success">${totalEarned.toFixed(2)}</Text>
            </FuturisticCard>
            <FuturisticCard className="flex-1 p-3 gap-1" gradient="purple">
              <Text className="text-xs text-muted">Games Played</Text>
              <Text className="text-xl font-bold text-primary">{totalPlayed}</Text>
            </FuturisticCard>
            <FuturisticCard className="flex-1 p-3 gap-1" gradient="pink">
              <Text className="text-xs text-muted">Win Rate</Text>
              <Text className="text-xl font-bold text-warning">
                {totalPlayed > 0 ? ((totalWon / totalPlayed) * 100).toFixed(0) : 0}%
              </Text>
            </FuturisticCard>
          </View>
        </View>

        {/* Games Grid */}
        <View className="px-6 py-4 gap-3 pb-8">
          {GAMES.map((game) => {
            const stats = gameStats[game.id];
            const remaining = game.dailyLimit - stats.played;

            return (
              <Pressable
                key={game.id}
                onPress={() => handlePlayGame(game.id)}
                disabled={isPlaying || remaining <= 0}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <FuturisticCard className="p-4 gap-3 flex-row items-center" gradient={game.color}>
                  <Text className="text-3xl">{game.icon}</Text>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-bold text-foreground">{game.name}</Text>
                    <Text className="text-xs text-muted">{game.description}</Text>
                    <View className="flex-row gap-2 mt-1">
                      <Text className="text-xs text-success">Max: ${game.maxReward.toFixed(2)}</Text>
                      <Text className="text-xs text-muted">•</Text>
                      <Text className={`text-xs ${remaining > 0 ? 'text-primary' : 'text-error'}`}>
                        {remaining}/{game.dailyLimit} left
                      </Text>
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    <Text className="text-xs text-muted">Earned</Text>
                    <Text className="text-base font-bold text-success">${stats.earned.toFixed(2)}</Text>
                    {isPlaying && playingGameId === game.id && (
                      <ActivityIndicator size="small" color="#00D9FF" />
                    )}
                  </View>
                </FuturisticCard>
              </Pressable>
            );
          })}
        </View>

        {/* Daily Bonus */}
        <View className="px-6 pb-8">
          <FuturisticCard className="p-4 gap-2" gradient="green">
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-sm font-bold text-foreground">Daily Bonus</Text>
                <Text className="text-xs text-muted">Play all games today to unlock</Text>
              </View>
              <Text className="text-2xl font-bold text-success">$5.00</Text>
            </View>
            <View className="h-2 bg-surface/50 rounded-full overflow-hidden mt-2">
              <View className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '60%' }} />
            </View>
            <Text className="text-xs text-muted mt-1">3 of 4 games played</Text>
          </FuturisticCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
