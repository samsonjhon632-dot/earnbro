import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, ActivityIndicator, Alert, FlatList, Linking } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';
import { trpc } from '@/lib/trpc';

export default function WithdrawScreen() {
  const { data: wallet } = trpc.wallet.getBalance.useQuery();
  const { data: withdrawals } = trpc.withdrawals.list.useQuery();
  const { data: cryptos } = trpc.withdrawals.getSupportedCryptos.useQuery();
  const { data: rates } = trpc.withdrawals.getExchangeRates.useQuery();
  const withdrawMutation = trpc.withdrawals.request.useMutation();
  const validateAddressQuery = trpc.blockchain.validateAddress.useQuery;
  const getExplorerUrlQuery = trpc.blockchain.getExplorerUrl.useQuery;

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bitcoin' | 'ethereum' | 'usdc' | 'litecoin'>('bitcoin');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [addressValidation, setAddressValidation] = useState<{ valid: boolean; message: string } | null>(null);

  const balance = parseFloat(wallet?.balance || '0');
  const minWithdrawal = 5;
  const canWithdraw = balance >= minWithdrawal;

  const selectedCrypto = cryptos?.find(c => c.id === method);
  const exchangeRate = rates ? rates[method as keyof typeof rates] || 0 : 0;
  const cryptoAmount = amount && exchangeRate ? (parseFloat(amount as any) / exchangeRate).toFixed(8) : '0';

  const handleValidateAddress = async (address: string) => {
    if (!address) {
      setAddressValidation(null);
      return;
    }

    try {
      // Validate address using query
      const result = await fetch('/api/trpc/blockchain.validateAddress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, address }),
      }).then(r => r.json());

      setAddressValidation({
        valid: result.valid,
        message: result.valid ? '✓ Valid address' : '✗ Invalid address',
      });
    } catch (error) {
      setAddressValidation({
        valid: false,
        message: 'Unable to validate address',
      });
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !walletAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!addressValidation?.valid) {
      Alert.alert('Error', 'Please enter a valid wallet address');
      return;
    }

    const withdrawAmount = parseFloat(amount as any);
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
      const amountNum = parseFloat(amount as any);
      const amountStr = `${amountNum.toFixed(2)}`;

      await withdrawMutation.mutateAsync({
        amount: amountStr as any,
        method,
        walletAddress,
      });

      Alert.alert('Success', `Withdrawal of ${cryptoAmount} ${method.toUpperCase()} initiated! Funds will arrive in 10-30 minutes.`);
      setAmount('');
      setWalletAddress('');
      setAddressValidation(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to process withdrawal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenExplorer = async (withdrawal: any) => {
    if (!withdrawal.transactionId) return;

    try {
      // Get explorer URL
      const result = await fetch('/api/trpc/blockchain.getExplorerUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: withdrawal.method, transactionHash: withdrawal.transactionId }),
      }).then(r => r.json());

      await Linking.openURL(result.explorerUrl);
    } catch (error) {
      Alert.alert('Error', 'Unable to open explorer');
    }
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Header */}
        <View className="px-6 py-6 gap-2">
          <Text className="text-3xl font-bold text-foreground">Withdraw to Crypto</Text>
          <Text className="text-sm text-muted">Fast, secure blockchain transfers</Text>
        </View>

        {/* Balance Card */}
        <View className="px-6 py-4">
          <FuturisticCard className="p-6 gap-4" gradient="cyan">
            <Text className="text-sm text-muted">Available Balance</Text>
            <Text className="text-4xl font-bold text-primary">${balance.toFixed(2)}</Text>
            <View className="flex-row gap-4 pt-2">
              <View>
                <Text className="text-xs text-muted">Min Withdrawal</Text>
                <Text className="text-lg font-bold text-success mt-1">${minWithdrawal}</Text>
              </View>
              <View className="w-px bg-border" />
              <View>
                <Text className="text-xs text-muted">Status</Text>
                <Text className={`text-lg font-bold mt-1 ${canWithdraw ? 'text-success' : 'text-warning'}`}>
                  {canWithdraw ? 'Ready' : 'Locked'}
                </Text>
              </View>
            </View>
          </FuturisticCard>
        </View>

        {/* Crypto Selection */}
        <View className="px-6 py-4 gap-3">
          <Text className="text-sm font-semibold text-foreground">Select Cryptocurrency</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            {cryptos?.map((crypto) => (
              <Pressable
                key={crypto.id}
                onPress={() => setMethod(crypto.id as any)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <FuturisticCard
                  className={`p-4 items-center gap-2 ${method === crypto.id ? 'ring-2 ring-primary' : ''}`}
                  gradient={method === crypto.id ? 'cyan' : 'purple'}
                >
                  <Text className="text-3xl">{crypto.icon}</Text>
                  <Text className="text-xs font-bold text-foreground">{crypto.symbol}</Text>
                  <Text className="text-xs text-muted">${rates?.[crypto.id as keyof typeof rates] || '0'}</Text>
                </FuturisticCard>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Withdrawal Form */}
        <View className="px-6 py-6 gap-6">
          {/* Amount Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">USD Amount</Text>
            <View className="flex-row items-center bg-surface border border-border rounded-lg px-4 py-3 gap-2">
              <Text className="text-lg text-primary font-bold">$</Text>
              <TextInput
                placeholder="Enter amount"
                placeholderTextColor="#687076"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                className="flex-1 text-foreground text-lg"
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">Min: ${minWithdrawal}</Text>
              <Text className="text-xs text-primary font-bold">
                ≈ {cryptoAmount} {method.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Wallet Address Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              {method.toUpperCase()} Wallet Address
            </Text>
            <TextInput
              placeholder={`Enter your ${method.toUpperCase()} wallet address`}
              placeholderTextColor="#687076"
              value={walletAddress}
              onChangeText={(text) => {
                setWalletAddress(text);
                if (text.length > 10) {
                  handleValidateAddress(text);
                }
              }}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-sm"
              multiline
              numberOfLines={3}
            />
            <Text className="text-xs text-muted">
              {method === 'bitcoin' && 'Starts with 1, 3, or bc1'}
              {method === 'ethereum' && 'Starts with 0x'}
              {method === 'usdc' && 'Ethereum address (0x...)'}
              {method === 'litecoin' && 'Starts with L or M'}
            </Text>
            {addressValidation && (
              <Text className={`text-xs font-bold mt-1 ${addressValidation.valid ? 'text-success' : 'text-error'}`}>
                {addressValidation.message}
              </Text>
            )}
          </View>

          {/* Withdraw Button */}
          <Pressable
            onPress={handleWithdraw}
            disabled={!canWithdraw || isSubmitting || !addressValidation?.valid}
            style={({ pressed }) => [
              { opacity: pressed ? 0.8 : 1 },
              (!canWithdraw || !addressValidation?.valid) && { opacity: 0.5 },
            ]}
          >
            <FuturisticCard className="p-4 items-center" gradient="cyan">
              {isSubmitting ? (
                <ActivityIndicator size="large" color="#00D9FF" />
              ) : (
                <>
                  <Text className="text-lg font-bold text-background">
                    {canWithdraw && addressValidation?.valid ? 'Withdraw Now' : 'Insufficient Balance'}
                  </Text>
                  <Text className="text-xs text-background/80 mt-1">
                    Receive in 10-30 minutes via blockchain
                  </Text>
                </>
              )}
            </FuturisticCard>
          </Pressable>

          {/* Info Box */}
          <FuturisticCard className="p-4 gap-2" gradient="purple">
            <Text className="text-xs font-bold text-foreground">⚡ Fast & Secure</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Withdrawals are processed directly to your blockchain wallet via smart contracts. No intermediaries, no delays. Funds arrive within 10-30 minutes.
            </Text>
          </FuturisticCard>
        </View>

        {/* Withdrawal History */}
        {withdrawals && withdrawals.length > 0 && (
          <View className="px-6 py-6 gap-3">
            <Pressable onPress={() => setShowHistory(!showHistory)}>
              <Text className="text-sm font-semibold text-foreground">
                Recent Withdrawals ({withdrawals.length})
              </Text>
            </Pressable>

            {showHistory && (
              <FlatList
                data={withdrawals}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => item.transactionId && handleOpenExplorer(item)}
                    disabled={!item.transactionId}
                  >
                    <FuturisticCard className="p-4 gap-2 mb-2" gradient="pink">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="text-sm font-bold text-foreground">
                            ${parseFloat(item.amount).toFixed(2)}
                          </Text>
                          <Text className="text-xs text-muted mt-1">{item.method}</Text>
                          {item.transactionId && (
                            <Text className="text-xs text-primary mt-1 underline">
                              View on Explorer →
                            </Text>
                          )}
                        </View>
                        <View className="items-end">
                          <Text
                            className={`text-xs font-bold ${
                              item.status === 'completed'
                                ? 'text-success'
                                : item.status === 'failed'
                                ? 'text-error'
                                : 'text-warning'
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </Text>
                          <Text className="text-xs text-muted mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </FuturisticCard>
                  </Pressable>
                )}
              />
            )}
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </ScreenContainer>
  );
}
