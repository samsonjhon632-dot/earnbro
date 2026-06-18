import { ScrollView, Text, View, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [haptics, setHaptics] = useState(true);

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
        { label: 'Account Name', value: 'Rider Title', icon: '👤' },
        { label: 'Email', value: 'rider@example.com', icon: '📧' },
        { label: 'User ID', value: '12345678', icon: '🆔' },
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
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-8 border-b border-border">
          <Text className="text-sm text-muted mb-2">⚙️ Back</Text>
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="px-6 py-6">
            <Text className="text-sm font-bold text-primary mb-3 uppercase">{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <NeonCard key={itemIndex} className="mb-3 bg-surface border-border">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 flex-row items-center gap-3">
                    <Text className="text-lg">{item.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">{item.label}</Text>
                      {!item.toggle && (
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
        ))}

        {/* Support Section */}
        <View className="px-6 py-6">
          <Text className="text-sm font-bold text-primary mb-3 uppercase">Support & Legal</Text>
          {supportItems.map((item, index) => (
            <NeonCard key={index} className="mb-3 bg-surface border-border">
              <TouchableOpacity className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                  <Text className="text-lg">{item.icon}</Text>
                  <Text className="text-sm font-semibold text-foreground">{item.label}</Text>
                </View>
                <Text className="text-muted">›</Text>
              </TouchableOpacity>
            </NeonCard>
          ))}
        </View>

        {/* Danger Zone */}
        <View className="px-6 pb-6">
          <NeonCard className="bg-error/10 border-error">
            <TouchableOpacity className="flex-row justify-between items-center py-2">
              <Text className="text-sm font-semibold text-error">🚪 Logout</Text>
              <Text className="text-error">›</Text>
            </TouchableOpacity>
          </NeonCard>
        </View>

        {/* App Info */}
        <View className="px-6 pb-6 items-center">
          <Text className="text-xs text-muted">EarnBro v1.0.0</Text>
          <Text className="text-xs text-muted mt-1">© 2024 EarnBro. All rights reserved.</Text>
        </View>

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}
