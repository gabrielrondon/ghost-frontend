
import { useState, useEffect, useCallback } from "react";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { toast } from "@/components/ui/use-toast";
import { Token } from "@/utils/icpLedger";
import { fetchICPBalance } from "@/services/balanceService";
import { 
  createAgent, 
  createAuthClient, 
  login, 
  logout, 
  connectWithPlug, 
  disconnectFromPlug,
  AuthProvider 
} from "@/services/authService";
import { isPlugConnected } from "@/utils/plugWallet";

export function useWallet() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [agent, setAgent] = useState<any>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [balances, setBalances] = useState<Token[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authProvider, setAuthProvider] = useState<AuthProvider | null>(null);

  // Initialize AuthClient and check for existing sessions
  useEffect(() => {
    const initAuth = async () => {
      // Check if already connected to Plug
      if (await isPlugConnected()) {
        try {
          const { agent, principal } = await connectWithPlug();
          handlePlugConnection(agent, principal);
          return;
        } catch (error) {
          console.warn("Error connecting to existing Plug session:", error);
        }
      }

      // Check Internet Identity
      const client = await createAuthClient();
      setAuthClient(client);
      
      // Check if user is already authenticated
      if (client.isAuthenticated()) {
        handleAuthenticated(client);
      }
    };

    initAuth();
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
    setAuthProvider(AuthProvider.InternetIdentity);
    
    console.log("Wallet connected via Internet Identity, principal:", principalStr);
    
    // Fetch the token balances
    setBalances(null); // Set to null to show loading state
    const tokenBalances = await fetchICPBalance(agent, principal);
    setBalances(tokenBalances);
    
    toast({
      title: "Wallet connected",
      description: "Your Internet Computer wallet is now connected via Internet Identity",
    });
  }, []);

  const handlePlugConnection = useCallback(async (plugAgent: any, plugPrincipal: Principal) => {
    const principalStr = plugPrincipal.toString();
    
    setIdentity(null); // Plug doesn't provide an Identity object directly
    setPrincipal(principalStr);
    setAgent(plugAgent);
    setConnected(true);
    setAuthProvider(AuthProvider.Plug);
    
    console.log("Wallet connected via Plug, principal:", principalStr);
    
    // Fetch the token balances
    setBalances(null); // Set to null to show loading state
    const tokenBalances = await fetchICPBalance(plugAgent, plugPrincipal);
    setBalances(tokenBalances);
    
    toast({
      title: "Wallet connected",
      description: "Your Internet Computer wallet is now connected via Plug",
    });
  }, []);

  const connect = useCallback(async (provider: AuthProvider) => {
    try {
      if (provider === AuthProvider.InternetIdentity) {
        if (!authClient) {
          const client = await createAuthClient();
          setAuthClient(client);
          await login(client, () => handleAuthenticated(client));
        } else {
          await login(authClient, () => handleAuthenticated(authClient));
        }
      } else if (provider === AuthProvider.Plug) {
        const { agent, principal } = await connectWithPlug([]);
        handlePlugConnection(agent, principal);
      }
    } catch (error) {
      console.error(`Authentication error with ${provider}:`, error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: `There was a problem connecting to your wallet via ${provider === AuthProvider.InternetIdentity ? 'Internet Identity' : 'Plug'}`,
      });
    }
  }, [authClient, handleAuthenticated, handlePlugConnection]);

  const disconnect = useCallback(async () => {
    if (authProvider === AuthProvider.InternetIdentity && authClient) {
      await logout(authClient);
    } else if (authProvider === AuthProvider.Plug) {
      await disconnectFromPlug();
    }
    
    setIdentity(null);
    setPrincipal(null);
    setAgent(null);
    setConnected(false);
    setBalances(null);
    setAuthProvider(null);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [authClient, authProvider]);

  const refreshBalance = useCallback(async () => {
    if (!connected || !principal || isRefreshing || !agent) return;
    
    setIsRefreshing(true);
    try {
      const principalObj = authProvider === AuthProvider.InternetIdentity 
        ? identity?.getPrincipal() 
        : Principal.fromText(principal);
        
      if (!principalObj) {
        throw new Error("Could not get principal for balance refresh");
      }
      
      const tokenBalances = await fetchICPBalance(agent, principalObj);
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
  }, [connected, principal, identity, agent, isRefreshing, authProvider]);

  return {
    connected,
    principal,
    identity,
    balances,
    isRefreshing,
    authProvider,
    connect,
    disconnect,
    refreshBalance
  };
}
