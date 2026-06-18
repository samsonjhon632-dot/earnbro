import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { AuthInput } from '@/components/auth-input';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState('');

  const handleLogin = async () => {
    try {
      setErrors({});
      setGeneralError('');

      // Validation
      const newErrors: typeof errors = {};
      if (!email) newErrors.email = 'Email is required';
      if (!password) newErrors.password = 'Password is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-12 items-center">
          <Text className="text-5xl mb-3">🚀</Text>
          <Text className="text-3xl font-bold text-foreground">Welcome Back</Text>
          <Text className="text-sm text-muted mt-2 text-center">
            Sign in to your EarnBro account
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 py-8 flex-1">
          {generalError && (
            <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
              <Text className="text-sm text-error">{generalError}</Text>
            </View>
          )}

          <AuthInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            icon="📧"
          />

          <AuthInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            icon="🔐"
          />

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            className="mb-6"
          >
            <Text className="text-sm text-primary font-semibold">Forgot password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-primary rounded-lg py-4 px-6 items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#0a0e27" />
            ) : (
              <Text className="text-background font-bold text-base">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-sm text-muted">Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="text-sm text-primary font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Info */}
        <View className="px-6 py-6 border-t border-border">
          <Text className="text-xs text-muted text-center mb-2">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
          <View className="flex-row justify-center gap-4">
            <TouchableOpacity>
              <Text className="text-xs text-primary">Terms</Text>
            </TouchableOpacity>
            <Text className="text-xs text-border">•</Text>
            <TouchableOpacity>
              <Text className="text-xs text-primary">Privacy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
