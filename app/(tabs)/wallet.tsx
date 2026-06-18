import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, Alert, FlatList, Modal, TextInput, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/use-auth';

interface Transaction {
  id: number;
  type: string;
  amount: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function WalletScreen() {
  const { isAuthenticated } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'earned' | 'withdrawn' | 'bonus' | 'referral'>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'paypal' | 'giftcard' | 'bank'>('paypal');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Fetch wallet balance
  const walletQuery = trpc.wallet.getBalance.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  // Fetch transactions
  const transactionsQuery = trpc.transactions.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  // Withdrawal mutation
  const withdrawalMutation = trpc.withdrawals.request.useMutation();

  const wallet = walletQuery.data;
  const transactions = transactionsQuery.data || [];

  const filteredTransactions = selectedFilter === 'all'
    ? transactions
    : transactions.filter(t => t.type === selectedFilter);

  const currentBalance = wallet?.balance ? parseFloat(wallet.balance) : 0;
  const totalEarned = wallet?.totalEarned ? parseFloat(wallet.totalEarned) : 0;
  const totalWithdrawn = wallet?.totalWithdrawn ? parseFloat(wallet.totalWithdrawn) : 0;
  const pendingBalance = wallet?.pendingBalance ? parseFloat(wallet.pendingBalance) : 0;

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 5) {
      Alert.alert('Error', 'Minimum withdrawal is $5');
      return;
    }
    if (amount > currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setIsWithdrawing(true);
    try {
      // Call withdrawal API
      const result = await withdrawalMutation.mutateAsync({
        amount: amount.toFixed(2),
        method: withdrawMethod as any,
        paymentDetails: '', // Would get from user profile
      });

      Alert.alert('Success', `Withdrawal of $${amount.toFixed(2)} initiated! You'll receive it via ${withdrawMethod} in 1-3 business days.`);
      setWithdrawAmount('');
      setShowWithdrawModal(false);
      walletQuery.refetch();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Please log in to view your wallet</Text>
      </ScreenContainer>
    );
  }

  if (walletQuery.isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="px-6 py-6 gap-4">
          <Text className="text-2xl font-bold text-foreground">Wallet</Text>

          {/* Balance Card */}
          <FuturisticCard className="p-6 gap-4" gradient="cyan">
            <Text className="text-sm text-muted">Available Balance</Text>
            <Text className="text-4xl font-bold text-primary">${currentBalance.toFixed(2)}</Text>
            <View className="flex-row gap-2 pt-2">
              <Pressable
                onPress={() => setShowWithdrawModal(true)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, { flex: 1 }]}
              >
                <View className="bg-success rounded-lg py-3 items-center">
                  <Text className="text-sm font-bold text-background">Withdraw</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => walletQuery.refetch()}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, { flex: 1 }]}
              >
                <View className="bg-primary/20 border border-primary rounded-lg py-3 items-center">
                  <Text className="text-sm font-bold text-primary">Refresh</Text>
                </View>
              </Pressable>
            </View>
          </FuturisticCard>

          {/* Stats */}
          <View className="flex-row gap-3">
            <FuturisticCard className="flex-1 p-4 gap-2" gradient="purple">
              <Text className="text-xs text-muted">Total Earned</Text>
              <Text className="text-xl font-bold text-success">${totalEarned.toFixed(2)}</Text>
            </FuturisticCard>
            <FuturisticCard className="flex-1 p-4 gap-2" gradient="blue">
              <Text className="text-xs text-muted">Withdrawn</Text>
              <Text className="text-xl font-bold text-primary">${totalWithdrawn.toFixed(2)}</Text>
            </FuturisticCard>
            {pendingBalance > 0 && (
              <FuturisticCard className="flex-1 p-4 gap-2" gradient="pink">
                <Text className="text-xs text-muted">Pending</Text>
                <Text className="text-xl font-bold text-warning">${pendingBalance.toFixed(2)}</Text>
              </FuturisticCard>
            )}
          </View>
        </View>

        {/* Filters */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Transaction History</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            {['all', 'earned', 'withdrawn', 'bonus', 'referral'].map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter as any)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View
                  className={`px-4 py-2 rounded-full ${
                    selectedFilter === filter
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold capitalize ${
                      selectedFilter === filter ? 'text-background' : 'text-foreground'
                    }`}
                  >
                    {filter}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Transactions List */}
        <View className="px-6 pb-6">
          {filteredTransactions.length === 0 ? (
            <FuturisticCard className="p-8 items-center gap-2" gradient="purple">
              <Text className="text-3xl">📭</Text>
              <Text className="text-sm text-muted">No transactions yet</Text>
            </FuturisticCard>
          ) : (
            <FlatList
              data={filteredTransactions}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <FuturisticCard className="p-4 flex-row items-center gap-3 mb-3" gradient="purple">
                  <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                    <Text className="text-lg">
                      {item.type === 'survey' ? '📋' : item.type === 'offer' ? '🎁' : item.type === 'game' ? '🎮' : item.type === 'withdrawal' ? '💸' : item.type === 'bonus' ? '🎁' : '👥'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground">{item.description}</Text>
                    <Text className="text-xs text-muted mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className={`text-sm font-bold ${item.type === 'withdrawal' ? 'text-error' : 'text-success'}`}>
                      {item.type === 'withdrawal' ? '-' : '+'}${parseFloat(item.amount).toFixed(2)}
                    </Text>
                    <Text className="text-xs text-muted mt-1 capitalize">{item.status}</Text>
                  </View>
                </FuturisticCard>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal visible={showWithdrawModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <FuturisticCard className="w-full max-w-sm p-6 gap-4" gradient="blue">
            <Text className="text-lg font-bold text-foreground">Request Withdrawal</Text>

            <View className="gap-3">
              <View>
                <Text className="text-xs font-bold text-muted mb-2">Amount (USD)</Text>
                <TextInput
                  placeholder="Enter amount"
                  placeholderTextColor="#8B92B0"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                  keyboardType="decimal-pad"
                  className="bg-surface/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-foreground"
                />
                <Text className="text-xs text-muted mt-2">Min: $5 | Available: ${currentBalance.toFixed(2)}</Text>
              </View>

              <View>
                <Text className="text-xs font-bold text-muted mb-2">Withdraw To</Text>
                {['paypal', 'giftcard', 'bank'].map((method) => (
                  <Pressable
                    key={method}
                    onPress={() => setWithdrawMethod(method as any)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <View className={`p-3 rounded-lg mb-2 border ${withdrawMethod === method ? 'border-primary bg-primary/10' : 'border-border'}`}>
                      <Text className="text-sm font-bold text-foreground capitalize">{method}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3 pt-4">
              <Pressable
                onPress={() => setShowWithdrawModal(false)}
                disabled={isWithdrawing}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, { flex: 1 }]}
              >
                <View className="border border-border rounded-lg py-3 items-center">
                  <Text className="text-sm font-bold text-foreground">Cancel</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={handleWithdraw}
                disabled={isWithdrawing}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }, { flex: 1 }]}
              >
                <View className="bg-success rounded-lg py-3 items-center">
                  {isWithdrawing ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text className="text-sm font-bold text-background">Withdraw</Text>
                  )}
                </View>
              </Pressable>
            </View>
          </FuturisticCard>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
