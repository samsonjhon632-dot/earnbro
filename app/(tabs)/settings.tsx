import { ScrollView, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { useAuth } from '@/lib/auth-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [haptics, setHaptics] = useState(true);

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

  const settingsSections: Array<{
    title: string;
    items: Array<{
      label: string;
      icon: string;
      toggle?: boolean;
      value?: string | boolean;
      onChange?: (val: boolean) => void;
    }>;
  }> = [
    {
      title: 'Account',
      items: [
        { label: 'Account Name', value: user?.name || 'User', icon: '👤' },
        { label: 'Email', value: user?.email || 'user@example.com', icon: '📧' },
        { label: 'User ID', value: user?.id || '12345678', icon: '🆔' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { label: 'Push Notifications', toggle: true, value: notifications, onChange: setNotifications, icon: '🔔' },
        { label: 'Email Notifications', toggle: true, value: true, onChange: () => {}, icon: '📬' },
      ],
    },
    {
      title: 'Appearance',
      items: [
        { label: 'Dark Mode', toggle: true, value: darkMode, onChange: setDarkMode, icon: '🌙' },
        { label: 'Sound Effects', toggle: true, value: soundEffects, onChange: setSoundEffects, icon: '🔊' },
        { label: 'Haptic Feedback', toggle: true, value: haptics, onChange: setHaptics, icon: '📳' },
      ],
    },
    {
      title: 'App Customization',
      items: [
        { label: 'Theme Color', value: 'Cyan', icon: '🎨' },
        { label: 'Language', value: 'English', icon: '🌐' },
        { label: 'App Version', value: '1.0.0', icon: '📱' },
      ],
    },
  ];

  const supportItems = [
    { label: 'Support & Legal', icon: '⚖️' },
    { label: 'Contact Support', icon: '💬' },
    { label: 'Report Bug', icon: '🐛' },
    { label: 'Privacy Policy', icon: '🔒' },
  ];

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border">
          <Text className="text-sm text-muted mb-2">Settings</Text>
          <Text className="text-3xl font-bold text-foreground">Preferences</Text>
        </View>

        {/* Settings Sections */}
        <View className="px-6 py-6 gap-6">
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex}>
              <Text className="text-xs font-bold text-primary uppercase mb-3">
                {section.title}
              </Text>
              <View className="gap-2">
                {section.items.map((item, itemIndex) => (
                  <NeonCard key={itemIndex} className="bg-surface border-border">
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-3 flex-1">
                        <Text className="text-lg">{item.icon}</Text>
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-foreground">
                            {item.label}
                          </Text>
                          {item.value && !item.toggle && (
                            <Text className="text-xs text-muted mt-1">{item.value}</Text>
                          )}
                        </View>
                      </View>
                      {item.toggle && item.onChange ? (
                        <Switch
                          value={typeof item.value === 'boolean' ? item.value : false}
                          onValueChange={item.onChange}
                          trackColor={{ false: '#2a3f5f', true: '#00D9FF' }}
                          thumbColor={typeof item.value === 'boolean' && item.value ? '#00D9FF' : '#8892B0'}
                        />
                      ) : (
                        <Text className="text-muted text-sm">›</Text>
                      )}
                    </View>
                  </NeonCard>
                ))}
              </View>
            </View>
          ))}

          {/* Support Section */}
          <View>
            <Text className="text-xs font-bold text-primary uppercase mb-3">
              Support & Legal
            </Text>
            <View className="gap-2">
              {supportItems.map((item, index) => (
                <NeonCard key={index} className="bg-surface border-border">
                  <TouchableOpacity className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-lg">{item.icon}</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {item.label}
                      </Text>
                    </View>
                    <Text className="text-muted text-sm">›</Text>
                  </TouchableOpacity>
                </NeonCard>
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogoutPress}
            className="bg-error/10 border border-error rounded-lg p-4 items-center mt-4"
          >
            <Text className="text-error font-bold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}
