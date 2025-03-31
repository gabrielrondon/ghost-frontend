
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import WalletConnect from "@/components/WalletConnect";
import ZKProofGenerator from "@/components/ZKProofGenerator";
import TokenBalances from "@/components/TokenBalances";
import { useWallet } from "@/hooks/useWallet";
import { fetchTokenBalances } from "@/services/balanceService";
import { Token } from "@/utils/icpLedger";
import Header from "@/components/Header";

const Index = () => {
  const { 
    principal, 
    agent, 
    connected, 
    balances: walletBalances, 
    isRefreshing, 
    refreshBalance,
    connect
  } = useWallet();
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBalances = async () => {
      if (agent && principal) {
        setIsLoading(true);
        try {
          const fetchedTokens = await fetchTokenBalances(agent, Principal.fromText(principal));
          setTokens(fetchedTokens);
        } catch (error) {
          console.error("Failed to fetch token balances:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadBalances();
  }, [agent, principal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-900 text-white">
      <Header />
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <WalletConnect connect={connect} />
          </div>
          <div className="md:col-span-8">
            {principal ? (
              <div className="space-y-6">
                <TokenBalances 
                  balances={tokens} 
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  onRefresh={refreshBalance}
                />
                <ZKProofGenerator 
                  agent={agent as HttpAgent | null} 
                  principal={principal} 
                  tokens={tokens} 
                />
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg">
                <CardContent className="py-10 text-center">
                  <p className="text-lg text-purple-200">
                    Connect your wallet to generate ZK proofs
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
