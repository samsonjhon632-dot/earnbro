import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';

export default function OnboardingScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center bg-background">
        <Text className="text-5xl mb-4">🚀</Text>
        <Text className="text-lg text-muted">Loading EarnBro...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Hero Section */}
        <View className="px-6 py-12 items-center">
          <Text className="text-7xl mb-4">💰</Text>
          <Text className="text-4xl font-bold text-foreground text-center mb-3">
            EarnBro
          </Text>
          <Text className="text-lg text-primary font-semibold text-center mb-2">
            Earn Money Doing What You Love
          </Text>
          <Text className="text-sm text-muted text-center">
            Complete surveys, try offers, and play games to earn real cash
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 py-8 gap-4 flex-1">
          {[
            {
              icon: '📋',
              title: 'Surveys',
              description: 'Get paid for your opinions on products and services',
            },
            {
              icon: '🎁',
              title: 'Exclusive Offers',
              description: 'Claim special deals and earn rewards instantly',
            },
            {
              icon: '🎮',
              title: 'Fun Games',
              description: 'Play games and win cash prizes daily',
            },
            {
              icon: '💸',
              title: 'Quick Payouts',
              description: 'Withdraw your earnings via PayPal or gift cards',
            },
          ].map((feature, index) => (
            <View
              key={index}
              className="bg-surface border border-border rounded-lg p-4 flex-row gap-3"
            >
              <Text className="text-3xl">{feature.icon}</Text>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">
                  {feature.title}
                </Text>
                <Text className="text-xs text-muted mt-1">{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View className="px-6 py-8 gap-3">
          <TouchableOpacity
            onPress={() => router.push('/signup')}
            className="bg-primary rounded-lg py-4 px-6 items-center"
          >
            <Text className="text-background font-bold text-base">Create Free Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/login')}
            className="bg-surface border border-primary rounded-lg py-4 px-6 items-center"
          >
            <Text className="text-primary font-bold text-base">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-6 py-6 border-t border-border">
          <Text className="text-xs text-muted text-center mb-3">
            Join over 1M users earning money with EarnBro
          </Text>
          <View className="flex-row justify-center gap-3">
            <TouchableOpacity>
              <Text className="text-xs text-primary">Terms</Text>
            </TouchableOpacity>
            <Text className="text-xs text-border">•</Text>
            <TouchableOpacity>
              <Text className="text-xs text-primary">Privacy</Text>
            </TouchableOpacity>
            <Text className="text-xs text-border">•</Text>
            <TouchableOpacity>
              <Text className="text-xs text-primary">Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
