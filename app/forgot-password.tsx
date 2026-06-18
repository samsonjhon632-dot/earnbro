import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { AuthInput } from '@/components/auth-input';
import { useAuth } from '@/lib/auth-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    try {
      setError('');
      setSuccess(false);

      if (!email) {
        setError('Email is required');
        return;
      }

      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    }
  };

  if (success) {
    return (
      <ScreenContainer className="p-6 bg-background items-center justify-center">
        <View className="items-center gap-4">
          <Text className="text-6xl">📧</Text>
          <Text className="text-2xl font-bold text-foreground text-center">Check Your Email</Text>
          <Text className="text-sm text-muted text-center">
            We've sent a password reset link to {email}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            className="bg-primary rounded-lg py-3 px-8 mt-4"
          >
            <Text className="text-background font-bold">Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-12 items-center">
          <Text className="text-5xl mb-3">🔑</Text>
          <Text className="text-3xl font-bold text-foreground">Reset Password</Text>
          <Text className="text-sm text-muted mt-2 text-center">
            Enter your email to receive a reset link
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 py-8 flex-1">
          {error && (
            <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
              <Text className="text-sm text-error">{error}</Text>
            </View>
          )}

          <AuthInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="📧"
          />

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleReset}
            disabled={isLoading}
            className="bg-primary rounded-lg py-4 px-6 items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#0a0e27" />
            ) : (
              <Text className="text-background font-bold text-base">Send Reset Link</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View className="flex-row justify-center gap-1">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-sm text-primary font-bold">← Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View className="px-6 py-6 border-t border-border">
          <Text className="text-xs text-muted text-center">
            Check your email for a link to reset your password. The link will expire in 24 hours.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
