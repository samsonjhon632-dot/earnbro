import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  icon?: string;
}

export function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-foreground mb-2">{label}</Text>
      <View
        className={cn(
          'flex-row items-center bg-surface border rounded-lg px-4 py-3 gap-2',
          error ? 'border-error' : 'border-border'
        )}
      >
        {icon && <Text className="text-lg">{icon}</Text>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#8892B0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          className="flex-1 text-foreground text-base"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-lg">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}
    </View>
  );
}
