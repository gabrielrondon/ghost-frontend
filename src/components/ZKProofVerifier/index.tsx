
import { useState, useEffect } from "react";
import { HttpAgent } from "@dfinity/agent";
import { createAgent } from "@/services/authService";
import { verifyZKProof } from "@/services/zkProof";
import { toast } from "@/components/ui/use-toast";
import VerifierCard from "./VerifierCard";
import VerifierForm from "./VerifierForm";
import VerificationResult from "./VerificationResult";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
    <div className="space-y-6">
      <Alert className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600">
        <InfoIcon className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-600 font-medium">Enhanced Verification Coming in Milestone 2</AlertTitle>
        <AlertDescription className="text-yellow-600/90">
          In the upcoming release, this tool will be enhanced with AI-based proof summarization and advanced verification capabilities. 
          You'll be able to verify that a user holds more than 20 ICP tokens without revealing their exact balance, 
          confirm membership in a DAO without disclosing identity, or validate token ownership within a specific timeframe - 
          all while maintaining complete privacy of sensitive data.
        </AlertDescription>
      </Alert>
      
      <VerifierCard>
        <VerifierForm 
          proofId={proofId} 
          setProofId={setProofId} 
          handleVerifyProof={handleVerifyProof}
          isVerifying={isVerifying}
          agent={agent}
        />
        
        {verificationResult !== null && (
          <VerificationResult isValid={verificationResult} />
        )}
      </VerifierCard>
    </div>
  );
};

export default ZKProofVerifier;
