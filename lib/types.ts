/**
 * Shared types for InboxRewards app
 */

export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  totalEarned: number;
  createdAt: Date;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  reward: number;
  estimatedTime: number; // in minutes
  category: string;
  completionPercentage: number;
  status: 'available' | 'completed' | 'pending';
  expiresAt?: Date;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  imageUrl?: string;
  expiresAt: Date;
  status: 'available' | 'claimed' | 'completed';
  actionRequired: string; // e.g., "Install app", "Make purchase"
}

export interface Game {
  id: string;
  title: string;
  description: string;
  maxReward: number;
  type: 'scratch-off' | 'trivia' | 'spin';
  dailyLimit: number;
  status: 'available' | 'played';
}

export interface Reward {
  id: string;
  userId: string;
  amount: number;
  source: 'survey' | 'offer' | 'game';
  sourceId: string;
  status: 'pending' | 'approved' | 'paid';
  createdAt: Date;
  approvedAt?: Date;
  paidAt?: Date;
}

export interface RedemptionOption {
  id: string;
  name: string;
  type: 'paypal' | 'gift-card';
  minAmount: number;
  processingTime: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'redemption' | 'bonus';
  status: 'pending' | 'completed' | 'failed';
  redemptionOption?: RedemptionOption;
  createdAt: Date;
  completedAt?: Date;
}

export interface DashboardStats {
  balance: number;
  earnedToday: number;
  pendingRewards: number;
  totalEarned: number;
  completedTasks: number;
}
