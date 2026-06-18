import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { trpc } from '@/lib/trpc';

export default function WalletScreen() {
  const { data: wallet, isLoading: walletLoading } = trpc.wallet.getBalance.useQuery();
  const { data: transactions } = trpc.transactions.list.useQuery();
  const { data: withdrawals } = trpc.withdrawals.list.useQuery();

  const redemptionOptions = [
    { id: '1', name: 'PayPal', icon: '💳', minAmount: 5 },
    { id: '2', name: 'Gift Card', icon: '🎁', minAmount: 10 },
    { id: '3', name: 'Bank Transfer', icon: '🏦', minAmount: 10 },
  ];

  if (walletLoading) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
      </ScreenContainer>
    );
  }

  const balance = parseFloat(wallet?.balance || '0');
  const totalEarned = parseFloat(wallet?.totalEarned || '0');
  const totalWithdrawn = parseFloat(wallet?.totalWithdrawn || '0');

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
                  ${balance.toFixed(2)}
                </Text>
                <Text className="text-sm text-primary">USD</Text>
              </View>
            </View>
            <View className="w-16 h-16 rounded-full bg-surface border-2 border-primary items-center justify-center">
              <Text className="text-2xl font-bold text-primary">EB</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-6 gap-3">
          <View className="flex-row gap-3">
            <NeonCard className="flex-1">
              <Text className="text-xs text-muted mb-1">Total Earned</Text>
              <Text className="text-xl font-bold text-success">${totalEarned.toFixed(2)}</Text>
            </NeonCard>
            <NeonCard className="flex-1">
              <Text className="text-xs text-muted mb-1">Withdrawn</Text>
              <Text className="text-xl font-bold text-primary">${totalWithdrawn.toFixed(2)}</Text>
            </NeonCard>
          </View>
        </View>

        {/* Redemption Options */}
        <View className="px-6 py-6 gap-4">
          <Text className="text-lg font-bold text-foreground">Redeem Your Earnings</Text>
          {redemptionOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <NeonCard className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-2xl">{option.icon}</Text>
                  <View>
                    <Text className="font-semibold text-foreground">{option.name}</Text>
                    <Text className="text-xs text-muted">Min ${option.minAmount}</Text>
                  </View>
                </View>
                <Text className="text-primary font-bold">→</Text>
              </NeonCard>
            </Pressable>
          ))}
        </View>

        {/* Recent Transactions */}
        <View className="px-6 py-6 gap-4 pb-8">
          <Text className="text-lg font-bold text-foreground">Recent Activity</Text>
          {transactions && transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx) => (
              <View key={tx.id} className="flex-row justify-between items-center p-4 bg-surface rounded-xl border border-border">
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">{tx.description}</Text>
                  <Text className="text-xs text-muted mt-1">{new Date(tx.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text className={`font-bold ${tx.type === 'withdrawal' ? 'text-error' : 'text-success'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'} ${Math.abs(parseFloat(tx.amount)).toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-muted text-center py-8">No transactions yet</Text>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
