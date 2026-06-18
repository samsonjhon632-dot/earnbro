import { ScrollView, Text, View, TouchableOpacity, Share } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';

export default function ReferScreen() {
  const referralCode = 'EARNBRO2024';
  const referralLink = `https://earnbro.app/ref/${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join EarnBro and earn money! Use my referral code: ${referralCode}`,
        url: referralLink,
        title: 'Join EarnBro',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const referralStats = [
    { label: 'Total Referrals', value: '12', color: 'text-primary' },
    { label: 'Earnings from Referrals', value: '$45.50', color: 'text-success' },
    { label: 'Pending Bonus', value: '$12.00', color: 'text-warning' },
  ];

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-8 border-b border-border">
          <Text className="text-sm text-muted mb-2">Refer & Earn</Text>
          <Text className="text-3xl font-bold text-foreground">Invite Friends</Text>
          <Text className="text-xs text-muted mt-2">Earn $5 for each friend who joins</Text>
        </View>

        {/* Referral Code Card */}
        <View className="px-6 py-6">
          <NeonCard className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary">
            <Text className="text-xs text-muted mb-3">Your Referral Code</Text>
            <Text className="text-3xl font-bold text-primary mb-4">{referralCode}</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleShare}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-background font-semibold">Share Code</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-surface border border-primary rounded-lg py-3 items-center">
                <Text className="text-primary font-semibold">Copy Link</Text>
              </TouchableOpacity>
            </View>
          </NeonCard>
        </View>

        {/* Stats */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Your Stats</Text>
          {referralStats.map((stat, index) => (
            <NeonCard key={index} className="mb-3 bg-surface border-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">{stat.label}</Text>
                <Text className={`text-lg font-bold ${stat.color}`}>{stat.value}</Text>
              </View>
            </NeonCard>
          ))}
        </View>

        {/* How It Works */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-foreground mb-4">How It Works</Text>
          {[
            { step: '1', title: 'Share Your Code', desc: 'Send your referral code to friends' },
            { step: '2', title: 'They Sign Up', desc: 'Friends create an account with your code' },
            { step: '3', title: 'You Both Earn', desc: 'Get $5 bonus when they complete first task' },
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
