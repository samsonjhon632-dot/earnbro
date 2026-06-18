import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { useAuth } from '@/lib/auth-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoWithdraw, setAutoWithdraw] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: handleLogout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'This action cannot be undone. All your data will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
        },
      },
    ]);
  };

  const settingItems = [
    {
      title: 'Notifications',
      description: 'Get alerts for new offers and rewards',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
      icon: '🔔',
    },
    {
      title: 'Email Notifications',
      description: 'Receive updates via email',
      value: emailNotifications,
      onToggle: setEmailNotifications,
      icon: '📧',
    },
    {
      title: 'Dark Mode',
      description: 'Use dark theme',
      value: darkMode,
      onToggle: setDarkMode,
      icon: '🌙',
    },
    {
      title: 'Auto Withdrawal',
      description: 'Automatically withdraw when balance reaches $20',
      value: autoWithdraw,
      onToggle: setAutoWithdraw,
      icon: '💰',
    },
  ];

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="px-6 py-6 gap-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-muted">Settings</Text>
              <Text className="text-2xl font-bold text-foreground">Preferences</Text>
            </View>
            <Text className="text-3xl">⚙️</Text>
          </View>
        </View>

        {/* Account Info */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Account</Text>
          <FuturisticCard className="p-6 gap-4" gradient="purple">
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 items-center justify-center">
                <Text className="text-2xl font-bold text-background">EB</Text>
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-lg font-bold text-foreground">{user?.email || 'User'}</Text>
                <Text className="text-xs text-muted">Member since 2024</Text>
              </View>
            </View>

            <View className="pt-4 border-t border-border gap-2">
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-primary/20 border border-primary rounded-lg py-2 px-4 items-center">
                  <Text className="text-primary font-semibold text-sm">Edit Profile</Text>
                </View>
              </Pressable>
            </View>
          </FuturisticCard>
        </View>

        {/* Notifications & Preferences */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Notifications & Preferences</Text>
          {settingItems.map((item, index) => (
            <FuturisticCard key={index} className="p-4 flex-row items-center justify-between" gradient="cyan">
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-2xl">{item.icon}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{item.title}</Text>
                  <Text className="text-xs text-muted mt-1">{item.description}</Text>
                </View>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: '#333', true: '#00D9FF' }}
                thumbColor={item.value ? '#00D9FF' : '#666'}
              />
            </FuturisticCard>
          ))}
        </View>

        {/* Support & Legal */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Support & Legal</Text>
          
          <FuturisticCard className="p-4 flex-row items-center gap-3" gradient="pink">
            <Text className="text-2xl">❓</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">Help & Support</Text>
              <Text className="text-xs text-muted mt-1">Contact our support team</Text>
            </View>
            <Text className="text-lg">→</Text>
          </FuturisticCard>

          <FuturisticCard className="p-4 flex-row items-center gap-3" gradient="blue">
            <Text className="text-2xl">📋</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">Terms of Service</Text>
              <Text className="text-xs text-muted mt-1">Read our terms</Text>
            </View>
            <Text className="text-lg">→</Text>
          </FuturisticCard>

          <FuturisticCard className="p-4 flex-row items-center gap-3" gradient="green">
            <Text className="text-2xl">🔒</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">Privacy Policy</Text>
              <Text className="text-xs text-muted mt-1">View our privacy policy</Text>
            </View>
            <Text className="text-lg">→</Text>
          </FuturisticCard>
        </View>

        {/* App Info */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">App Information</Text>
          
          <FuturisticCard className="p-4 gap-3" gradient="cyan">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted">App Version</Text>
              <Text className="text-sm font-bold text-foreground">1.0.0</Text>
            </View>
            <View className="flex-row justify-between items-center pt-3 border-t border-border">
              <Text className="text-sm text-muted">Build Number</Text>
              <Text className="text-sm font-bold text-foreground">2024061801</Text>
            </View>
          </FuturisticCard>
        </View>

        {/* Danger Zone */}
        <View className="px-6 py-4 gap-3 pb-8">
          <Text className="text-sm font-bold text-error">Danger Zone</Text>
          
          <Pressable
            onPress={handleLogoutPress}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <FuturisticCard className="p-4 items-center" gradient="pink">
              <Text className="text-sm font-bold text-error">Logout</Text>
            </FuturisticCard>
          </Pressable>

          <Pressable
            onPress={handleDeleteAccount}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <FuturisticCard className="p-4 items-center" gradient="pink">
              <Text className="text-sm font-bold text-error">Delete Account</Text>
            </FuturisticCard>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
