
import { useState, useEffect } from "react";
import { HttpAgent } from "@dfinity/agent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Shield, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { verifyZKProof } from "@/services/zkProofService";
import { createAgent } from "@/services/authService";

interface ZKProofVerifierProps {
  proofId?: string;
}

const ZKProofVerifier = ({ proofId: initialProofId }: ZKProofVerifierProps) => {
  const [proofId, setProofId] = useState<string>(initialProofId || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [agent, setAgent] = useState<HttpAgent | null>(null);

  // Initialize an anonymous agent for verification
  useEffect(() => {
    const initAgent = async () => {
      try {
        // Create an anonymous agent (no identity)
        const anonymousAgent = await createAgent({} as any);
        setAgent(anonymousAgent);
        console.log("Anonymous agent created successfully for verification");
      } catch (error) {
        console.error("Error initializing agent:", error);
        toast({
          variant: "destructive",
          title: "Failed to initialize",
          description: "Could not create an agent for verification"
        });
      }
    };

    initAgent();
  }, []);

  // Auto-verify if proofId is provided
  useEffect(() => {
    if (initialProofId && agent) {
      console.log(`Auto-verifying proof with ID: ${initialProofId}`);
      handleVerifyProof();
    }
  }, [initialProofId, agent]);

  const handleVerifyProof = async () => {
    if (!proofId || !agent) {
      toast({
        variant: "destructive",
        title: "Cannot verify proof",
        description: "Please enter a valid proof ID"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      console.log(`Verifying proof with ID: ${proofId}`);
      console.log(`Proof exists in localStorage: ${localStorage.getItem(`proof_${proofId}`) !== null}`);
      
      const isValid = await verifyZKProof(agent, proofId);
      console.log(`Verification result: ${isValid}`);
      
      setVerificationResult(isValid);
      
      toast({
        variant: isValid ? "default" : "destructive",
        title: isValid ? "Proof is valid" : "Proof is invalid",
        description: isValid 
          ? "The ZK proof has been successfully verified" 
          : "The ZK proof could not be verified"
      });
    } catch (error) {
      console.error("Error verifying ZK proof:", error);
      setVerificationResult(false);
      
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "An error occurred during verification"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          ZK Proof Verifier
        </CardTitle>
        <CardDescription className="text-purple-200">
          Verify a ZK proof without revealing the actual token balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-100">Proof ID</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter the proof ID"
                value={proofId}
                onChange={(e) => setProofId(e.target.value)}
                className="bg-white/10 border-purple-400 text-white"
                disabled={isVerifying}
              />
              <Button
                onClick={handleVerifyProof}
                disabled={!proofId || isVerifying || !agent}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shrink-0"
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </div>
          
          {verificationResult !== null && (
            <div className={`p-4 rounded-lg flex items-center ${
              verificationResult 
                ? "bg-green-500/20 text-green-100" 
                : "bg-red-500/20 text-red-100"
            }`}>
              {verificationResult ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                  <span>Valid ZK Proof: This proof is authentic and has been verified on the Internet Computer blockchain.</span>
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-5 w-5 text-red-400" />
                  <span>Invalid ZK Proof: This proof could not be verified or does not exist.</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZKProofVerifier;
