
import { Button } from "@/components/ui/button";
import { Wallet, Lock, AlertCircle } from "lucide-react";
import { isPlugInstalled } from "@/utils/plugWallet";
import { AuthProvider } from "@/services/authService";
import { useEffect, useState } from "react";

interface WalletConnectProps {
  connect: (provider: AuthProvider) => Promise<void>;
}

const WalletConnect = ({ connect }: WalletConnectProps) => {
  const [plugAvailable, setPlugAvailable] = useState(false);
  const [checkingPlug, setCheckingPlug] = useState(true);

  useEffect(() => {
    // Give time for browser extensions to initialize
    const checkPlugTimer = setTimeout(() => {
      const isPlug = isPlugInstalled();
      console.log("Plug wallet detected:", isPlug);
      setPlugAvailable(isPlug);
      setCheckingPlug(false);
    }, 500);

    return () => clearTimeout(checkPlugTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="space-y-4 w-full">
        <Button 
          onClick={() => connect(AuthProvider.InternetIdentity)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-8 py-6 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/20"
          size="lg"
        >
          <Lock className="mr-2 h-5 w-5" />
          <span>Connect with Internet Identity</span>
        </Button>
        
        <Button 
          onClick={() => connect(AuthProvider.Plug)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium px-8 py-6 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-blue-500/20"
          size="lg"
          disabled={checkingPlug || !plugAvailable}
        >
          <Wallet className="mr-2 h-5 w-5" />
          <span>Connect with Plug Wallet</span>
          {checkingPlug && <span className="ml-2 text-xs">(Checking...)</span>}
        </Button>
        
        {!checkingPlug && !plugAvailable && (
          <div className="flex items-center text-yellow-300 text-sm bg-yellow-500/10 p-3 rounded-lg mt-2">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Plug wallet extension is not installed. <a href="https://plugwallet.ooo/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Install Plug</a> to use this option.</span>
          </div>
        )}
      </div>
      
      <p className="text-purple-300 text-sm mt-6">
        Connect to Internet Computer to view your balances
      </p>
    </div>
  );
};

export default WalletConnect;
