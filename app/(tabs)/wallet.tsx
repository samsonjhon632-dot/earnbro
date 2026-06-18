import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, FlatList, Modal, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';

interface Transaction {
  id: string;
  type: 'earned' | 'withdrawn' | 'bonus' | 'referral';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  icon: string;
}

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'earned',
    amount: 2.5,
    description: 'Completed DoorDash Offer',
    date: 'Today',
    status: 'completed',
    icon: '🍔',
  },
  {
    id: '2',
    type: 'bonus',
    amount: 5.0,
    description: 'Daily Bonus',
    date: 'Today',
    status: 'completed',
    icon: '🎁',
  },
  {
    id: '3',
    type: 'referral',
    amount: 3.0,
    description: 'Friend Signup Bonus',
    date: 'Yesterday',
    status: 'completed',
    icon: '👥',
  },
  {
    id: '4',
    type: 'withdrawn',
    amount: 20.0,
    description: 'PayPal Withdrawal',
    date: '2 days ago',
    status: 'completed',
    icon: '💸',
  },
  {
    id: '5',
    type: 'earned',
    amount: 1.5,
    description: 'Video Watch Reward',
    date: '3 days ago',
    status: 'completed',
    icon: '🎬',
  },
];

export default function WalletScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'earned' | 'withdrawn' | 'bonus' | 'referral'>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const filteredTransactions = selectedFilter === 'all' 
    ? TRANSACTIONS 
    : TRANSACTIONS.filter(t => t.type === selectedFilter);

  const totalEarned = TRANSACTIONS
    .filter(t => t.status === 'completed' && (t.type === 'earned' || t.type === 'bonus' || t.type === 'referral'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = TRANSACTIONS
    .filter(t => t.status === 'completed' && t.type === 'withdrawn')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingWithdrawal = TRANSACTIONS
    .filter(t => t.status === 'pending' && t.type === 'withdrawn')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalEarned - totalWithdrawn;

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 5) {
      Alert.alert('Error', 'Minimum withdrawal is $5');
      return;
    }
    if (amount > currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }
    Alert.alert('Success', `Withdrawal of $${amount.toFixed(2)} initiated! Check your PayPal in 1-3 business days.`);
    setWithdrawAmount('');
    setShowWithdrawModal(false);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View className="mb-3">
      <FuturisticCard className="p-4 flex-row items-center gap-3" gradient="cyan">
        <Text className="text-3xl">{item.icon}</Text>
        <View className="flex-1 gap-1">
          <Text className="text-sm font-semibold text-foreground">{item.description}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-muted">{item.date}</Text>
            <Text className={`text-xs px-2 py-1 rounded-full ${
              item.status === 'completed' ? 'bg-success/20 text-success' :
              item.status === 'pending' ? 'bg-warning/20 text-warning' :
              'bg-error/20 text-error'
            }`}>
              {item.status}
            </Text>
          </View>
        </View>
        <Text className={`text-base font-bold ${item.type === 'withdrawn' ? 'text-error' : 'text-success'}`}>
          {item.type === 'withdrawn' ? '-' : '+'}${item.amount.toFixed(2)}
        </Text>
      </FuturisticCard>
    </View>
  );

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="px-6 py-6 gap-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-muted">Wallet</Text>
              <Text className="text-2xl font-bold text-foreground">Your Balance</Text>
            </View>
            <Text className="text-3xl">💳</Text>
          </View>

          {/* Balance Card */}
          <FuturisticCard className="p-6 gap-4" gradient="purple">
            <View className="gap-2">
              <Text className="text-sm text-muted">Current Balance</Text>
              <Text className="text-4xl font-bold text-success">${currentBalance.toFixed(2)}</Text>
            </View>

            <View className="flex-row gap-2 pt-4 border-t border-border">
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Total Earned</Text>
                <Text className="text-lg font-bold text-success">${totalEarned.toFixed(2)}</Text>
              </View>
              <View className="w-px bg-border" />
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Withdrawn</Text>
                <Text className="text-lg font-bold text-error">${totalWithdrawn.toFixed(2)}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => setShowWithdrawModal(true)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg py-3 items-center mt-4">
                <Text className="text-background font-bold">Withdraw Money</Text>
              </View>
            </Pressable>
          </FuturisticCard>
        </View>

        {/* Withdrawal Methods */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-bold text-foreground">Withdrawal Methods</Text>
          <FuturisticCard className="p-4 flex-row items-center gap-3" gradient="cyan">
            <Text className="text-3xl">💰</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">PayPal</Text>
              <Text className="text-xs text-muted mt-1">Instant transfer to your PayPal account</Text>
            </View>
            <Text className="text-lg">✓</Text>
          </FuturisticCard>
          <FuturisticCard className="p-4 flex-row items-center gap-3" gradient="pink">
            <Text className="text-3xl">🎁</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">Gift Cards</Text>
              <Text className="text-xs text-muted mt-1">Amazon, iTunes, Google Play</Text>
            </View>
            <Text className="text-lg">✓</Text>
          </FuturisticCard>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-4"
          contentContainerStyle={{ gap: 8 }}
        >
          {['all', 'earned', 'withdrawn', 'bonus', 'referral'].map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter as any)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View
                className={`px-4 py-2 rounded-full border ${
                  selectedFilter === filter
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedFilter === filter ? 'text-background' : 'text-foreground'
                  }`}
                >
                  {filter === 'all' && 'All'}
                  {filter === 'earned' && 'Earned'}
                  {filter === 'withdrawn' && 'Withdrawn'}
                  {filter === 'bonus' && 'Bonus'}
                  {filter === 'referral' && 'Referral'}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Transactions */}
        <View className="px-6 py-4 pb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">Transaction History</Text>
            <Text className="text-sm text-muted">{filteredTransactions.length}</Text>
          </View>

          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <FuturisticCard className="w-full p-6 gap-4" gradient="purple">
            <Text className="text-lg font-bold text-foreground">Withdraw Money</Text>
            <Text className="text-sm text-muted">Available: ${currentBalance.toFixed(2)}</Text>

            <View className="gap-2">
              <Text className="text-xs text-muted">Amount (minimum $5)</Text>
              <View className="border border-cyan-500/30 rounded-lg px-4 py-3 flex-row items-center gap-2 bg-surface/50">
                <Text className="text-foreground">$</Text>
                <TextInput 
                  className="text-foreground flex-1"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                  placeholder="Enter amount"
                  placeholderTextColor="#8B92B0"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View className="flex-row gap-2 pt-4">
              <Pressable
                onPress={() => setShowWithdrawModal(false)}
                className="flex-1"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-surface/50 border border-border rounded-lg py-3 items-center">
                  <Text className="text-foreground font-semibold">Cancel</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={handleWithdraw}
                className="flex-1"
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg py-3 items-center">
                  <Text className="text-background font-bold">Withdraw</Text>
                </View>
              </Pressable>
            </View>
          </FuturisticCard>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
