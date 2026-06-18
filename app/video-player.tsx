import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';

interface VideoTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  duration: number;
  videoUrl: string;
  category: string;
}

const SAMPLE_VIDEOS: VideoTask[] = [
  {
    id: '1',
    title: 'New iPhone 16 Review',
    description: 'Watch the latest iPhone review and earn $0.50',
    reward: 0.5,
    duration: 120,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Tech',
  },
  {
    id: '2',
    title: 'Best Budget Laptops 2024',
    description: 'Discover the best budget laptops this year',
    reward: 0.75,
    duration: 180,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Tech',
  },
];

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams();
  const [video, setVideo] = useState<VideoTask | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWatched, setHasWatched] = useState(false);

  useEffect(() => {
    // Simulate loading video
    setTimeout(() => {
      const foundVideo = SAMPLE_VIDEOS.find((v) => v.id === videoId) || SAMPLE_VIDEOS[0];
      setVideo(foundVideo);
      setIsLoading(false);
    }, 500);
  }, [videoId]);

  useEffect(() => {
    if (!isPlaying || !video) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= video.duration) {
          setIsPlaying(false);
          setHasWatched(true);
          return video.duration;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, video]);

  const handleClaimReward = async () => {
    if (!hasWatched) {
      Alert.alert('Watch Required', 'Please watch the entire video to claim your reward');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to claim reward
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('Success!', `You earned $${video?.reward.toFixed(2)}! 🎉`, [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !video) {
    return (
      <ScreenContainer className="items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00D9FF" />
      </ScreenContainer>
    );
  }

  const progressPercent = (progress / video.duration) * 100;

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Back Button */}
        <View className="px-6 py-4 flex-row items-center">
          <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-lg font-bold text-foreground ml-3">Watch Video</Text>
        </View>

        {/* Video Player Placeholder */}
        <View className="px-6 py-4 gap-4">
          <FuturisticCard className="aspect-video bg-surface/50 items-center justify-center" gradient="cyan">
            <View className="items-center gap-3">
              <Text className="text-5xl">🎬</Text>
              <Text className="text-sm text-muted">Video Player</Text>
              <Text className="text-xs text-muted">{Math.floor(progress)}/{video.duration}s</Text>
            </View>
          </FuturisticCard>

          {/* Progress Bar */}
          <View className="gap-2">
            <View className="h-2 bg-surface rounded-full overflow-hidden">
              <View
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">{Math.floor(progress)}s</Text>
              <Text className="text-xs text-muted">{video.duration}s</Text>
            </View>
          </View>

          {/* Play/Pause Button */}
          <Pressable
            onPress={() => setIsPlaying(!isPlaying)}
            disabled={hasWatched}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg py-3 items-center">
              <Text className="text-background font-bold text-base">
                {hasWatched ? '✓ Video Watched' : isPlaying ? '⏸ Pause' : '▶ Play'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Video Info */}
        <View className="px-6 py-4 gap-4">
          <FuturisticCard className="p-4 gap-3" gradient="purple">
            <Text className="text-lg font-bold text-foreground">{video.title}</Text>
            <Text className="text-sm text-muted">{video.description}</Text>

            <View className="flex-row justify-between items-center mt-2">
              <View className="gap-1">
                <Text className="text-xs text-muted">Category</Text>
                <Text className="text-sm font-semibold text-foreground">{video.category}</Text>
              </View>
              <View className="gap-1 items-end">
                <Text className="text-xs text-muted">Reward</Text>
                <Text className="text-lg font-bold text-success">${video.reward.toFixed(2)}</Text>
              </View>
            </View>
          </FuturisticCard>

          {/* Requirements */}
          <FuturisticCard className="p-4 gap-3" gradient="pink">
            <Text className="text-sm font-bold text-foreground">Requirements</Text>
            <View className="gap-2">
              <View className="flex-row gap-2">
                <Text className={`${hasWatched ? 'text-success' : 'text-muted'} text-foreground`}>
                  {hasWatched ? '✓' : '○'} Watch entire video
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-foreground">○</Text>
                <Text className="text-sm text-muted">Be 18+ years old</Text>
              </View>
              <View className="flex-row gap-2">
                <Text className="text-foreground">○</Text>
                <Text className="text-sm text-muted">Valid account</Text>
              </View>
            </View>
          </FuturisticCard>

          {/* Claim Button */}
          <Pressable
            onPress={handleClaimReward}
            disabled={isLoading || !hasWatched}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className={`rounded-lg py-3 items-center ${
                hasWatched
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-surface/50 border border-border'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color={hasWatched ? '#fff' : '#8B92B0'} />
              ) : (
                <Text
                  className={`font-bold text-base ${
                    hasWatched ? 'text-background' : 'text-muted'
                  }`}
                >
                  {hasWatched ? '💰 Claim Reward' : 'Watch to Unlock'}
                </Text>
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
