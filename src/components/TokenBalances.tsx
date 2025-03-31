
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface Token {
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
  logo?: string;
}

interface TokenBalancesProps {
  balances: Token[] | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const TokenBalances = ({ balances, isRefreshing = false, onRefresh }: TokenBalancesProps) => {
  if (!balances) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-6 w-6 text-white animate-spin mr-2" />
          <p className="text-white text-center">Fetching real ICP balance from the Internet Computer...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-lg p-4">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-4 space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg p-6 text-center text-white">
        <p>No tokens found in this wallet</p>
        <p className="text-sm text-purple-300 mt-2">
          Tokens will appear here once you have them in your wallet
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-xl font-medium">Your ICP Balance</h2>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </>
            )}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {balances.map((token, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-lg p-4 text-white">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="font-bold text-white text-sm">{token.symbol.slice(0, 2)}</span>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{token.name}</h3>
                <p className="text-sm text-purple-300">{token.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{token.amount}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokenBalances;
