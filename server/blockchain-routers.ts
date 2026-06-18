import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  broadcastCryptoTransaction,
  getTransactionStatus,
  validateWalletAddress,
  getExplorerUrl,
  getEthereumGasPrice,
  estimateTransactionFee,
} from './_core/blockchain';
import { requestWithdrawal, getWithdrawalById, updateWithdrawalStatus } from './db';

export const blockchainRouter = router({
  // Validate wallet address
  validateAddress: publicProcedure
    .input(z.object({
      method: z.enum(['bitcoin', 'ethereum', 'usdc', 'litecoin']),
      address: z.string(),
    }))
    .query(({ input }) => {
      const isValid = validateWalletAddress(input.method, input.address);
      return {
        valid: isValid,
        address: input.address,
        method: input.method,
      };
    }),

  // Get blockchain explorer URL
  getExplorerUrl: publicProcedure
    .input(z.object({
      method: z.enum(['bitcoin', 'ethereum', 'usdc', 'litecoin']),
      transactionHash: z.string(),
    }))
    .query(({ input }) => {
      return {
        explorerUrl: getExplorerUrl(input.method, input.transactionHash),
        transactionHash: input.transactionHash,
      };
    }),

  // Get transaction status from blockchain
  getTransactionStatus: publicProcedure
    .input(z.object({
      method: z.enum(['bitcoin', 'ethereum', 'usdc', 'litecoin']),
      transactionHash: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const status = await getTransactionStatus(input.method, input.transactionHash);
        return {
          ...status,
          method: input.method,
        };
      } catch (error) {
        return {
          status: 'pending' as const,
          confirmations: 0,
          explorerUrl: getExplorerUrl(input.method, input.transactionHash),
          method: input.method,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  // Get Ethereum gas price
  getGasPrice: publicProcedure
    .query(async () => {
      try {
        const gasPrice = await getEthereumGasPrice();
        return {
          gasPrice,
          currency: 'GWEI',
        };
      } catch (error) {
        return {
          gasPrice: '0',
          currency: 'GWEI',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  // Estimate transaction fee
  estimateFee: publicProcedure
    .input(z.object({
      method: z.enum(['ethereum', 'usdc']),
      amount: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const fee = await estimateTransactionFee(input.method, input.amount);
        return {
          ...fee,
          method: input.method,
        };
      } catch (error) {
        return {
          estimatedFeeUSD: '0',
          estimatedFeeETH: '0',
          gasPrice: '0',
          method: input.method,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),

  // Broadcast crypto transaction (protected - requires authentication)
  broadcastTransaction: protectedProcedure
    .input(z.object({
      method: z.enum(['bitcoin', 'ethereum', 'usdc', 'litecoin']),
      amount: z.string(),
      recipientAddress: z.string(),
      withdrawalId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Validate recipient address
        if (!validateWalletAddress(input.method, input.recipientAddress)) {
          throw new Error(`Invalid ${input.method} address`);
        }

        // Get sender's private key from environment (in production, use secure key management)
        const senderPrivateKey = process.env[`${input.method.toUpperCase()}_PRIVATE_KEY`];
        const senderAddress = process.env[`${input.method.toUpperCase()}_SENDER_ADDRESS`];

        if (!senderPrivateKey || !senderAddress) {
          throw new Error(`${input.method} credentials not configured`);
        }

        // Broadcast transaction
        const result = await broadcastCryptoTransaction(
          input.method,
          input.amount,
          input.recipientAddress,
          senderPrivateKey,
          senderAddress
        );

        // Update withdrawal record with transaction hash
        await updateWithdrawalStatus(input.withdrawalId, {
          status: result.status === 'confirmed' ? 'completed' : 'processing',
          transactionId: result.transactionHash,
        });

        return {
          success: true,
          ...result,
        };
      } catch (error) {
        // Update withdrawal with failure
        await updateWithdrawalStatus(input.withdrawalId, {
          status: 'failed',
          failureReason: error instanceof Error ? error.message : 'Unknown error',
        });

        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to broadcast transaction',
        };
      }
    }),

  // Get withdrawal with transaction details
  getWithdrawalDetails: protectedProcedure
    .input(z.object({
      withdrawalId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const withdrawal = await getWithdrawalById(input.withdrawalId);
        if (!withdrawal) {
          throw new Error('Withdrawal not found');
        }

        let explorerUrl = '';
        if (withdrawal.transactionId) {
          explorerUrl = getExplorerUrl(
            withdrawal.method as any,
            withdrawal.transactionId
          );
        }

        return {
          ...withdrawal,
          explorerUrl,
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to get withdrawal');
      }
    }),
});

export default blockchainRouter;
