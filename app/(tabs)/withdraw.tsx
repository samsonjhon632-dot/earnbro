import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { NeonCard } from '@/components/neon-card';
import { trpc } from '@/lib/trpc';

export default function WithdrawScreen() {
  const { data: wallet } = trpc.wallet.getBalance.useQuery();
  const { data: withdrawals } = trpc.withdrawals.list.useQuery();
  const withdrawMutation = trpc.withdrawals.request.useMutation();

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'paypal' | 'giftcard' | 'bank_transfer'>('paypal');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balance = parseFloat(wallet?.balance || '0');
  const minWithdrawal = 5;
  const canWithdraw = balance >= minWithdrawal;

  const handleWithdraw = async () => {
    if (!amount || !paymentDetails) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < minWithdrawal) {
      Alert.alert('Error', `Minimum withdrawal is $${minWithdrawal}`);
      return;
    }

    if (withdrawAmount > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setIsSubmitting(true);
    try {
      await withdrawMutation.mutateAsync({
        amount: withdrawAmount.toFixed(2),
        method,
        paymentDetails,
      });

      Alert.alert('Success', 'Withdrawal request submitted! You will receive funds within 3-5 business days.');
      setAmount('');
      setPaymentDetails('');
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="bg-gradient-to-b from-primary/10 to-transparent px-6 py-6 border-b border-border">
          <Text className="text-2xl font-bold text-foreground mb-2">Withdraw Earnings</Text>
          <Text className="text-sm text-muted">Cash out your balance to PayPal, gift cards, or bank transfer</Text>
        </View>

        {/* Balance Card */}
        <View className="px-6 py-6">
          <NeonCard className="p-6 gap-4">
            <Text className="text-sm text-muted">Available Balance</Text>
            <Text className="text-4xl font-bold text-success">${balance.toFixed(2)}</Text>
            <Text className="text-xs text-muted">
              {canWithdraw ? 'You can withdraw now' : `You need $${(minWithdrawal - balance).toFixed(2)} more to withdraw`}
            </Text>
          </NeonCard>
        </View>

        {/* Withdrawal Form */}
        <View className="px-6 py-6 gap-6">
          {/* Amount Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Withdrawal Amount</Text>
            <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3 gap-2">
              <Text className="text-lg text-primary">$</Text>
              <TextInput
                placeholder="Enter amount"
                placeholderTextColor="#687076"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                className="flex-1 text-foreground"
              />
            </View>
            <Text className="text-xs text-muted">Minimum: ${minWithdrawal}</Text>
          </View>

          {/* Payment Method */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Payment Method</Text>
            {(['paypal', 'giftcard', 'bank_transfer'] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => setMethod(m)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View
                  className={`flex-row items-center p-4 rounded-lg border ${
                    method === m ? 'bg-primary/10 border-primary' : 'bg-surface border-border'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      method === m ? 'bg-primary border-primary' : 'border-border'
                    }`}
                  >
                    {method === m && <View className="w-2 h-2 bg-background rounded-full" />}
                  </View>
                  <View className="flex-1">
                    <Text className={`font-semibold ${method === m ? 'text-primary' : 'text-foreground'}`}>
                      {m === 'paypal' && 'PayPal'}
                      {m === 'giftcard' && 'Gift Card'}
                      {m === 'bank_transfer' && 'Bank Transfer'}
                    </Text>
                    <Text className="text-xs text-muted mt-1">
                      {m === 'paypal' && 'Instant transfer to PayPal account'}
                      {m === 'giftcard' && 'Amazon, Walmart, or Best Buy'}
                      {m === 'bank_transfer' && 'Direct to your bank account'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Payment Details */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              {method === 'paypal' && 'PayPal Email'}
              {method === 'giftcard' && 'Email or Account'}
              {method === 'bank_transfer' && 'Account Details'}
            </Text>
            <TextInput
              placeholder={
                method === 'paypal'
                  ? 'your@email.com'
                  : method === 'giftcard'
                    ? 'your@email.com'
                    : 'Account number'
              }
              placeholderTextColor="#687076"
              value={paymentDetails}
              onChangeText={setPaymentDetails}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleWithdraw}
            disabled={!canWithdraw || isSubmitting || withdrawMutation.isPending}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <View
              className={`py-4 px-6 rounded-lg items-center ${
                canWithdraw && !isSubmitting ? 'bg-primary' : 'bg-muted/50'
              }`}
            >
              {isSubmitting || withdrawMutation.isPending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-background font-bold text-lg">
                  {canWithdraw ? 'Request Withdrawal' : 'Insufficient Balance'}
                </Text>
              )}
            </View>
          </Pressable>
        </View>

        {/* Recent Withdrawals */}
        {withdrawals && withdrawals.length > 0 && (
          <View className="px-6 py-6 gap-4 border-t border-border">
            <Text className="text-lg font-bold text-foreground">Recent Withdrawals</Text>
            {withdrawals.slice(0, 5).map((w) => (
              <NeonCard key={w.id} className="p-4">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="font-semibold text-foreground">${w.amount}</Text>
                    <Text className="text-xs text-muted mt-1">{w.method}</Text>
                    <Text className="text-xs text-muted mt-1">{new Date(w.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      w.status === 'completed'
                        ? 'bg-success/20'
                        : w.status === 'pending'
                          ? 'bg-warning/20'
                          : 'bg-error/20'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        w.status === 'completed'
                          ? 'text-success'
                          : w.status === 'pending'
                            ? 'text-warning'
                            : 'text-error'
                      }`}
                    >
                      {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </NeonCard>
            ))}
          </View>
        )}

        <View className="h-4" />
      </ScrollView>
    </ScreenContainer>
  );
}
