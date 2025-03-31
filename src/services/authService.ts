
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { 
  isPlugInstalled, 
  connectPlug, 
  getPlugAgent, 
  getPlugPrincipal,
  disconnectPlug
} from "@/utils/plugWallet";

// Polyfill global for browser environment
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  (window as any).global = window;
}

// IC mainnet host URL
const IC_HOST = "https://ic0.app";

// Whether we're in production (true) or development (false)
const isProduction = process.env.NODE_ENV === 'production' || 
                     window.location.hostname !== 'localhost';

export enum AuthProvider {
  InternetIdentity = "internet_identity",
  Plug = "plug"
}

/**
 * Creates an authenticated HTTP agent for interacting with Internet Computer canisters
 */
export const createAgent = async (identity: Identity): Promise<HttpAgent> => {
  // Create an agent using the identity
  const agent = new HttpAgent({ 
    identity, 
    host: IC_HOST // Always use mainnet
  });
  
  // Only fetch the root key in development
  if (!isProduction) {
    try {
      await agent.fetchRootKey();
      console.log("Agent root key fetched");
    } catch (error) {
      console.warn("Could not fetch root key, calls will fail in development:", error);
    }
  } else {
    console.log("Running in production, skipping root key fetch");
  }
  
  return agent;
};

/**
 * Creates an auth client for Internet Computer authentication
 */
export const createAuthClient = async (): Promise<AuthClient> => {
  return AuthClient.create();
};

/**
 * Initiates the login flow with Internet Computer identity service
 */
export const login = async (
  authClient: AuthClient, 
  onSuccess: () => void
): Promise<void> => {
  await authClient.login({
    identityProvider: "https://identity.ic0.app/#authorize",
    onSuccess,
  });
};

/**
 * Logs out the current user
 */
export const logout = async (authClient: AuthClient): Promise<void> => {
  await authClient.logout();
};

/**
 * Connect using Plug wallet
 */
export const connectWithPlug = async (canisterIds: string[] = []): Promise<{
  agent: HttpAgent;
  principal: Principal;
}> => {
  if (!isPlugInstalled()) {
    throw new Error("Plug wallet is not installed");
  }

  const connected = await connectPlug(canisterIds);
  
  if (!connected) {
    throw new Error("Failed to connect to Plug wallet");
  }
  
  const agent = await getPlugAgent();
  const principal = await getPlugPrincipal();
  
  if (!agent || !principal) {
    throw new Error("Failed to get Plug wallet agent or principal");
  }
  
  return { agent, principal };
};

/**
 * Disconnect from Plug wallet
 */
export const disconnectFromPlug = async (): Promise<void> => {
  await disconnectPlug();
};
