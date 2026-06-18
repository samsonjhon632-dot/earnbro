import { ScrollView, Text, View, TouchableOpacity, Share } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  pendingEarnings: number;
}

export default function ReferScreen() {
  const [copied, setCopied] = useState(false);
  const [stats] = useState<ReferralStats>({
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 45.5,
    pendingEarnings: 12.75,
  });

  const referralCode = 'EARNBRO2024';
  const referralLink = `https://earnbro.app/ref/${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join EarnBro and earn money! Use my referral code: ${referralCode}\n\nEarn $5 bonus when you sign up!`,
        url: referralLink,
        title: 'Join EarnBro',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-8 border-b border-border">
          <Text className="text-sm text-muted mb-2">Refer & Earn</Text>
          <Text className="text-3xl font-bold text-foreground">Invite Friends</Text>
          <Text className="text-xs text-muted mt-2">Earn money when friends join</Text>
        </View>

        {/* Referral Stats */}
        <View className="px-6 py-4 gap-3">
          <View className="flex-row gap-3">
            <NeonCard className="flex-1 bg-surface border-border">
              <Text className="text-xs text-muted mb-2">Total Referrals</Text>
              <Text className="text-2xl font-bold text-primary">{stats.totalReferrals}</Text>
              <Text className="text-xs text-success mt-1">+{stats.activeReferrals} active</Text>
            </NeonCard>
            <NeonCard className="flex-1 bg-surface border-border">
              <Text className="text-xs text-muted mb-2">Earnings</Text>
              <Text className="text-2xl font-bold text-success">${stats.totalEarned.toFixed(2)}</Text>
              <Text className="text-xs text-warning mt-1">+${stats.pendingEarnings.toFixed(2)} pending</Text>
            </NeonCard>
          </View>
        </View>

        {/* Referral Code Card */}
        <View className="px-6 py-6">
          <NeonCard className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary">
            <Text className="text-xs text-muted mb-3">Your Referral Code</Text>
            <View className="flex-row items-center gap-3 mb-4">
              <View className="flex-1 bg-background border border-border rounded-lg px-4 py-3">
                <Text className="text-lg font-bold text-primary">{referralCode}</Text>
              </View>
              <TouchableOpacity
                onPress={handleCopyCode}
                className="bg-primary rounded-lg p-3"
              >
                <Text className="text-background text-lg">📋</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-muted mb-4">
              {copied ? '✓ Copied to clipboard!' : 'Tap to copy your referral code'}
            </Text>
            <TouchableOpacity
              onPress={handleShare}
              className="bg-primary rounded-lg py-3 px-6 items-center"
            >
              <Text className="text-background font-bold">📤 Share Referral Link</Text>
            </TouchableOpacity>
          </NeonCard>
        </View>

        {/* Referral Tiers */}
        <View className="px-6 py-6">
          <Text className="text-sm font-bold text-foreground mb-3">Referral Tiers</Text>
          <View className="gap-2">
            {[
              { tier: 'Bronze', referrals: '1-5', bonus: '$0.50 per ref', icon: '🥉' },
              { tier: 'Silver', referrals: '6-15', bonus: '$1.00 per ref', icon: '🥈' },
              { tier: 'Gold', referrals: '16+', bonus: '$2.00 per ref', icon: '🥇' },
            ].map((tier, index) => (
              <NeonCard key={index} className="bg-surface border-border">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-2xl">{tier.icon}</Text>
                    <View>
                      <Text className="text-sm font-bold text-foreground">{tier.tier}</Text>
                      <Text className="text-xs text-muted mt-1">{tier.referrals} referrals</Text>
                    </View>
                  </View>
                  <Text className="text-sm font-bold text-primary">{tier.bonus}</Text>
                </View>
              </NeonCard>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View className="px-6 pb-6">
          <Text className="text-sm font-bold text-foreground mb-3">How It Works</Text>
          {[
            { step: '1', title: 'Share Your Code', desc: 'Send your referral code to friends' },
            { step: '2', title: 'They Sign Up', desc: 'Friends create an account with your code' },
            { step: '3', title: 'You Both Earn', desc: 'Get bonus when they complete first task' },
            { step: '4', title: 'Earn More', desc: 'Unlock higher tiers for bigger bonuses' },
          ].map((item, index) => (
            <NeonCard key={index} className="mb-3 bg-surface border-border">
              <View className="flex-row gap-3">
                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background font-bold text-sm">{item.step}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{item.title}</Text>
                  <Text className="text-xs text-muted mt-1">{item.desc}</Text>
                </View>
              </View>
            </NeonCard>
          ))}
        </View>

        {/* Bottom spacing */}
        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}
