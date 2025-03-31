
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Token } from "@/utils/icpLedger";

interface TokenSelectorProps {
  selectedToken: string;
  onSelectToken: (token: string) => void;
  tokens: Token[] | null;
  disabled: boolean;
}

const TokenSelector = ({ selectedToken, onSelectToken, tokens, disabled }: TokenSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-purple-100">Select Token</label>
      <Select
        value={selectedToken}
        onValueChange={onSelectToken}
        disabled={disabled}
      >
        <SelectTrigger className="bg-white/10 border-purple-400 text-white">
          <SelectValue placeholder="Select a token" />
        </SelectTrigger>
        <SelectContent>
          {tokens && tokens.map((token) => (
            <SelectItem key={token.symbol} value={token.symbol}>
              {token.name} ({token.symbol})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TokenSelector;
