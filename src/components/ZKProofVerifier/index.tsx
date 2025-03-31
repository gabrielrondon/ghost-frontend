
import { useState, useEffect } from "react";
import { HttpAgent } from "@dfinity/agent";
import { createAgent } from "@/services/authService";
import { verifyZKProof } from "@/services/zkProof";
import { toast } from "@/components/ui/use-toast";
import VerifierCard from "./VerifierCard";
import VerifierForm from "./VerifierForm";
import VerificationResult from "./VerificationResult";

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
  );
};

export default ZKProofVerifier;
