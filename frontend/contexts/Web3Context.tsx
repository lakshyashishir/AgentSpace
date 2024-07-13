// Web3Context.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AptosClient, AptosAccount, FaucetClient } from 'aptos';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface Web3ContextType {
  account: AptosAccount | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  signAndSubmitTransaction: (payload: any) => Promise<any>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<AptosAccount | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { connect, disconnect, signAndSubmitTransaction, account: walletAccount, network } = useWallet();

  const client = new AptosClient(network.nodeUrl);

  useEffect(() => {
    if (walletAccount) {
      setIsConnected(true);
      setAccount(walletAccount as unknown as AptosAccount);
      fetchBalance(walletAccount.address);
    } else {
      setIsConnected(false);
      setAccount(null);
      setBalance('0');
    }
  }, [walletAccount]);

  const fetchBalance = async (address: string) => {
    try {
      const resources = await client.getAccountResources(address);
      const accountResource = resources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
      if (accountResource) {
        const balance = (accountResource.data as { coin: { value: string } }).coin.value;
        setBalance(balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const value = {
    account,
    balance,
    connectWallet,
    disconnectWallet,
    isConnected,
    signAndSubmitTransaction,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};