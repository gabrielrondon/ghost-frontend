
import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import TokenBalances from "@/components/TokenBalances";
import ZKProofGenerator from "@/components/ZKProofGenerator";
import { useWallet } from "@/hooks/useWallet";
import { AuthProvider } from "@/services/authService";

const Index = () => {
  const { 
    connected, 
    principal, 
    balances, 
    isRefreshing,
    agent, 
    authProvider,
    connect, 
    disconnect, 
    refreshBalance 
  } = useWallet();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-950 to-purple-900">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Ghost - Internet Computer</h1>
          <p className="text-purple-200">Connect your wallet to view your token balances</p>
        </div>
        
        {!connected ? (
          <WalletConnect connect={connect} />
        ) : (
          <div className="space-y-6 w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-white text-center">
              <p className="text-sm text-purple-200">
                Connected with {authProvider === AuthProvider.InternetIdentity ? 'Internet Identity' : 'Plug Wallet'}
              </p>
              <p className="text-xs font-mono break-all mt-1">{principal}</p>
              <button 
                onClick={disconnect}
                className="mt-3 text-xs text-purple-300 hover:text-white transition-colors"
              >
                Disconnect
              </button>
            </div>
            <TokenBalances 
              balances={balances} 
              isRefreshing={isRefreshing}
              onRefresh={refreshBalance} 
            />
            
            {/* Add ZK Proof Generator */}
            <ZKProofGenerator 
              agent={agent} 
              principal={principal} 
              tokens={balances} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
