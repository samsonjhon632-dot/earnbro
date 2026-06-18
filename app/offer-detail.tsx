import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { FuturisticCard } from '@/components/futuristic-card';

interface Offer {
  id: string;
  title: string;
  description: string;
  reward: number | string;
  category: string;
  expiresIn: string;
  terms: string[];
  url?: string;
  icon: string;
}

const SAMPLE_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'DoorDash - $5 Off',
    description: 'Get $5 off your next DoorDash order',
    reward: 2.5,
    category: 'Food Delivery',
    expiresIn: '7 days',
    terms: [
      'Minimum order $15',
      'New users only',
      'Valid in US only',
      'One use per account',
    ],
    url: 'https://doordash.com',
    icon: '🍔',
  },
  {
    id: '2',
    title: 'Amazon - 5% Cashback',
    description: 'Earn 5% cashback on all purchases',
    reward: 'Variable',
    category: 'Shopping',
    expiresIn: '30 days',
    terms: [
      'Valid on select items',
      'Cashback credited in 7 days',
      'Excludes gift cards',
      'Must use provided link',
    ],
    url: 'https://amazon.com',
    icon: '🛍️',
  },
];

export default function OfferDetailScreen() {
  const router = useRouter();
  const { offerId } = useLocalSearchParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      const foundOffer = SAMPLE_OFFERS.find((o) => o.id === offerId) || SAMPLE_OFFERS[0];
      setOffer(foundOffer);
      setIsLoading(false);
    }, 300);
  }, [offerId]);

  const handleClaimOffer = async () => {
    if (!offer) return;

    setIsClaiming(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Open offer URL
      if (offer.url) {
        await Linking.openURL(offer.url);
      }

      setIsClaimed(true);
      Alert.alert('Offer Claimed!', `You'll earn ${typeof offer.reward === 'number' ? '$' + offer.reward.toFixed(2) : offer.reward} when you complete this offer.`, [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to claim offer');
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading || !offer) {
    return (
      <ScreenContainer className="items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00D9FF" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        {/* Back Button */}
        <View className="px-6 py-4 flex-row items-center">
          <Pressable onPress={() => router.back()} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-lg font-bold text-foreground ml-3">Offer Details</Text>
        </View>

        {/* Offer Header */}
        <View className="px-6 py-4 gap-4">
          <FuturisticCard className="p-6 gap-4 items-center" gradient="cyan">
            <Text className="text-5xl">{offer.icon}</Text>
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-foreground text-center">{offer.title}</Text>
              <Text className="text-sm text-muted text-center">{offer.description}</Text>
            </View>

            <View className="flex-row gap-4 mt-2">
              <View className="items-center">
                <Text className="text-xs text-muted">Category</Text>
                <Text className="text-sm font-semibold text-foreground mt-1">{offer.category}</Text>
              </View>
              <View className="h-8 w-px bg-border" />
              <View className="items-center">
                <Text className="text-xs text-muted">Expires In</Text>
                <Text className="text-sm font-semibold text-warning mt-1">{offer.expiresIn}</Text>
              </View>
            </View>
          </FuturisticCard>

          {/* Reward */}
          <FuturisticCard className="p-4 gap-2 flex-row items-center justify-between" gradient="green">
            <Text className="text-sm text-muted">You'll Earn</Text>
            <Text className="text-3xl font-bold text-success">
              {typeof offer.reward === 'number' ? `$${offer.reward.toFixed(2)}` : offer.reward}
            </Text>
          </FuturisticCard>
        </View>

        {/* Terms & Conditions */}
        <View className="px-6 py-4 gap-4">
          <FuturisticCard className="p-4 gap-3" gradient="purple">
            <Text className="text-sm font-bold text-foreground">Terms & Conditions</Text>
            <View className="gap-2">
              {offer.terms.map((term, index) => (
                <View key={index} className="flex-row gap-2">
                  <Text className="text-foreground">•</Text>
                  <Text className="text-sm text-muted flex-1">{term}</Text>
                </View>
              ))}
            </View>
          </FuturisticCard>

          {/* How It Works */}
          <FuturisticCard className="p-4 gap-3" gradient="pink">
            <Text className="text-sm font-bold text-foreground">How It Works</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-primary">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Claim Offer</Text>
                  <Text className="text-xs text-muted mt-1">Click the claim button below</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-primary">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Complete Action</Text>
                  <Text className="text-xs text-muted mt-1">Follow the offer instructions</Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="bg-primary/20 w-8 h-8 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-primary">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">Get Reward</Text>
                  <Text className="text-xs text-muted mt-1">Earnings credited to your account</Text>
                </View>
              </View>
            </View>
          </FuturisticCard>

          {/* Claim Button */}
          <Pressable
            onPress={handleClaimOffer}
            disabled={isClaiming || isClaimed}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              className={`rounded-lg py-4 items-center ${
                isClaimed
                  ? 'bg-success/20 border border-success'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
            >
              {isClaiming ? (
                <ActivityIndicator color={isClaimed ? '#00FF88' : '#fff'} />
              ) : (
                <Text className={`font-bold text-base ${isClaimed ? 'text-success' : 'text-background'}`}>
                  {isClaimed ? '✓ Offer Claimed' : '🎁 Claim Offer'}
                </Text>
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
