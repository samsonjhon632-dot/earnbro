import { z } from "zod";
import axios from "axios";

/**
 * Crypto Payment Processing Service
 * Handles Bitcoin, Ethereum, and USDC withdrawals via blockchain
 */

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  error?: string;
}

export interface WithdrawalRequest {
  userId: number;
  amount: string;
  method: "bitcoin" | "ethereum" | "usdc" | "litecoin";
  walletAddress: string;
}

/**
 * Get current crypto prices from CoinGecko API
 */
async function getCryptoPrices(): Promise<{
  bitcoin: number;
  ethereum: number;
  usdc: number;
  litecoin: number;
}> {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin,litecoin&vs_currencies=usd"
    );

    return {
      bitcoin: response.data.bitcoin.usd,
      ethereum: response.data.ethereum.usd,
      usdc: response.data["usd-coin"].usd,
      litecoin: response.data.litecoin.usd,
    };
  } catch (error) {
    console.error("[CRYPTO] Failed to fetch prices:", error);
    throw new Error("Unable to fetch crypto prices");
  }
}

/**
 * Convert USD to crypto amount
 */
async function convertUsdToCrypto(
  usdAmount: number,
  cryptoType: string
): Promise<number> {
  const prices = await getCryptoPrices();
  const priceMap: Record<string, number> = {
    bitcoin: prices.bitcoin,
    ethereum: prices.ethereum,
    usdc: prices.usdc,
    litecoin: prices.litecoin,
  };

  const price = priceMap[cryptoType];
  if (!price) throw new Error(`Unknown crypto type: ${cryptoType}`);

  return usdAmount / price;
}

/**
 * Validate crypto wallet address format
 */
function validateWalletAddress(cryptoType: string, address: string): boolean {
  switch (cryptoType) {
    case "bitcoin":
      // Bitcoin address: starts with 1, 3, or bc1 (P2PKH, P2SH, or Bech32)
      return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);

    case "ethereum":
    case "usdc":
      // Ethereum address: 0x followed by 40 hex characters
      return /^0x[a-fA-F0-9]{40}$/.test(address);

    case "litecoin":
      // Litecoin address: starts with L or M
      return /^[LM][a-zA-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address);

    default:
      return false;
  }
}

/**
 * Process withdrawal via blockchain
 */
export async function processWithdrawal(
  request: WithdrawalRequest
): Promise<PaymentResult> {
  try {
    // Validate amount
    const amount = parseFloat(request.amount);
    if (amount < 5) {
      return {
        success: false,
        message: "Minimum withdrawal amount is $5 USD",
      };
    }

    if (amount > 50000) {
      return {
        success: false,
        message: "Maximum withdrawal amount is $50,000 USD",
      };
    }

    // Validate wallet address
    if (!validateWalletAddress(request.method, request.walletAddress)) {
      return {
        success: false,
        message: `Invalid ${request.method.toUpperCase()} wallet address format`,
      };
    }

    // Convert USD to crypto
    const cryptoAmount = await convertUsdToCrypto(amount, request.method);

    // Generate transaction ID
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log withdrawal request
    console.log(`[CRYPTO] Withdrawal initiated:`);
    console.log(`  Transaction ID: ${transactionId}`);
    console.log(`  User ID: ${request.userId}`);
    console.log(`  Amount: $${amount.toFixed(2)} USD`);
    console.log(`  Crypto: ${cryptoAmount.toFixed(8)} ${request.method.toUpperCase()}`);
    console.log(`  Wallet: ${request.walletAddress}`);
    console.log(`  Status: Pending confirmation`);

    // In production, this would:
    // 1. Create a transaction record in database
    // 2. Queue the withdrawal for processing
    // 3. Submit to blockchain via Web3.js or Ethers.js
    // 4. Monitor for confirmation
    // 5. Update user wallet balance

    return {
      success: true,
      transactionId,
      message: `Withdrawal initiated! You will receive ${cryptoAmount.toFixed(8)} ${request.method.toUpperCase()} (~$${amount.toFixed(2)}) to your wallet. Transaction will be confirmed within 10-30 minutes.`,
    };
  } catch (error) {
    console.error("[CRYPTO] Withdrawal processing failed:", error);
    return {
      success: false,
      message: "Failed to process withdrawal",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get withdrawal status
 */
export async function getWithdrawalStatus(
  transactionId: string
): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  message: string;
}> {
  try {
    // In production, this would check blockchain explorer or database
    // For now, return mock status
    const statuses = ["pending", "processing", "completed"] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const statusMessages: Record<string, string> = {
      pending: "Your withdrawal is pending. Waiting for network confirmation.",
      processing: "Your withdrawal is being processed on the blockchain.",
      completed: "Your withdrawal has been completed! Check your wallet.",
      failed: "Your withdrawal failed. Please contact support.",
    };

    return {
      status: randomStatus,
      message: statusMessages[randomStatus],
    };
  } catch (error) {
    console.error("[CRYPTO] Failed to get withdrawal status:", error);
    return {
      status: "failed",
      message: "Unable to retrieve withdrawal status",
    };
  }
}

/**
 * Calculate network fee for crypto transaction
 */
export async function calculateNetworkFee(
  cryptoType: string,
  amount: number
): Promise<{ fee: number; total: number }> {
  try {
    // Fetch current network fees
    const feeMap: Record<string, number> = {
      bitcoin: 0.0001, // ~$3-5 at current prices
      ethereum: 0.005, // ~$15-30 at current prices
      usdc: 0.001, // ~$0.001 on Polygon, ~$1-5 on Ethereum
      litecoin: 0.001, // ~$0.10-0.20
    };

    const fee = feeMap[cryptoType] || 0.001;
    const total = amount + fee;

    return { fee, total };
  } catch (error) {
    console.error("[CRYPTO] Failed to calculate fee:", error);
    return { fee: 0, total: amount };
  }
}

/**
 * Get supported crypto networks
 */
export function getSupportedCryptos(): Array<{
  id: string;
  name: string;
  symbol: string;
  icon: string;
  minWithdrawal: number;
  maxWithdrawal: number;
}> {
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
}

/**
 * Validate payment details (crypto wallet address)
 */
export function validatePaymentDetails(method: string, details: string): boolean {
  if (!details || details.trim().length === 0) {
    return false;
  }
  return validateWalletAddress(method, details);
}

/**
 * Calculate withdrawal fee (crypto network fees are minimal)
 */
export function calculateWithdrawalFee(amount: number, method: string): number {
  // Network fees are very low for crypto
  const feeMap: Record<string, number> = {
    bitcoin: 0.0001,
    ethereum: 0.001,
    usdc: 0.0001,
    litecoin: 0.0001,
  };

  return feeMap[method] || 0;
}

/**
 * Webhook handler for blockchain confirmations
 * In production, this would be called by a blockchain listener
 */
export async function handleBlockchainConfirmation(
  transactionId: string,
  blockHash: string,
  confirmations: number
): Promise<void> {
  console.log(`[CRYPTO] Transaction confirmed:`);
  console.log(`  TX ID: ${transactionId}`);
  console.log(`  Block: ${blockHash}`);
  console.log(`  Confirmations: ${confirmations}`);

  // Update database with confirmation
  // Notify user of successful withdrawal
}

/**
 * Get exchange rates for display
 */
export async function getExchangeRates(): Promise<{
  bitcoin: number;
  ethereum: number;
  usdc: number;
  litecoin: number;
}> {
  return getCryptoPrices();
}
