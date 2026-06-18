import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { mockGoogleUser } from '@/lib/google-auth';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const mockEmail = 'google_' + Math.random().toString(36).substr(2, 9) + '@gmail.com';
      const mockPassword = 'google_oauth_token';
      await login(mockEmail, mockPassword);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Google Sign-In failed');
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Email Login Form */}
          <FuturisticCard className="p-6 gap-4" gradient="blue">
            <Text className="text-lg font-bold text-foreground">Sign In</Text>

            <View className="gap-3">
              <TextInput
                placeholder="Email"
                placeholderTextColor="#8B92B0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!isLoading}
                className="bg-surface/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-foreground"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#8B92B0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
                className="bg-surface/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            <Pressable
              onPress={handleEmailLogin}
              disabled={isLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg py-3 items-center">
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-background font-bold text-base">Sign In</Text>
                )}
              </View>
            </Pressable>

            <View className="flex-row items-center gap-3 my-2">
              <View className="flex-1 h-px bg-border" />
              <Text className="text-xs text-muted">OR</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            <Pressable
              onPress={handleGoogleLogin}
              disabled={isLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-surface/50 border border-cyan-500/30 rounded-lg py-3 items-center flex-row justify-center gap-2">
                <Text className="text-lg">🔵</Text>
                <Text className="text-foreground font-semibold">Sign in with Google</Text>
              </View>
            </Pressable>
          </FuturisticCard>

          {/* Sign Up Link */}
          <View className="items-center gap-2">
            <Text className="text-muted">Don't have an account?</Text>
            <Pressable onPress={() => router.push('/signup')}>
              <Text className="text-primary font-bold text-base">Create Free Account</Text>
            </Pressable>
          </View>

          {/* Features */}
          <FuturisticCard className="p-4 gap-3" gradient="purple">
            <View className="flex-row gap-3">
              <Text className="text-2xl">✓</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Instant Payouts</Text>
                <Text className="text-xs text-muted mt-1">Withdraw to PayPal in minutes</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <Text className="text-2xl">🎮</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Fun Tasks</Text>
                <Text className="text-xs text-muted mt-1">Play games, watch videos, earn cash</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <Text className="text-2xl">👥</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Refer Friends</Text>
                <Text className="text-xs text-muted mt-1">Earn commissions on referrals</Text>
              </View>
            </View>
          </FuturisticCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
