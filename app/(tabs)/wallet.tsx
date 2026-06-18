import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';

export default function WalletScreen() {
  const walletData = {
    balance: 4167,
    currency: 'BroCoin$',
    totalEarned: 12450,
    pendingRewards: 245,
  };

  const redemptionOptions = [
    { id: '1', name: 'PayPal', icon: '💳', minAmount: 5 },
    { id: '2', name: 'Amazon', icon: '🛍️', minAmount: 10 },
    { id: '3', name: 'Walmart', icon: '🏪', minAmount: 10 },
    { id: '4', name: 'Best Buy', icon: '🎮', minAmount: 15 },
  ];

  const recentTransactions = [
    { id: '1', title: 'Survey Completed', amount: '+$2.50', date: 'Today', status: 'completed' },
    { id: '2', title: 'Offer Claimed', amount: '+$5.00', date: 'Yesterday', status: 'completed' },
    { id: '3', title: 'Referral Bonus', amount: '+$5.00', date: '2 days ago', status: 'pending' },
  ];

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-8 border-b border-border">
          <Text className="text-sm text-muted mb-2">Profile & Wallet</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-muted mb-1">Your Balance</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-4xl font-bold text-foreground">
                  {walletData.balance.toLocaleString()}
                </Text>
                <Text className="text-sm text-primary">{walletData.currency}</Text>
              </View>
            </View>
            <View className="w-16 h-16 rounded-full bg-surface border-2 border-primary items-center justify-center">
              <Text className="text-2xl font-bold text-primary">R</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-6 gap-3">
          <View className="flex-row gap-3">
            <NeonCard className="flex-1 bg-surface border-border">
              <Text className="text-xs text-muted mb-1">Total Earned</Text>
              <Text className="text-xl font-bold text-success">${(walletData.totalEarned / 100).toFixed(2)}</Text>
            </NeonCard>
            <NeonCard className="flex-1 bg-surface border-border">
              <Text className="text-xs text-muted mb-1">Pending</Text>
              <Text className="text-xl font-bold text-warning">${(walletData.pendingRewards / 100).toFixed(2)}</Text>
            </NeonCard>
          </View>

          <TouchableOpacity className="bg-warning rounded-lg py-4 px-6 items-center">
            <Text className="text-background font-bold text-base">🎉 Redeem Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* Redemption Options */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Redeem To</Text>
          <View className="flex-row flex-wrap gap-3">
            {redemptionOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className="flex-1 min-w-[45%] bg-surface border border-border rounded-lg py-4 px-3 items-center"
              >
                <Text className="text-3xl mb-2">{option.icon}</Text>
                <Text className="text-xs font-semibold text-foreground text-center">{option.name}</Text>
                <Text className="text-xs text-muted mt-1">Min ${option.minAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Settings</Text>
          <NeonCard className="mb-3 bg-surface border-border">
            <TouchableOpacity className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-foreground">⚙️ Settings</Text>
              <Text className="text-muted">›</Text>
            </TouchableOpacity>
          </NeonCard>
          <NeonCard className="mb-3 bg-surface border-border">
            <TouchableOpacity className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-foreground">❓ About Us</Text>
              <Text className="text-muted">›</Text>
            </TouchableOpacity>
          </NeonCard>
          <NeonCard className="bg-surface border-border">
            <TouchableOpacity className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-error">🚪 Logout</Text>
              <Text className="text-muted">›</Text>
            </TouchableOpacity>
          </NeonCard>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-foreground mb-4">Recent Activity</Text>
          {recentTransactions.map((tx) => (
            <NeonCard key={tx.id} className="mb-3 bg-surface border-border">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{tx.title}</Text>
                  <Text className="text-xs text-muted mt-1">{tx.date}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-success">{tx.amount}</Text>
                  <Text className="text-xs text-muted mt-1">
                    {tx.status === 'completed' ? '✓' : '⏳'}
                  </Text>
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
