import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, Share, Clipboard } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';

interface ReferralTier {
  name: string;
  referrals: number;
  bonus: number;
  icon: string;
  color: 'cyan' | 'purple' | 'pink' | 'blue' | 'green';
}

const TIERS: ReferralTier[] = [
  {
    name: 'Bronze',
    referrals: 0,
    bonus: 1.0,
    icon: '🥉',
    color: 'cyan',
  },
  {
    name: 'Silver',
    referrals: 5,
    bonus: 2.5,
    icon: '🥈',
    color: 'purple',
  },
  {
    name: 'Gold',
    referrals: 15,
    bonus: 5.0,
    icon: '🥇',
    color: 'pink',
  },
  {
    name: 'Platinum',
    referrals: 30,
    bonus: 10.0,
    icon: '💎',
    color: 'blue',
  },
];

export default function ReferScreen() {
  const [referralCode] = useState('EARNBRO2024');
  const [referralStats] = useState({
    totalReferrals: 8,
    activeReferrals: 6,
    totalEarned: 18.5,
    pendingBonus: 2.5,
  });

  const currentTier = TIERS[1];
  const nextTier = TIERS[2];
  const referralsNeeded = nextTier.referrals - referralStats.totalReferrals;

  const handleCopyCode = async () => {
    await Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join EarnBro and earn money! Use my referral code: ${referralCode}\n\nEarn $${currentTier.bonus} for each friend who signs up!\n\nDownload now: https://earnbro.app`,
        title: 'Join EarnBro - Earn Money',
        url: 'https://earnbro.app',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="px-6 py-6 gap-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-muted">Referral Program</Text>
              <Text className="text-2xl font-bold text-foreground">Earn & Share</Text>
            </View>
            <Text className="text-3xl">👥</Text>
          </View>

          {/* Referral Stats */}
          <FuturisticCard className="p-6 gap-4" gradient="purple">
            <View className="gap-2">
              <Text className="text-sm text-muted">Total Earned from Referrals</Text>
              <Text className="text-4xl font-bold text-success">${referralStats.totalEarned.toFixed(2)}</Text>
            </View>

            <View className="flex-row gap-2 pt-4 border-t border-border">
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Total Referrals</Text>
                <Text className="text-lg font-bold text-primary">{referralStats.totalReferrals}</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Active</Text>
                <Text className="text-lg font-bold text-success">{referralStats.activeReferrals}</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Pending</Text>
                <Text className="text-lg font-bold text-warning">${referralStats.pendingBonus.toFixed(2)}</Text>
              </View>
            </View>
          </FuturisticCard>
        </View>

        {/* Referral Code */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Your Referral Code</Text>
          <FuturisticCard className="p-4 gap-3" gradient="cyan">
            <View className="bg-surface/50 rounded-lg p-4 items-center gap-2">
              <Text className="text-xs text-muted">Share this code with friends</Text>
              <Text className="text-3xl font-bold text-primary font-mono">{referralCode}</Text>
            </View>

            <View className="flex-row gap-2">
              <Pressable
                onPress={handleCopyCode}
                className="flex-1"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-primary/20 border border-primary rounded-lg py-3 items-center">
                  <Text className="text-primary font-semibold">📋 Copy Code</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={handleShare}
                className="flex-1"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg py-3 items-center">
                  <Text className="text-background font-bold">🔗 Share</Text>
                </View>
              </Pressable>
            </View>
          </FuturisticCard>
        </View>

        {/* Current Tier */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Your Tier</Text>
          <FuturisticCard className="p-6 gap-4 items-center" gradient={currentTier.color}>
            <Text className="text-5xl">{currentTier.icon}</Text>
            <View className="items-center gap-1">
              <Text className="text-2xl font-bold text-foreground">{currentTier.name}</Text>
              <Text className="text-sm text-muted">Earn ${currentTier.bonus} per referral</Text>
            </View>
          </FuturisticCard>
        </View>

        {/* Next Tier */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Next Tier</Text>
          <FuturisticCard className="p-4 gap-3" gradient={nextTier.color}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-4xl">{nextTier.icon}</Text>
                <View>
                  <Text className="text-base font-bold text-foreground">{nextTier.name}</Text>
                  <Text className="text-sm text-muted">Earn ${nextTier.bonus} per referral</Text>
                </View>
              </View>
            </View>

            <View className="gap-2 pt-2 border-t border-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Progress</Text>
                <Text className="text-sm font-bold text-foreground">
                  {referralStats.totalReferrals}/{nextTier.referrals}
                </Text>
              </View>
              <View className="h-2 bg-surface/50 rounded-full overflow-hidden">
                <View
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${(referralStats.totalReferrals / nextTier.referrals) * 100}%` }}
                />
              </View>
              <Text className="text-xs text-muted">
                {referralsNeeded} more referrals to unlock {nextTier.name} tier
              </Text>
            </View>
          </FuturisticCard>
        </View>

        {/* All Tiers */}
        <View className="px-6 py-4 gap-3 pb-8">
          <Text className="text-sm font-bold text-foreground">All Tiers</Text>
          {TIERS.map((tier, index) => (
            <FuturisticCard key={index} className="p-4 flex-row items-center justify-between" gradient={tier.color}>
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-3xl">{tier.icon}</Text>
                <View>
                  <Text className="text-sm font-bold text-foreground">{tier.name}</Text>
                  <Text className="text-xs text-muted">{tier.referrals}+ referrals</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-success">${tier.bonus}</Text>
                <Text className="text-xs text-muted">per referral</Text>
              </View>
            </FuturisticCard>
          ))}
        </View>

        {/* How It Works */}
        <View className="px-6 pb-8">
          <FuturisticCard className="p-4 gap-3" gradient="pink">
            <Text className="text-sm font-bold text-foreground">How It Works</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-primary">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Share Code</Text>
                  <Text className="text-xs text-muted mt-1">Send your referral code to friends</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-primary">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">They Sign Up</Text>
                  <Text className="text-xs text-muted mt-1">Friends use your code to register</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-primary">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">You Earn</Text>
                  <Text className="text-xs text-muted mt-1">Get bonus for each active referral</Text>
                </View>
              </View>
            </View>
          </FuturisticCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
