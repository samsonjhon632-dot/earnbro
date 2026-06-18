import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { useAuth } from '@/lib/auth-context';

export default function SurveyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Mock survey data
  const survey = {
    id,
    title: 'Consumer Preferences Survey',
    description: 'Help us understand consumer preferences for new products',
    reward: 2.5,
    estimatedTime: 5,
    category: 'General',
    questions: 15,
    completionPercentage: 0,
    requirements: [
      'Must be 18 or older',
      'Valid email address required',
      'Complete survey in one session',
    ],
    details:
      'This survey asks about your shopping habits, product preferences, and brand loyalty. Your honest feedback helps companies improve their products and services.',
  };

  const handleCompleteSurvey = async () => {
    setIsCompleting(true);
    // Simulate survey completion
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setCompleted(true);
  };

  if (completed) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <View className="items-center gap-6 bg-surface border border-border rounded-2xl p-8">
          <Text className="text-7xl">🎉</Text>
          <Text className="text-3xl font-bold text-foreground text-center">
            Survey Complete!
          </Text>
          <View className="bg-success/20 border border-success rounded-lg px-6 py-3">
            <Text className="text-2xl font-bold text-success">
              +${survey.reward.toFixed(2)}
            </Text>
            <Text className="text-xs text-success text-center mt-1">
              Added to your balance
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary rounded-lg py-3 px-8 w-full items-center"
          >
            <Text className="text-background font-bold">Back to Surveys</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-sm text-muted mb-2">Survey Details</Text>
            <Text className="text-2xl font-bold text-foreground">{survey.title}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-6 py-6 gap-6">
          {/* Reward Card */}
          <NeonCard className="bg-gradient-to-r from-success/20 to-success/10 border-success">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-success font-semibold">Reward</Text>
                <Text className="text-3xl font-bold text-success mt-1">
                  ${survey.reward.toFixed(2)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm text-muted">⏱ {survey.estimatedTime} min</Text>
                <Text className="text-sm text-muted mt-1">📋 {survey.questions} questions</Text>
              </View>
            </View>
          </NeonCard>

          {/* Description */}
          <View>
            <Text className="text-sm font-bold text-foreground mb-2">About This Survey</Text>
            <Text className="text-sm text-muted leading-relaxed">{survey.details}</Text>
          </View>

          {/* Requirements */}
          <View>
            <Text className="text-sm font-bold text-foreground mb-3">Requirements</Text>
            <View className="gap-2">
              {survey.requirements.map((req, index) => (
                <View key={index} className="flex-row items-center gap-2">
                  <Text className="text-success">✓</Text>
                  <Text className="text-sm text-muted flex-1">{req}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Category</Text>
              <Text className="text-sm font-semibold text-foreground">{survey.category}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Time Estimate</Text>
              <Text className="text-sm font-semibold text-foreground">
                {survey.estimatedTime} minutes
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Questions</Text>
              <Text className="text-sm font-semibold text-foreground">
                {survey.questions}
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View className="px-6 py-6 gap-3">
          <TouchableOpacity
            onPress={handleCompleteSurvey}
            disabled={isCompleting}
            className="bg-primary rounded-lg py-4 px-6 items-center"
          >
            {isCompleting ? (
              <ActivityIndicator color="#0a0e27" />
            ) : (
              <Text className="text-background font-bold text-base">Start Survey</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-surface border border-border rounded-lg py-4 px-6 items-center"
          >
            <Text className="text-foreground font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
