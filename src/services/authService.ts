
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";

/**
 * Creates an authenticated HTTP agent for interacting with Internet Computer canisters
 */
export const createAgent = async (identity: Identity): Promise<HttpAgent> => {
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
