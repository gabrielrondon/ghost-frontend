
import { useState, useEffect, useCallback } from "react";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { toast } from "@/components/ui/use-toast";
import { Token } from "@/utils/icpLedger";
import { fetchICPBalance } from "@/services/balanceService";
import { createAgent, createAuthClient, login, logout } from "@/services/authService";

export function useWallet() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [agent, setAgent] = useState<any>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [balances, setBalances] = useState<Token[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize AuthClient
  useEffect(() => {
    createAuthClient().then((client) => {
      setAuthClient(client);
      
      // Check if user is already authenticated
      if (client.isAuthenticated()) {
        handleAuthenticated(client);
      }
    });
  }, []);

  const handleAuthenticated = useCallback(async (client: AuthClient) => {
    const identity = client.getIdentity();
    const principal = identity.getPrincipal();
    const principalStr = principal.toString();
    
    // Create an agent using the identity
    const agent = await createAgent(identity);
    
    setIdentity(identity);
    setPrincipal(principalStr);
    setAgent(agent);
    setConnected(true);
    
    console.log("Wallet connected, principal:", principalStr);
    
    // Fetch the token balances
    setBalances(null); // Set to null to show loading state
    const tokenBalances = await fetchICPBalance(agent, principal);
    setBalances(tokenBalances);
    
    toast({
      title: "Wallet connected",
      description: "Your Internet Computer wallet is now connected",
    });
  }, []);

  const connect = useCallback(async () => {
    if (!authClient) return;

    try {
      await login(authClient, () => handleAuthenticated(authClient));
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
    
    await logout(authClient);
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

  const refreshBalance = useCallback(async () => {
    if (!connected || !principal || !identity || isRefreshing || !agent) return;
    
    setIsRefreshing(true);
    try {
      const tokenBalances = await fetchICPBalance(agent, identity.getPrincipal());
      setBalances(tokenBalances);
      toast({
        title: "Balance refreshed",
        description: "Your ICP balance has been updated",
      });
    } catch (error) {
      console.error("Error refreshing balance:", error);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Could not refresh your ICP balance",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [connected, principal, identity, agent, isRefreshing]);

  return {
    connected,
    principal,
    identity,
    balances,
    isRefreshing,
    connect,
    disconnect,
    refreshBalance
  };
}
