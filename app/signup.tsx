import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { useAuth } from '@/hooks/use-auth';
import * as Constants from '@/constants/oauth';

export default function SignupScreen() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      // Use the real OAuth login flow (works for both signup and signin)
      await Constants.startOAuthLogin();
      // OAuth callback will handle the redirect to app
    } catch (error) {
      console.error('Google Sign-Up error:', error);
      Alert.alert('Error', 'Google Sign-Up failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Background gradient effect */}
        <View className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Content */}
        <View className="flex-1 px-6 py-8 justify-center gap-8">
          {/* Logo & Title */}
          <View className="items-center gap-4">
            <Text className="text-5xl">💰</Text>
            <Text className="text-3xl font-bold text-foreground">EarnBro</Text>
            <Text className="text-sm text-primary text-center">Join Millions Earning Money</Text>
          </View>

          {/* Welcome Bonus Card */}
          <FuturisticCard className="p-6 gap-3 items-center" gradient="green">
            <Text className="text-3xl">🎁</Text>
            <Text className="text-lg font-bold text-foreground">$5 Welcome Bonus</Text>
            <Text className="text-xs text-muted text-center">
              Get $5 instantly when you sign up and complete your first task
            </Text>
          </FuturisticCard>

          {/* Info Card */}
          <FuturisticCard className="p-6 gap-3" gradient="cyan">
            <Text className="text-sm font-semibold text-foreground">Quick & Easy Signup</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Create your account with Google and start earning immediately. No credit card required.
            </Text>
          </FuturisticCard>

          {/* Google Signup Button */}
          <Pressable
            onPress={handleGoogleSignup}
            disabled={isLoading}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <FuturisticCard className="p-4 items-center flex-row justify-center gap-3" gradient="blue">
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-2xl">🔐</Text>
                  <Text className="text-base font-bold text-background">Sign up with Google</Text>
                </>
              )}
            </FuturisticCard>
          </Pressable>

          {/* Features List */}
          <View className="gap-2">
            <Text className="text-xs font-bold text-muted uppercase">Start Earning Today</Text>
            {[
              { icon: '⚡', title: 'Instant Payout', desc: 'Withdraw earnings anytime' },
              { icon: '🔒', title: 'Secure & Safe', desc: 'Your data is protected' },
              { icon: '💯', title: 'Trusted Platform', desc: 'Millions of users worldwide' },
              { icon: '🚀', title: 'Easy Tasks', desc: 'Simple ways to earn' },
            ].map((feature, index) => (
              <FuturisticCard key={index} className="p-3 flex-row items-center gap-3" gradient="purple">
                <Text className="text-2xl">{feature.icon}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{feature.title}</Text>
                  <Text className="text-xs text-muted mt-1">{feature.desc}</Text>
                </View>
              </FuturisticCard>
            ))}
          </View>

          {/* Login Link */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-sm text-muted">Already have an account?</Text>
            <Pressable onPress={handleLoginPress}>
              <Text className="text-sm font-bold text-primary">Sign In</Text>
            </Pressable>
          </View>

          {/* Terms */}
          <Text className="text-xs text-muted text-center leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
