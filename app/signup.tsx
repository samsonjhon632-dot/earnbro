import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { AuthInput } from '@/components/auth-input';
import { useAuth } from '@/lib/auth-context';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState('');

  const handleSignUp = async () => {
    try {
      setErrors({});
      setGeneralError('');

      // Validation
      const newErrors: typeof errors = {};
      if (!name) newErrors.name = 'Name is required';
      if (!email) newErrors.email = 'Email is required';
      if (!password) newErrors.password = 'Password is required';
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      if (password && confirmPassword && password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await signup(email, password, name);
      router.replace('/(tabs)');
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Sign up failed');
    }
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-8 items-center">
          <Text className="text-5xl mb-3">🎉</Text>
          <Text className="text-3xl font-bold text-foreground">Join EarnBro</Text>
          <Text className="text-sm text-muted mt-2 text-center">
            Start earning money today
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
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            error={errors.name}
            icon="👤"
          />

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

          <AuthInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
            icon="✓"
          />

          {/* Terms Checkbox */}
          <View className="flex-row items-start gap-2 mb-6">
            <Text className="text-primary text-lg">✓</Text>
            <Text className="text-xs text-muted flex-1">
              I agree to the{' '}
              <Text className="text-primary font-semibold">Terms of Service</Text> and{' '}
              <Text className="text-primary font-semibold">Privacy Policy</Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={isLoading}
            className="bg-primary rounded-lg py-4 px-6 items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#0a0e27" />
            ) : (
              <Text className="text-background font-bold text-base">Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center gap-1">
            <Text className="text-sm text-muted">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-sm text-primary font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Bonus */}
        <View className="px-6 py-6 border-t border-border bg-success/5">
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl">🎁</Text>
            <View className="flex-1">
              <Text className="text-sm font-bold text-success">Welcome Bonus</Text>
              <Text className="text-xs text-muted">Get $5 BroCoin$ when you sign up</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
