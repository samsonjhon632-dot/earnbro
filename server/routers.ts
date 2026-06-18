import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import * as db from "./db";
import { blockchainRouter } from "./blockchain-routers";

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

  // Withdrawal routes - CRYPTO
  withdrawals: router({
    request: protectedProcedure
      .input(
        z.object({
          amount: z.string(),
          method: z.enum(["bitcoin", "ethereum", "usdc", "litecoin"]),
          walletAddress: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.requestWithdrawal(ctx.user.id, input.amount, input.method, input.walletAddress);
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserWithdrawals(ctx.user.id);
    }),

    getSupportedCryptos: publicProcedure.query(async () => {
      return [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          icon: "₿",
          minWithdrawal: 5,
          maxWithdrawal: 50000,
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          icon: "Ξ",
          minWithdrawal: 5,
          maxWithdrawal: 50000,
        },
        {
          id: "usdc",
          name: "USD Coin",
          symbol: "USDC",
          icon: "$",
          minWithdrawal: 5,
          maxWithdrawal: 50000,
        },
        {
          id: "litecoin",
          name: "Litecoin",
          symbol: "LTC",
          icon: "Ł",
          minWithdrawal: 5,
          maxWithdrawal: 50000,
        },
      ];
    }),

    getExchangeRates: publicProcedure.query(async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin,litecoin&vs_currencies=usd"
        );
        const data = await response.json();
        return {
          bitcoin: data.bitcoin.usd,
          ethereum: data.ethereum.usd,
          usdc: data["usd-coin"].usd,
          litecoin: data.litecoin.usd,
        };
      } catch (error) {
        return {
          bitcoin: 45000,
          ethereum: 2500,
          usdc: 1,
          litecoin: 100,
        };
      }
    }),
    }),

  // Blockchain routes
  blockchain: blockchainRouter,
});
export type AppRouter = typeof appRouter;
