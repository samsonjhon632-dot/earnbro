import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<'surveys' | 'offers' | 'withdrawals' | 'users'>('surveys');
  const [newSurveyTitle, setNewSurveyTitle] = useState('');
  const [newSurveyReward, setNewSurveyReward] = useState('');

  const handleAddSurvey = () => {
    if (!newSurveyTitle || !newSurveyReward) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', `Survey "${newSurveyTitle}" added for $${newSurveyReward}`);
    setNewSurveyTitle('');
    setNewSurveyReward('');
  };

  const tabs = [
    { id: 'surveys', label: 'Surveys', icon: '📋' },
    { id: 'offers', label: 'Offers', icon: '🎁' },
    { id: 'withdrawals', label: 'Withdrawals', icon: '💳' },
    { id: 'users', label: 'Users', icon: '👥' },
  ] as const;

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border">
          <Text className="text-2xl font-bold text-foreground">Admin Dashboard</Text>
          <Text className="text-sm text-muted mt-2">Manage surveys, offers, and withdrawals</Text>
        </View>

        {/* Tab Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className={`px-4 py-2 rounded-full border flex-row items-center gap-2 ${
                  activeTab === tab.id ? 'bg-primary border-primary' : 'bg-surface border-border'
                }`}
              >
                <Text>{tab.icon}</Text>
                <Text
                  className={`font-semibold ${
                    activeTab === tab.id ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Content */}
        <View className="px-6 py-6 gap-6 pb-8">
          {activeTab === 'surveys' && (
            <>
              <View className="gap-4">
                <Text className="text-lg font-bold text-foreground">Add New Survey</Text>
                <NeonCard className="p-4 gap-4">
                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-2">Survey Title</Text>
                    <TextInput
                      placeholder="Enter survey title"
                      placeholderTextColor="#687076"
                      value={newSurveyTitle}
                      onChangeText={setNewSurveyTitle}
                      className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-2">Reward ($)</Text>
                    <TextInput
                      placeholder="Enter reward amount"
                      placeholderTextColor="#687076"
                      value={newSurveyReward}
                      onChangeText={setNewSurveyReward}
                      keyboardType="decimal-pad"
                      className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                    />
                  </View>

                  <Pressable
                    onPress={handleAddSurvey}
                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  >
                    <View className="bg-primary rounded-lg py-3 items-center">
                      <Text className="text-background font-bold">Add Survey</Text>
                    </View>
                  </Pressable>
                </NeonCard>
              </View>

              <View className="gap-4">
                <Text className="text-lg font-bold text-foreground">Active Surveys</Text>
                <NeonCard className="p-4 gap-2">
                  <Text className="text-sm text-foreground">Tech Product Survey - $2.50</Text>
                  <Text className="text-xs text-muted">5 min • 50 responses</Text>
                </NeonCard>
                <NeonCard className="p-4 gap-2">
                  <Text className="text-sm text-foreground">Shopping Habits - $3.00</Text>
                  <Text className="text-xs text-muted">8 min • 32 responses</Text>
                </NeonCard>
              </View>
            </>
          )}

          {activeTab === 'offers' && (
            <>
              <View className="gap-4">
                <Text className="text-lg font-bold text-foreground">Active Offers</Text>
                <NeonCard className="p-4 gap-2">
                  <Text className="text-sm text-foreground">Amazon $10 Off - $5.00</Text>
                  <Text className="text-xs text-muted">Expires in 5 days • 120 claims</Text>
                </NeonCard>
                <NeonCard className="p-4 gap-2">
                  <Text className="text-sm text-foreground">Starbucks Free Drink - $3.50</Text>
                  <Text className="text-xs text-muted">Expires in 2 days • 89 claims</Text>
                </NeonCard>
              </View>
            </>
          )}

          {activeTab === 'withdrawals' && (
            <>
              <View className="gap-4">
                <Text className="text-lg font-bold text-foreground">Pending Withdrawals</Text>
                <NeonCard className="p-4 gap-3">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-sm font-semibold text-foreground">$50.00</Text>
                      <Text className="text-xs text-muted mt-1">PayPal • user@example.com</Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Pressable
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <View className="bg-success/20 px-3 py-1 rounded">
                          <Text className="text-xs font-bold text-success">Approve</Text>
                        </View>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <View className="bg-error/20 px-3 py-1 rounded">
                          <Text className="text-xs font-bold text-error">Reject</Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                </NeonCard>

                <NeonCard className="p-4 gap-3">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-sm font-semibold text-foreground">$25.00</Text>
                      <Text className="text-xs text-muted mt-1">Gift Card • amazon@account</Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Pressable
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <View className="bg-success/20 px-3 py-1 rounded">
                          <Text className="text-xs font-bold text-success">Approve</Text>
                        </View>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                      >
                        <View className="bg-error/20 px-3 py-1 rounded">
                          <Text className="text-xs font-bold text-error">Reject</Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                </NeonCard>
              </View>
            </>
          )}

          {activeTab === 'users' && (
            <>
              <View className="gap-4">
                <Text className="text-lg font-bold text-foreground">Active Users</Text>
                <NeonCard className="p-4 gap-2">
                  <Text className="text-sm font-semibold text-foreground">John Doe</Text>
                  <Text className="text-xs text-muted">john@example.com • $245.50 earned</Text>
                </NeonCard>
                <NeonCard className="p-4 gap-2">
                  <Text className="text-sm font-semibold text-foreground">Jane Smith</Text>
                  <Text className="text-xs text-muted">jane@example.com • $189.25 earned</Text>
                </NeonCard>
                <NeonCard className="p-4 gap-2">
                  <Text className="text-sm font-semibold text-foreground">Mike Johnson</Text>
                  <Text className="text-xs text-muted">mike@example.com • $312.75 earned</Text>
                </NeonCard>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
