
import ZKProofTest from "@/components/ZKProofTest";
import { useWallet } from "@/hooks/useWallet";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import WalletConnect from "@/components/WalletConnect";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

const TestZK = () => {
  const { identity, principal, agent, isConnecting } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-900 text-white">
      <Header title="Ghost - ZK Test Suite" />
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <WalletConnect />
          </div>
          <div className="md:col-span-8">
            {principal ? (
              <ZKProofTest 
                agent={agent as HttpAgent | null} 
                principal={principal} 
              />
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg">
                <CardContent className="py-10 text-center">
                  <p className="text-lg text-purple-200">
                    Connect your wallet to run ZK proof tests
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

export default TestZK;
