import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { useAuth } from '@/hooks/use-auth';
import * as Constants from '@/constants/oauth';

export default function LoginScreen() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Use the real OAuth login flow
      await Constants.startOAuthLogin();
      // OAuth callback will handle the redirect to app
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
      setIsLoading(false);
    }
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
            <Text className="text-sm text-primary text-center">Earn Money Doing What You Love</Text>
          </View>

          {/* Info Card */}
          <FuturisticCard className="p-6 gap-3" gradient="cyan">
            <Text className="text-sm font-semibold text-foreground">Welcome Back!</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Sign in with your Google account to access your EarnBro dashboard and start earning money through surveys, offers, and games.
            </Text>
          </FuturisticCard>

          {/* Google Login Button */}
          <Pressable
            onPress={handleGoogleLogin}
            disabled={isLoading}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <FuturisticCard className="p-4 items-center flex-row justify-center gap-3" gradient="blue">
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-2xl">🔐</Text>
                  <Text className="text-base font-bold text-background">Sign in with Google</Text>
                </>
              )}
            </FuturisticCard>
          </Pressable>

          {/* Features List */}
          <View className="gap-2">
            <Text className="text-xs font-bold text-muted uppercase">What You Can Do</Text>
            {[
              { icon: '📋', title: 'Complete Surveys', desc: 'Get paid for your opinions' },
              { icon: '🎁', title: 'Claim Offers', desc: 'Exclusive deals and rewards' },
              { icon: '🎮', title: 'Play Games', desc: 'Win cash prizes daily' },
              { icon: '👥', title: 'Refer Friends', desc: 'Earn bonuses for referrals' },
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

          {/* Terms */}
          <Text className="text-xs text-muted text-center leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
