
import { HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

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

export const isPlugInstalled = (): boolean => {
  return window.ic?.plug !== undefined;
};

export const isPlugConnected = async (): Promise<boolean> => {
  if (!isPlugInstalled()) return false;
  return window.ic?.plug?.isConnected() || false;
};

export const connectPlug = async (canisterIds: string[] = []): Promise<boolean> => {
  if (!isPlugInstalled()) {
    throw new Error("Plug wallet is not installed");
  }

  try {
    return await window.ic?.plug?.requestConnect({
      whitelist: canisterIds,
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
    // Create the agent if it doesn't exist yet
    if (!window.ic?.plug?.agent) {
      await window.ic?.plug?.createAgent({
        host: "https://ic0.app",
      });
    }

    return window.ic?.plug?.agent || null;
  } catch (error) {
    console.error("Error getting Plug agent:", error);
    throw error;
  }
};

export const getPlugPrincipal = async (): Promise<Principal | null> => {
  if (!isPlugInstalled() || !(await isPlugConnected())) {
    return null;
  }

  try {
    return await window.ic?.plug?.getPrincipal() || null;
  } catch (error) {
    console.error("Error getting Plug principal:", error);
    throw error;
  }
};

export const disconnectPlug = async (): Promise<void> => {
  if (!isPlugInstalled()) return;
  
  try {
    await window.ic?.plug?.disconnect();
  } catch (error) {
    console.error("Error disconnecting from Plug wallet:", error);
    throw error;
  }
};
