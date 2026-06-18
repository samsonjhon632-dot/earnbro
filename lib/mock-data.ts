/**
 * Mock data for InboxRewards app development
 * Replace with real API calls in production
 */

import type { Survey, Offer, Game, RedemptionOption, DashboardStats } from './types';

export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Consumer Preferences Survey',
    description: 'Share your thoughts on consumer products and services',
    reward: 2.5,
    estimatedTime: 8,
    category: 'General',
    completionPercentage: 0,
    status: 'available',
  },
  {
    id: '2',
    title: 'Technology Usage Study',
    description: 'Tell us about your technology habits and preferences',
    reward: 3.75,
    estimatedTime: 12,
    category: 'Technology',
    completionPercentage: 0,
    status: 'available',
  },
  {
    id: '3',
    title: 'Shopping Habits Survey',
    description: 'Share your online and offline shopping preferences',
    reward: 1.5,
    estimatedTime: 5,
    category: 'Shopping',
    completionPercentage: 0,
    status: 'available',
  },
  {
    id: '4',
    title: 'Health & Wellness Survey',
    description: 'Tell us about your health and wellness routines',
    reward: 2.0,
    estimatedTime: 7,
    category: 'Health',
    completionPercentage: 0,
    status: 'available',
  },
  {
    id: '5',
    title: 'Entertainment Preferences',
    description: 'Share your favorite movies, shows, and entertainment',
    reward: 1.75,
    estimatedTime: 6,
    category: 'Entertainment',
    completionPercentage: 0,
    status: 'available',
  },
];

export const mockOffers: Offer[] = [
  {
    id: 'o1',
    title: 'Download FitTracker App',
    description: 'Install and open FitTracker app to earn $5.00',
    reward: 5.0,
    category: 'App Install',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'available',
    actionRequired: 'Install app',
  },
  {
    id: 'o2',
    title: 'Sign Up for Streaming Service',
    description: 'Create an account on StreamPlus and get $10.00',
    reward: 10.0,
    category: 'Sign Up',
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'available',
    actionRequired: 'Create account',
  },
  {
    id: 'o3',
    title: 'Shop at MegaMart',
    description: 'Make a purchase at MegaMart and earn 5% cashback',
    reward: 0.0,
    category: 'Shopping',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'available',
    actionRequired: 'Make purchase',
  },
  {
    id: 'o4',
    title: 'Try Premium Coffee',
    description: 'Get a free sample of Premium Coffee and earn $2.50',
    reward: 2.5,
    category: 'Free Sample',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'available',
    actionRequired: 'Request sample',
  },
  {
    id: 'o5',
    title: 'Credit Card Application',
    description: 'Apply for our rewards credit card and get $25.00',
    reward: 25.0,
    category: 'Financial',
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    status: 'available',
    actionRequired: 'Apply online',
  },
];

export const mockGames: Game[] = [
  {
    id: 'g1',
    title: 'Daily Scratch-Off',
    description: 'Scratch off to reveal your prize',
    maxReward: 5.0,
    type: 'scratch-off',
    dailyLimit: 1,
    status: 'available',
  },
  {
    id: 'g2',
    title: 'Trivia Challenge',
    description: 'Answer trivia questions correctly to earn rewards',
    maxReward: 2.0,
    type: 'trivia',
    dailyLimit: 3,
    status: 'available',
  },
  {
    id: 'g3',
    title: 'Lucky Spin',
    description: 'Spin the wheel and win rewards',
    maxReward: 3.0,
    type: 'spin',
    dailyLimit: 2,
    status: 'available',
  },
];

export const mockRedemptionOptions: RedemptionOption[] = [
  {
    id: 'r1',
    name: 'PayPal',
    type: 'paypal',
    minAmount: 5.0,
    processingTime: '1-2 hours',
  },
  {
    id: 'r2',
    name: 'Amazon Gift Card',
    type: 'gift-card',
    minAmount: 10.0,
    processingTime: 'Instant',
  },
  {
    id: 'r3',
    name: 'Walmart Gift Card',
    type: 'gift-card',
    minAmount: 10.0,
    processingTime: 'Instant',
  },
  {
    id: 'r4',
    name: 'Best Buy Gift Card',
    type: 'gift-card',
    minAmount: 15.0,
    processingTime: 'Instant',
  },
];

export const mockDashboardStats: DashboardStats = {
  balance: 24.75,
  earnedToday: 5.5,
  pendingRewards: 12.25,
  totalEarned: 287.5,
  completedTasks: 156,
};
