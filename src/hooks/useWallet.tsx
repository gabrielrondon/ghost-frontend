
import { useState, useEffect, useCallback } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { toast } from "@/components/ui/use-toast";
import { IDL } from "@dfinity/candid";

interface Token {
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
  logo?: string;
}

// ICP Ledger Canister ID
const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

// Simple IDL for the ICP Ledger canister account_balance method
const icpLedgerIDL = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  return IDL.Service({
    'account_balance' : IDL.Func([AccountIdentifier], [Tokens], ['query']),
  });
};

// Convert principal to account identifier (subaccount 0)
const principalToAccountIdentifier = (principal: Principal): Array<number> => {
  // This is a simplified version - in a real app, you'd use a proper conversion function
  // that follows the ICP standard for account identifiers
  console.log("Converting principal to account ID:", principal.toString());
  
  // For demo purposes, we'll create a deterministic byte array
  // In a real implementation, you would use a proper conversion library
  const bytes = [...new Uint8Array(principal.toUint8Array())];
  
  // Pad with zeros to make a 32-byte account identifier (simplified)
  while (bytes.length < 32) {
    bytes.push(0);
  }
  
  return bytes.slice(0, 32);
};

// Format e8s (ICP's smallest unit) to ICP with proper decimal places
const formatE8sToICP = (e8s: bigint): string => {
  const icp = Number(e8s) / 100000000;
  return icp.toFixed(8);
};

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

  // Fetch real ICP balance from the ledger canister
  const fetchICPBalance = useCallback(async (userPrincipal: Principal): Promise<Token[]> => {
    if (!agent) {
      console.error("Agent not initialized");
      return [];
    }
    
    setBalances(null); // Set to null to show loading state
    
    try {
      console.log("Attempting to fetch ICP balance for:", userPrincipal.toString());

      // Create account identifier from principal
      const accountId = principalToAccountIdentifier(userPrincipal);
      console.log("Account identifier created:", accountId);

      // Create an actor to interact with the ICP Ledger
      const icpLedger = await agent.createActor(icpLedgerIDL, {
        canisterId: LEDGER_CANISTER_ID,
      });
      
      console.log("ICP Ledger actor created, calling account_balance");
      
      // Call the account_balance method
      const balance = await icpLedger.account_balance(accountId);
      console.log("Received balance response:", balance);
      
      // Format the balance
      const icpAmount = formatE8sToICP(balance.e8s);
      console.log("Formatted ICP amount:", icpAmount);
      
      // Return the token data
      return [
        {
          name: "Internet Computer",
          symbol: "ICP",
          amount: icpAmount,
          decimals: 8,
          logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png"
        }
      ];
    } catch (error) {
      console.error("Error fetching ICP balance:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch ICP balance",
        description: "Could not retrieve your token balance from the ledger canister"
      });
      
      // Return a placeholder token with 0 balance to show something
      return [
        {
          name: "Internet Computer",
          symbol: "ICP",
          amount: "0.00000000",
          decimals: 8,
          logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png"
        }
      ];
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
    
    // In production, we should verify the agent before using it
    try {
      await agent.fetchRootKey(); // This should only be done in development
      console.log("Agent root key fetched");
    } catch (error) {
      console.warn("Could not fetch root key, calls will fail in development:", error);
    }
    
    setIdentity(identity);
    setPrincipal(principalStr);
    setAgent(agent);
    setConnected(true);
    
    console.log("Wallet connected, principal:", principalStr);
    
    // Fetch the token balances
    const tokenBalances = await fetchICPBalance(principal);
    setBalances(tokenBalances);
    
    toast({
      title: "Wallet connected",
      description: "Your Internet Computer wallet is now connected",
    });
  }, [fetchICPBalance]);

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
