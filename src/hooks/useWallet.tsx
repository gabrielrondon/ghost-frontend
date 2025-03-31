
import { useState, useEffect, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { toast } from "@/components/ui/use-toast";

interface Token {
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
  logo?: string;
}

// Mock token balances - in a real app, these would come from the IC canisters
const mockTokens: Token[] = [
  {
    name: "Internet Computer",
    symbol: "ICP",
    amount: "123.45",
    decimals: 8,
    logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png"
  },
  {
    name: "Cycles",
    symbol: "CYCLES",
    amount: "1,234,567.89",
    decimals: 0
  },
  {
    name: "WICP",
    symbol: "WICP",
    amount: "45.67",
    decimals: 8
  }
];

export function useWallet() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [balances, setBalances] = useState<Token[] | null>(null);

  // Initialize AuthClient
  useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
      
      // Check if user is already authenticated
      if (client.isAuthenticated()) {
        handleAuthenticated(client);
      }
    });
  }, []);

  const handleAuthenticated = useCallback(async (client: AuthClient) => {
    const identity = client.getIdentity();
    const principal = identity.getPrincipal().toString();
    
    setIdentity(identity);
    setPrincipal(principal);
    setConnected(true);
    
    // In a real app, fetch token balances from the IC network
    // For this demo, we'll use mock data
    setTimeout(() => {
      setBalances(mockTokens);
    }, 1000);
    
    toast({
      title: "Wallet connected",
      description: "Your Internet Computer wallet is now connected",
    });
  }, []);

  const connect = useCallback(async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: () => handleAuthenticated(authClient),
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "There was a problem connecting to your wallet",
      });
    }
  }, [authClient, handleAuthenticated]);

  const disconnect = useCallback(async () => {
    if (!authClient) return;
    
    await authClient.logout();
    setIdentity(null);
    setPrincipal(null);
    setConnected(false);
    setBalances(null);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [authClient]);

  return {
    connected,
    principal,
    identity,
    balances,
    connect,
    disconnect
  };
}
