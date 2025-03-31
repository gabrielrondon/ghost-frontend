
import { useState } from "react";
import { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, Link } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { generateZKProof, ZKProofResponse } from "@/services/zkProof";
import { Token } from "@/utils/icpLedger";
import TokenSelector from "./TokenSelector";
import ProofResultDialog from "./ProofResultDialog";

interface ZKProofGeneratorProps {
  agent: HttpAgent | null;
  principal: string | null;
  tokens: Token[] | null;
}

const ZKProofGenerator = ({ agent, principal, tokens }: ZKProofGeneratorProps) => {
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofResult, setProofResult] = useState<ZKProofResponse | null>(null);

  const handleGenerateProof = async () => {
    if (!agent || !principal || !selectedToken) {
      toast({
        variant: "destructive",
        title: "Cannot generate proof",
        description: "Please connect your wallet and select a token"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const principalObj = Principal.fromText(principal);
      const result = await generateZKProof(agent, selectedToken, principalObj);
      setProofResult(result);
      toast({
        title: "ZK Proof generated successfully",
        description: "You can now share the proof link with others"
      });
    } catch (error) {
      console.error("Error generating ZK proof:", error);
      toast({
        variant: "destructive",
        title: "Failed to generate ZK proof",
        description: "An error occurred while generating the proof"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          ZK Proof Generator
        </CardTitle>
        <CardDescription className="text-purple-200">
          Generate a ZK proof to privately verify your token balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TokenSelector 
          selectedToken={selectedToken}
          onSelectToken={setSelectedToken}
          tokens={tokens}
          disabled={!tokens || tokens.length === 0 || isGenerating}
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={handleGenerateProof}
          disabled={!selectedToken || isGenerating || !agent || !principal}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Proof...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Generate ZK Proof
            </>
          )}
        </Button>
      </CardFooter>

      {proofResult && (
        <ProofResultDialog proofResult={proofResult} />
      )}
    </Card>
  );
};

export default ZKProofGenerator;
