
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { Loader2, Share, Shield, Copy, Link } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { generateZKProof, ZKProofResponse } from "@/services/zkProof";
import { Token } from "@/utils/icpLedger";

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

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: message
      });
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again"
      });
    });
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
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-100">Select Token</label>
            <Select
              value={selectedToken}
              onValueChange={setSelectedToken}
              disabled={!tokens || tokens.length === 0 || isGenerating}
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
        </div>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="mt-4 w-full bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
            >
              <Link className="mr-2 h-4 w-4" />
              View Generated Proof
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-b from-indigo-950 to-purple-950 text-white border-purple-500">
            <DialogHeader>
              <DialogTitle>ZK Proof Generated</DialogTitle>
              <DialogDescription className="text-purple-200">
                Share this link with anyone who needs to verify your {proofResult.token} balance without revealing the actual amount.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100">Proof ID</label>
                <div className="flex">
                  <Input
                    readOnly
                    value={proofResult.proofId}
                    className="bg-white/10 border-purple-400 text-white"
                  />
                  <Button
                    variant="outline"
                    className="ml-2 bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
                    onClick={() => copyToClipboard(proofResult.proofId, "Proof ID copied to clipboard")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100">Shareable Link</label>
                <div className="flex">
                  <Input
                    readOnly
                    value={proofResult.proofLink}
                    className="bg-white/10 border-purple-400 text-white"
                  />
                  <Button
                    variant="outline"
                    className="ml-2 bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
                    onClick={() => copyToClipboard(proofResult.proofLink, "Proof link copied to clipboard")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100">Token</label>
                <Input
                  readOnly
                  value={proofResult.token}
                  className="bg-white/10 border-purple-400 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-100">Generated At</label>
                <Input
                  readOnly
                  value={new Date(proofResult.timestamp).toLocaleString()}
                  className="bg-white/10 border-purple-400 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Close
                </Button>
              </DialogClose>
              <Button
                variant="outline"
                className="bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
                onClick={() => copyToClipboard(proofResult.proofLink, "Proof link copied to clipboard")}
              >
                <Share className="mr-2 h-4 w-4" />
                Share Proof
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default ZKProofGenerator;
