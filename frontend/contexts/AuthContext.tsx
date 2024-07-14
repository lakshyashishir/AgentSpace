import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { getProfile, updateProfile, createProfile } from '@/services/api';
import { AptosClient } from 'aptos';

interface User {
  address: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  balance: string;
  loginUser: () => Promise<void>;
  logoutUser: () => void;
  updateUser: (data: { username: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEFAULT_NODE_URL = "https://fullnode.testnet.aptoslabs.com";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { account, connected, network } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState('0');
  const [client, setClient] = useState<AptosClient | null>(null);

  useEffect(() => {
    const nodeUrl =  DEFAULT_NODE_URL;
    setClient(new AptosClient(nodeUrl));
  }, [network?.nodeUrl]);

  useEffect(() => {
      console.log("Checking wallet connection status...");
      console.log("Connected:", connected);
      console.log("Account address:", account?.address);
      if (connected && account?.address) {
        loginUser();
      } else {
        logoutUser();
      }
  }, [connected, account?.address]);

  const fetchBalance = async (address: string) => {
    if (!client) return;
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

  const loginUser = async () => {
    console.log("Logging in user...");
    if (account?.address) {
      try {
        console.log("Fetching user profile...");
        const profile = await getProfile(account.address);
        if (!profile) {
          console.log("User profile not found. Creating new profile...");
          const newProfile = await createProfile({ address: account.address, username: account.address });
          setUser({ address: account.address, ...newProfile });
          setIsAuthenticated(true);
          fetchBalance(account.address);
          return;
        }
        setUser({ address: account.address, ...profile });
        setIsAuthenticated(true);
        fetchBalance(account.address);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser({ address: account.address });
        setIsAuthenticated(true);
        fetchBalance(account.address);
      }
    }
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    setBalance('0');
  };

  const updateUser = async (data: { username: string }) => {
    if (user?.address) {
      try {
        const updatedProfile = await updateProfile({ address: user.address, ...data });
        setUser({ ...user, ...updatedProfile });
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        balance,
        loginUser,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
