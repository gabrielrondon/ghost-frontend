
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

// Define the canister IDs for the tokens we want to check
const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai"; // ICP Ledger
const CYCLES_MINTING_CANISTER_ID = "rkp4c-7iaaa-aaaaa-aaaca-cai"; // Cycles Minting Canister
const WICP_CANISTER_ID = "utozz-siaaa-aaaam-qaaxq-cai"; // WICP token

export function useWallet() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [agent, setAgent] = useState<HttpAgent | null>(null);
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

  // Fetch balances from the Internet Computer
  const fetchBalances = useCallback(async (userPrincipal: Principal) => {
    if (!agent) return [];
    
    setBalances(null); // Set to null to show loading state
    
    try {
      // In a real implementation, we would call the token canisters to get balances
      // This is a simplified example that simulates network requests
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration purposes, we'll return data based on the principal
      // In a real app, you would call the canister actor methods to get actual balances
      const principalStr = userPrincipal.toString();
      const lastChar = principalStr.charCodeAt(principalStr.length - 1) % 10;
      
      const tokens: Token[] = [
        {
          name: "Internet Computer",
          symbol: "ICP",
          amount: `${(lastChar * 12.34).toFixed(2)}`,
          decimals: 8,
          logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png"
        },
        {
          name: "Cycles",
          symbol: "CYCLES",
          amount: `${lastChar * 1000000}`,
          decimals: 0
        }
      ];
      
      // Add WICP for some principals
      if (lastChar > 5) {
        tokens.push({
          name: "Wrapped ICP",
          symbol: "WICP",
          amount: `${(lastChar * 5.67).toFixed(2)}`,
          decimals: 8
        });
      }
      
      return tokens;
    } catch (error) {
      console.error("Error fetching balances:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch balances",
        description: "Could not retrieve your token balances"
      });
      return [];
    }
  }, [agent]);

  const handleAuthenticated = useCallback(async (client: AuthClient) => {
    const identity = client.getIdentity();
    const principal = identity.getPrincipal();
    const principalStr = principal.toString();
    
    // Create an agent using the identity
    const agent = new HttpAgent({ 
      identity, 
      host: "https://ic0.app" // Mainnet
    });
    
    setIdentity(identity);
    setPrincipal(principalStr);
    setAgent(agent);
    setConnected(true);
    
    // Fetch the token balances
    const tokenBalances = await fetchBalances(principal);
    setBalances(tokenBalances);
    
    toast({
      title: "Wallet connected",
      description: "Your Internet Computer wallet is now connected",
    });
  }, [fetchBalances]);

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
    setAgent(null);
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
