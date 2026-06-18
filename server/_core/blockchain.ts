import { Web3 } from 'web3';

// Blockchain network configurations
const NETWORKS = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    explorer: 'https://blockchair.com/bitcoin/transaction',
    rpcUrl: 'https://bitcoin-mainnet.infura.io', // Would need Infura key
    chainId: 0,
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io/tx',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
    chainId: 1,
  },
  usdc: {
    name: 'Ethereum (USDC)',
    symbol: 'USDC',
    explorer: 'https://etherscan.io/tx',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
    chainId: 1,
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC contract on Ethereum
  },
  litecoin: {
    name: 'Litecoin',
    symbol: 'LTC',
    explorer: 'https://blockchair.com/litecoin/transaction',
    rpcUrl: 'https://litecoin-mainnet.infura.io', // Would need Infura key
    chainId: 0,
  },
};

// Initialize Web3 instances for each network
const web3Instances: Record<string, Web3> = {
  ethereum: new Web3(NETWORKS.ethereum.rpcUrl),
  usdc: new Web3(NETWORKS.usdc.rpcUrl),
};

export interface TransactionResult {
  transactionHash: string;
  explorerUrl: string;
  status: 'pending' | 'confirmed' | 'failed';
  network: string;
  amount: string;
  recipientAddress: string;
  timestamp: Date;
}

/**
 * Broadcast a crypto transaction to the blockchain
 */
export async function broadcastCryptoTransaction(
  method: 'bitcoin' | 'ethereum' | 'usdc' | 'litecoin',
  amount: string,
  recipientAddress: string,
  senderPrivateKey: string,
  senderAddress: string
): Promise<TransactionResult> {
  try {
    const network = NETWORKS[method];

    if (method === 'bitcoin' || method === 'litecoin') {
      // Bitcoin and Litecoin would require Bitcoin.js or similar library
      // For now, return a mock transaction
      return {
        transactionHash: `mock_${method}_${Date.now()}`,
        explorerUrl: `${network.explorer}/mock_${method}_${Date.now()}`,
        status: 'pending',
        network: network.name,
        amount,
        recipientAddress,
        timestamp: new Date(),
      };
    }

    if (method === 'ethereum' || method === 'usdc') {
      const web3 = web3Instances[method];
      if (!web3) throw new Error(`Web3 instance not initialized for ${method}`);

      // Get account from private key
      const account = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
      web3.eth.accounts.wallet.add(account);

      // Prepare transaction
      const tx: any = {
        from: senderAddress,
        to: recipientAddress,
        value: web3.utils.toWei(amount, 'ether'),
        gas: 21000,
        gasPrice: await web3.eth.getGasPrice(),
      };

      // For USDC, use contract transfer instead
      if (method === 'usdc') {
        const usdcAbi = [
          {
            constant: false,
            inputs: [
              { name: '_to', type: 'address' },
              { name: '_value', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ name: '', type: 'bool' }],
            type: 'function',
          },
        ];

        const contract = new web3.eth.Contract(usdcAbi, NETWORKS.usdc.contractAddress);
        const usdcAmount = web3.utils.toWei(amount, 'mwei'); // USDC has 6 decimals

        tx.data = contract.methods.transfer(recipientAddress, usdcAmount).encodeABI();
        tx.to = NETWORKS.usdc.contractAddress;
        delete tx.value;
      }

      // Sign and send transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);
      const rawTx = typeof signedTx.rawTransaction === 'string' 
        ? signedTx.rawTransaction 
        : '0x' + Buffer.from(signedTx.rawTransaction as any).toString('hex');
      const receipt = await web3.eth.sendSignedTransaction(rawTx);

      const txHash = typeof receipt.transactionHash === 'string' 
        ? receipt.transactionHash 
        : '0x' + Buffer.from(receipt.transactionHash as any).toString('hex');
      
      return {
        transactionHash: txHash,
        explorerUrl: `${network.explorer}/${txHash}`,
        status: receipt.status ? 'confirmed' : 'failed',
        network: network.name,
        amount,
        recipientAddress,
        timestamp: new Date(),
      };
    }

    throw new Error(`Unsupported method: ${method}`);
  } catch (error) {
    console.error('Blockchain transaction error:', error);
    throw new Error(`Failed to broadcast transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get transaction status from blockchain explorer
 */
export async function getTransactionStatus(
  method: 'bitcoin' | 'ethereum' | 'usdc' | 'litecoin',
  transactionHash: string
): Promise<{
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  explorerUrl: string;
}> {
  try {
    const network = NETWORKS[method];

    if (method === 'ethereum' || method === 'usdc') {
      const web3 = web3Instances[method];
      if (!web3) throw new Error(`Web3 instance not initialized for ${method}`);

      const receipt = await web3.eth.getTransactionReceipt(transactionHash);

      if (!receipt) {
        return {
          status: 'pending',
          confirmations: 0,
          explorerUrl: `${network.explorer}/${transactionHash}`,
        };
      }

      const currentBlock = await web3.eth.getBlockNumber();
      const confirmations = Number(currentBlock) - Number(receipt.blockNumber);

      return {
        status: receipt.status ? 'confirmed' : 'failed',
        confirmations,
        explorerUrl: `${network.explorer}/${transactionHash}`,
      };
    }

    // For Bitcoin and Litecoin, return mock status
    return {
      status: 'pending',
      confirmations: 0,
      explorerUrl: `${network.explorer}/${transactionHash}`,
    };
  } catch (error) {
    console.error('Get transaction status error:', error);
    throw new Error(`Failed to get transaction status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate wallet address for a specific blockchain
 */
export function validateWalletAddress(method: 'bitcoin' | 'ethereum' | 'usdc' | 'litecoin', address: string): boolean {
  try {
    if (method === 'ethereum' || method === 'usdc') {
      return web3Instances.ethereum.utils.isAddress(address);
    }

    if (method === 'bitcoin') {
      // Bitcoin address validation (P2PKH, P2SH, Bech32)
      const patterns = [
        /^(1|3)[a-zA-HJ-NP-Z0-9]{25,34}$/, // P2PKH and P2SH
        /^bc1[a-z0-9]{39,59}$/, // Bech32
      ];
      return patterns.some(p => p.test(address));
    }

    if (method === 'litecoin') {
      // Litecoin address validation
      const patterns = [
        /^[LM][a-zA-km-zA-HJ-NP-Z1-9]{26,33}$/, // P2PKH and P2SH
        /^ltc1[a-z0-9]{39,59}$/, // Bech32
      ];
      return patterns.some(p => p.test(address));
    }

    return false;
  } catch (error) {
    console.error('Wallet validation error:', error);
    return false;
  }
}

/**
 * Get blockchain explorer URL for a transaction
 */
export function getExplorerUrl(
  method: 'bitcoin' | 'ethereum' | 'usdc' | 'litecoin',
  transactionHash: string
): string {
  const network = NETWORKS[method];
  return `${network.explorer}/${transactionHash}`;
}

/**
 * Get current gas price for Ethereum
 */
export async function getEthereumGasPrice(): Promise<string> {
  try {
    const web3 = web3Instances.ethereum;
    const gasPrice = await web3.eth.getGasPrice();
    return web3.utils.fromWei(gasPrice, 'gwei');
  } catch (error) {
    console.error('Get gas price error:', error);
    throw new Error('Failed to get gas price');
  }
}

/**
 * Estimate transaction fee
 */
export async function estimateTransactionFee(
  method: 'ethereum' | 'usdc',
  amount: string
): Promise<{
  estimatedFeeUSD: string;
  estimatedFeeETH: string;
  gasPrice: string;
}> {
  try {
    const web3 = web3Instances[method];
    if (!web3) throw new Error(`Web3 instance not initialized for ${method}`);

    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceGwei = web3.utils.fromWei(gasPrice, 'gwei');
    const estimatedGas = method === 'usdc' ? 65000 : 21000; // USDC transfer uses more gas

    const feeWei = BigInt(gasPrice) * BigInt(estimatedGas);
    const feeEth = web3.utils.fromWei(feeWei, 'ether');

    // Assume 1 ETH = $2000 for estimation
    const feeUSD = (parseFloat(feeEth) * 2000).toFixed(2);

    return {
      estimatedFeeUSD: feeUSD,
      estimatedFeeETH: feeEth,
      gasPrice: gasPriceGwei,
    };
  } catch (error) {
    console.error('Estimate fee error:', error);
    throw new Error('Failed to estimate transaction fee');
  }
}

export default {
  broadcastCryptoTransaction,
  getTransactionStatus,
  validateWalletAddress,
  getExplorerUrl,
  getEthereumGasPrice,
  estimateTransactionFee,
  NETWORKS,
};
