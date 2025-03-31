
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  connect: () => Promise<void>;
}

const WalletConnect = ({ connect }: WalletConnectProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Button 
        onClick={connect}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-8 py-6 rounded-xl flex items-center space-x-2 transition-all shadow-lg hover:shadow-purple-500/20"
        size="lg"
      >
        <Wallet className="mr-2 h-5 w-5" />
        <span>Connect Wallet</span>
      </Button>
      <p className="text-purple-300 text-sm mt-4">
        Connect to Internet Computer to view your balances
      </p>
    </div>
  );
};

export default WalletConnect;
