import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { useAuth } from '@/hooks/use-auth';
import * as Constants from '@/constants/oauth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetViaOAuth = async () => {
    setIsLoading(true);
    try {
      // For OAuth-based auth, password reset happens through the OAuth provider
      // User should use "Forgot Password" on the OAuth login page
      Alert.alert(
        'Password Reset',
        'To reset your password, please use the password reset option on the Google login page.',
        [{ text: 'OK', onPress: () => router.push('/login') }]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong');
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
          {/* Header */}
          <View className="items-center gap-4">
            <Text className="text-5xl">🔐</Text>
            <Text className="text-3xl font-bold text-foreground">Reset Password</Text>
            <Text className="text-sm text-muted text-center">
              We'll help you regain access to your account
            </Text>
          </View>

          {/* Info Card */}
          <FuturisticCard className="p-6 gap-3" gradient="cyan">
            <Text className="text-sm font-semibold text-foreground">How to Reset Your Password</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Since you signed in with Google, you'll need to reset your password through Google's account recovery process. Click the button below to get started.
            </Text>
          </FuturisticCard>

          {/* Reset Button */}
          <Pressable
            onPress={handleResetViaOAuth}
            disabled={isLoading}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <FuturisticCard className="p-4 items-center flex-row justify-center gap-3" gradient="blue">
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-2xl">🔗</Text>
                  <Text className="text-base font-bold text-background">Reset via Google</Text>
                </>
              )}
            </FuturisticCard>
          </Pressable>

          {/* Steps */}
          <View className="gap-3">
            <Text className="text-xs font-bold text-muted uppercase">Steps</Text>
            {[
              { num: '1', title: 'Go to Google Account', desc: 'Visit your Google Account security page' },
              { num: '2', title: 'Select Password', desc: 'Choose "Password" from the left menu' },
              { num: '3', title: 'Follow Instructions', desc: 'Complete the password reset process' },
              { num: '4', title: 'Sign In Again', desc: 'Use your new password to log in' },
            ].map((step, index) => (
              <FuturisticCard key={index} className="p-3 flex-row items-center gap-3" gradient="purple">
                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                  <Text className="text-xs font-bold text-background">{step.num}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{step.title}</Text>
                  <Text className="text-xs text-muted mt-1">{step.desc}</Text>
                </View>
              </FuturisticCard>
            ))}
          </View>

          {/* Back to Login */}
          <Pressable
            onPress={() => router.push('/login')}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View className="border border-primary rounded-lg py-4 px-6 items-center">
              <Text className="text-base font-bold text-primary">Back to Login</Text>
            </View>
          </Pressable>

          {/* Support */}
          <View className="items-center gap-2">
            <Text className="text-xs text-muted">Need help?</Text>
            <Pressable onPress={() => Alert.alert('Support', 'Contact us at support@earnbro.com')}>
              <Text className="text-xs font-bold text-primary">Contact Support</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
