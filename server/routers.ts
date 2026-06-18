import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  health: publicProcedure.query(() => ({ status: "ok" })),

  auth: router({
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      return { success: true };
    }),
  }),

  // Wallet routes
  wallet: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const wallet = await db.getOrCreateWallet(ctx.user.id);
      return {
        balance: wallet?.balance || "0.00",
        totalEarned: wallet?.totalEarned || "0.00",
        totalWithdrawn: wallet?.totalWithdrawn || "0.00",
        pendingBalance: wallet?.pendingBalance || "0.00",
      };
    }),
  }),

  // Survey routes
  surveys: router({
    list: publicProcedure.query(async () => {
      return db.getAvailableSurveys();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getSurveyById(input.id);
    }),

    complete: protectedProcedure
      .input(z.object({ surveyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.completeSurvey(ctx.user.id, input.surveyId);
      }),

    getCompleted: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserSurveyCompletions(ctx.user.id);
    }),
  }),

  // Offer routes
  offers: router({
    list: publicProcedure.query(async () => {
      return db.getAvailableOffers();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getOfferById(input.id);
    }),

    claim: protectedProcedure
      .input(z.object({ offerId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.claimOffer(ctx.user.id, input.offerId);
      }),

    getClaimed: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserOfferClaims(ctx.user.id);
    }),
  }),

  // Game routes
  games: router({
    list: publicProcedure.query(async () => {
      return db.getAvailableGames();
    }),

    play: protectedProcedure
      .input(z.object({ gameId: z.number(), won: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        return db.playGame(ctx.user.id, input.gameId, input.won);
      }),

    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserGamePlays(ctx.user.id);
    }),
  }),

  // Referral routes
  referrals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserReferrals(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({ referredUserId: z.number(), referralCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return db.createReferral(ctx.user.id, input.referredUserId, input.referralCode);
      }),
  }),

  // Transaction routes
  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserTransactions(ctx.user.id);
    }),
  }),

  // Withdrawal routes
  withdrawals: router({
    request: protectedProcedure
      .input(
        z.object({
          amount: z.string(),
          method: z.enum(["paypal", "giftcard", "bank_transfer"]),
          paymentDetails: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.requestWithdrawal(ctx.user.id, input.amount, input.method, input.paymentDetails);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserWithdrawals(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
