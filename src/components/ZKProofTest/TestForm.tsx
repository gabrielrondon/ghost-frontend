
import { useState } from "react";
import { Token } from "@/utils/icpLedger";
import { HttpAgent } from "@dfinity/agent";
import { 
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2, PlayCircle } from "lucide-react";

interface TestFormProps {
  tokens: Token[] | null;
  isRunningTests: boolean;
  agent: HttpAgent | null;
  principal: string | null;
  onRunTests: (selectedToken: string) => void;
}

const TestForm = ({ 
  tokens, 
  isRunningTests, 
  agent, 
  principal, 
  onRunTests 
}: TestFormProps) => {
  const [selectedToken, setSelectedToken] = useState<string>("");

  const handleSubmit = () => {
    if (!agent || !principal || !selectedToken || !tokens) {
      toast({
        variant: "destructive",
        title: "Cannot run tests",
        description: "Please connect your wallet and select a token"
      });
      return;
    }
    
    onRunTests(selectedToken);
  };

  return (
    <>
      <CardContent>
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-100">Select Token for Test</label>
          <Select
            value={selectedToken}
            onValueChange={setSelectedToken}
            disabled={!tokens || tokens.length === 0 || isRunningTests}
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
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={handleSubmit}
          disabled={!selectedToken || isRunningTests || !agent || !principal}
        >
          {isRunningTests ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run End-to-End Tests
            </>
          )}
        </Button>
      </CardFooter>
    </>
  );
};

export default TestForm;
