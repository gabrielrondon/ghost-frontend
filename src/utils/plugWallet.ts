
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// IC mainnet host URL
const IC_HOST = "https://ic0.app";

// Whether we're in production (true) or development (false)
const isProduction = process.env.NODE_ENV === 'production' || 
                     window.location.hostname !== 'localhost';

declare global {
  interface Window {
    ic?: {
      plug?: {
        isConnected: () => Promise<boolean>;
        requestConnect: (options?: {
          whitelist?: string[];
          host?: string;
        }) => Promise<boolean>;
        createAgent: (options?: {
          whitelist?: string[];
          host?: string;
        }) => Promise<void>;
        agent: HttpAgent;
        getPrincipal: () => Promise<Principal>;
        disconnect: () => Promise<void>;
      };
    };
  }
}

// This function safely checks if Plug is installed without making network requests
export const isPlugInstalled = (): boolean => {
  // Add more robust check with console logging
  console.log("Checking if Plug wallet is installed...");
  console.log("window.ic:", window.ic);
  console.log("window.ic?.plug:", window.ic?.plug);
  
  // More reliable detection that waits for window.ic to be initialized
  if (typeof window === 'undefined') return false;
  
  // Check for both window.ic and window.ic.plug to be defined
  return Boolean(window.ic && window.ic.plug);
};

export const isPlugConnected = async (): Promise<boolean> => {
  if (!isPlugInstalled()) return false;
  try {
    return await window.ic?.plug?.isConnected() || false;
  } catch (error) {
    console.error("Error checking Plug connection status:", error);
    return false;
  }
};

export const connectPlug = async (canisterIds: string[] = []): Promise<boolean> => {
  if (!isPlugInstalled()) {
    throw new Error("Plug wallet is not installed");
  }

  try {
    // Always use the IC_HOST parameter and never rely on Plug's defaults
    // Don't try to fetch root key in production which causes CORS errors
    return await window.ic?.plug?.requestConnect({
      whitelist: canisterIds,
      host: IC_HOST,
    }) || false;
  } catch (error) {
    console.error("Error connecting to Plug wallet:", error);
    throw error;
  }
};

export const getPlugAgent = async (): Promise<HttpAgent | null> => {
  if (!isPlugInstalled() || !(await isPlugConnected())) {
    return null;
  }

  try {
    // Create the agent with explicit production host to avoid localhost connections
    await window.ic?.plug?.createAgent({
      host: IC_HOST, // Always use production IC host
    });
    
    // Get the agent from plug
    const agent = window.ic?.plug?.agent;
    
    // Skip root key fetching in production to avoid CORS errors
    if (agent && !isProduction) {
      try {
        // Only fetch root key in development
        await agent.fetchRootKey();
        console.log("Plug agent root key fetched successfully");
      } catch (fetchError) {
        console.warn("Failed to fetch root key from Plug agent, calls may fail in development:", fetchError);
      }
    } else if (agent) {
      console.log("Running in production, skipping Plug agent root key fetch");
    }

    return agent || null;
  } catch (error) {
    console.error("Error getting Plug agent:", error);
    return null; // Return null instead of throwing to avoid breaking the app
  }
};

export const getPlugPrincipal = async (): Promise<Principal | null> => {
  if (!isPlugInstalled() || !(await isPlugConnected())) {
    return null;
  }

  try {
    const principal = await window.ic?.plug?.getPrincipal();
    if (principal) {
      console.log("Retrieved Plug principal:", principal.toString());
      return principal;
    }
    return null;
  } catch (error) {
    console.error("Error getting Plug principal:", error);
    return null; // Return null instead of throwing to avoid breaking the app
  }
};

export const disconnectPlug = async (): Promise<void> => {
  if (!isPlugInstalled()) return;
  
  try {
    await window.ic?.plug?.disconnect();
    console.log("Successfully disconnected from Plug wallet");
  } catch (error) {
    console.error("Error disconnecting from Plug wallet:", error);
    // Don't throw here, just log the error
  }
};
