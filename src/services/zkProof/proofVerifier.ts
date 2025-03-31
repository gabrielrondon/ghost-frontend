
import { HttpAgent } from "@dfinity/agent";
import { toast } from "@/components/ui/use-toast";
import { createZKProofActor } from "./actorService";

/**
 * Verifies a ZK proof
 */
export const verifyZKProof = async (
  agent: HttpAgent,
  proofId: string
): Promise<boolean> => {
  try {
    console.log(`Verifying ZK proof with ID ${proofId}`);
    
    // Retrieve proof bytes from localStorage
    const proofBase64 = localStorage.getItem(`proof_${proofId}`);
    if (!proofBase64) {
      console.error(`Proof not found in localStorage for ID: ${proofId}`);
      console.log("Available localStorage keys:", Object.keys(localStorage));
      return false;
    }
    
    console.log(`Found proof in localStorage for ID: ${proofId}`);
    
    // Convert base64 back to bytes
    const proofString = atob(proofBase64);
    const proofBytes = new Uint8Array(proofString.length);
    for (let i = 0; i < proofString.length; i++) {
      proofBytes[i] = proofString.charCodeAt(i);
    }
    
    const zkProofActor = await createZKProofActor(agent);
    console.log("Calling verify_proof on canister");
    
    // Critical fix for anonymous verification:
    // For anonymous verification, directly call the verify_proof method
    // instead of using query() which tries to access getPrincipal
    try {
      // Call the verify_proof method directly on the actor
      const result = await zkProofActor.verify_proof(proofBytes);
      console.log("Verification result:", result);
      
      if ('Err' in result) {
        console.error("Error verifying proof:", result.Err);
        return false;
      }
      
      const isValid = result.Ok;
      console.log("ZK proof verification result:", isValid);
      return isValid;
    } catch (error) {
      console.error("Direct verification failed:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error verifying ZK proof:", error);
    toast({
      variant: "destructive",
      title: "Failed to verify ZK proof",
      description: "An error occurred while verifying the ZK proof"
    });
    return false;
  }
};
