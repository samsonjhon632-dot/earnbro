import { eq, and, gte, desc } from "drizzle-orm";
import { getDb } from "./_core/database";
import {
  users,
  wallets,
  surveys,
  surveyCompletions,
  offers,
  offerClaims,
  games,
  gamePlays,
  referrals,
  transactions,
  withdrawals,
  type User,
  type InsertUser,
  type InsertWallet,
  type InsertSurveyCompletion,
  type InsertOfferClaim,
  type InsertGamePlay,
  type InsertTransaction,
  type InsertWithdrawal,
} from "../drizzle/schema";

// ============ USER FUNCTIONS ============

// User functions are managed by SDK
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.openId, openId));
  return result[0] || null;
}

export async function upsertUser(data: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  lastSignedIn: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({
    name: data.name,
    email: data.email,
    loginMethod: data.loginMethod,
    lastSignedIn: data.lastSignedIn,
  }).where(eq(users.openId, data.openId));
  return getUserByOpenId(data.openId);
}

// ============ WALLET FUNCTIONS ============

export async function getOrCreateWallet(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(wallets).where(eq(wallets.userId, userId));
  if (existing.length > 0) return existing[0];

  await db.insert(wallets).values({
    userId,
    balance: "0.00",
    totalEarned: "0.00",
    totalWithdrawn: "0.00",
    pendingBalance: "0.00",
  });

  const result = await db.select().from(wallets).where(eq(wallets.userId, userId));
  return result[0];
}

export async function getUserWallet(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const wallet = await db.select().from(wallets).where(eq(wallets.userId, userId));
  return wallet[0] || null;
}

export async function updateWalletBalance(userId: number, amount: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const wallet = await getUserWallet(userId);
  if (!wallet) throw new Error("Wallet not found");

  const newBalance = (parseFloat(wallet.balance) + parseFloat(amount)).toFixed(2);
  const newTotalEarned = (parseFloat(wallet.totalEarned) + parseFloat(amount)).toFixed(2);

  await db
    .update(wallets)
    .set({
      balance: newBalance,
      totalEarned: newTotalEarned,
    })
    .where(eq(wallets.userId, userId));

  return getUserWallet(userId);
}

// ============ SURVEY FUNCTIONS ============

export async function getAvailableSurveys() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(surveys).where(eq(surveys.status, "active"));
}

export async function getSurveyById(surveyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(surveys).where(eq(surveys.id, surveyId));
  return result[0] || null;
}

export async function completeSurvey(userId: number, surveyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const survey = await getSurveyById(surveyId);
  if (!survey) throw new Error("Survey not found");

  // Check if already completed
  const existing = await db
    .select()
    .from(surveyCompletions)
    .where(and(eq(surveyCompletions.userId, userId), eq(surveyCompletions.surveyId, surveyId)));

  if (existing.length > 0) throw new Error("Survey already completed");

  // Create completion record
  const completion = await db.insert(surveyCompletions).values({
    userId,
    surveyId,
    reward: survey.reward,
    status: "approved",
  });

  // Add transaction
  await db.insert(transactions).values({
    userId,
    type: "survey",
    amount: survey.reward,
    description: `Completed survey: ${survey.title}`,
    status: "completed",
    relatedId: surveyId,
  });

  // Update wallet
  await updateWalletBalance(userId, survey.reward.toString());

  return completion;
}

export async function getUserSurveyCompletions(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(surveyCompletions)
    .where(eq(surveyCompletions.userId, userId))
    .orderBy(desc(surveyCompletions.completedAt));
}

// ============ OFFER FUNCTIONS ============

export async function getAvailableOffers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(offers).where(eq(offers.status, "active"));
}

export async function getOfferById(offerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(offers).where(eq(offers.id, offerId));
  return result[0] || null;
}

export async function claimOffer(userId: number, offerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const offer = await getOfferById(offerId);
  if (!offer) throw new Error("Offer not found");

  // Check if already claimed
  const existing = await db
    .select()
    .from(offerClaims)
    .where(and(eq(offerClaims.userId, userId), eq(offerClaims.offerId, offerId)));

  if (existing.length > 0) throw new Error("Offer already claimed");

  // Create claim record
  const claim = await db.insert(offerClaims).values({
    userId,
    offerId,
    reward: offer.reward,
    status: "approved",
  });

  // Add transaction
  await db.insert(transactions).values({
    userId,
    type: "offer",
    amount: offer.reward,
    description: `Claimed offer: ${offer.title}`,
    status: "completed",
    relatedId: offerId,
  });

  // Update wallet
  await updateWalletBalance(userId, offer.reward.toString());

  return claim;
}

export async function getUserOfferClaims(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(offerClaims)
    .where(eq(offerClaims.userId, userId))
    .orderBy(desc(offerClaims.claimedAt));
}

// ============ GAME FUNCTIONS ============

export async function getAvailableGames() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(games).where(eq(games.status, "active"));
}

export async function getGameById(gameId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(games).where(eq(games.id, gameId));
  return result[0] || null;
}

export async function playGame(userId: number, gameId: number, won: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const game = await getGameById(gameId);
  if (!game) throw new Error("Game not found");

  // Check daily limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPlays = await db
    .select()
    .from(gamePlays)
    .where(
      and(
        eq(gamePlays.userId, userId),
        eq(gamePlays.gameId, gameId),
        gte(gamePlays.playedAt, today)
      )
    );

  if (todayPlays.length >= game.dailyLimit) {
    throw new Error("Daily limit reached for this game");
  }

  const reward = won ? game.reward : "0.00";

  // Create play record
  const play = await db.insert(gamePlays).values({
    userId,
    gameId,
    won,
    reward,
  });

  if (won) {
    // Add transaction
    await db.insert(transactions).values({
      userId,
      type: "game",
      amount: reward,
      description: `Won game: ${game.title}`,
      status: "completed",
      relatedId: gameId,
    });

    // Update wallet
    await updateWalletBalance(userId, reward.toString());
  }

  return play;
}

export async function getUserGamePlays(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(gamePlays)
    .where(eq(gamePlays.userId, userId))
    .orderBy(desc(gamePlays.playedAt));
}

// ============ REFERRAL FUNCTIONS ============

export async function createReferral(referrerId: number, referredUserId: number, referralCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(referrals).values({
    referrerId,
    referredUserId,
    referralCode,
    status: "pending",
    bonus: "5.00",
  });

  return result;
}

export async function activateReferral(referralId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(referrals).set({ status: "active" }).where(eq(referrals.id, referralId));
}

export async function awardReferralBonus(referralId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const referral = await db.select().from(referrals).where(eq(referrals.id, referralId));
  if (!referral[0]) throw new Error("Referral not found");

  const ref = referral[0];
  if (ref.bonusAwarded) throw new Error("Bonus already awarded");

  // Award bonus to referrer
  await updateWalletBalance(ref.referrerId, ref.bonus.toString());

  // Add transaction
  await db.insert(transactions).values({
    userId: ref.referrerId,
    type: "referral",
    amount: ref.bonus,
    description: `Referral bonus for user ${ref.referredUserId}`,
    status: "completed",
    relatedId: referralId,
  });

  // Mark bonus as awarded
  await db.update(referrals).set({ bonusAwarded: true }).where(eq(referrals.id, referralId));
}

export async function getUserReferrals(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(referrals).where(eq(referrals.referrerId, userId));
}

// ============ TRANSACTION FUNCTIONS ============

export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));
}

// ============ WITHDRAWAL FUNCTIONS ============

export async function requestWithdrawal(
  userId: number,
  amount: string,
  method: "bitcoin" | "ethereum" | "usdc" | "litecoin" | "paypal" | "giftcard" | "bank_transfer",
  paymentDetails: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const wallet = await getUserWallet(userId);
  if (!wallet) throw new Error("Wallet not found");

  if (parseFloat(wallet.balance) < parseFloat(amount)) {
    throw new Error("Insufficient balance");
  }

  if (parseFloat(amount) < 5) {
    throw new Error("Minimum withdrawal is $5");
  }

  // Create withdrawal request
  const result = await db.insert(withdrawals).values({
    userId,
    amount,
    method,
    paymentDetails,
    status: "pending",
  });

  // Deduct from balance
  const newBalance = (parseFloat(wallet.balance) - parseFloat(amount)).toFixed(2);
  await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.userId, userId));

  // Add transaction
  await db.insert(transactions).values({
    userId,
    type: "withdrawal",
    amount: `-${amount}`,
    description: `Withdrawal via ${method}`,
    status: "pending",
  });

  return result;
}

export async function getUserWithdrawals(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.userId, userId))
    .orderBy(desc(withdrawals.requestedAt));
}

export async function completeWithdrawal(withdrawalId: number, transactionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(withdrawals)
    .set({
      status: "completed",
      transactionId,
      completedAt: new Date(),
    })
    .where(eq(withdrawals.id, withdrawalId));
}

export async function getWithdrawalById(withdrawalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.id, withdrawalId));
  
  return result[0] || null;
}

export async function updateWithdrawalStatus(
  withdrawalId: number,
  updates: {
    status?: string;
    transactionId?: string;
    failureReason?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = {};
  if (updates.status) updateData.status = updates.status;
  if (updates.transactionId) updateData.transactionId = updates.transactionId;
  if (updates.failureReason) updateData.failureReason = updates.failureReason;
  if (updates.status === 'completed') updateData.completedAt = new Date();

  await db
    .update(withdrawals)
    .set(updateData)
    .where(eq(withdrawals.id, withdrawalId));
}

export async function failWithdrawal(withdrawalId: number, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const withdrawal = await db.select().from(withdrawals).where(eq(withdrawals.id, withdrawalId));
  if (!withdrawal[0]) throw new Error("Withdrawal not found");

  const w = withdrawal[0];

  // Refund balance
  const wallet = await getUserWallet(w.userId);
  if (wallet) {
    const newBalance = (parseFloat(wallet.balance) + parseFloat(w.amount)).toFixed(2);
    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.userId, w.userId));
  }

  await db
    .update(withdrawals)
    .set({
      status: "failed",
      failureReason: reason,
    })
    .where(eq(withdrawals.id, withdrawalId));
}
