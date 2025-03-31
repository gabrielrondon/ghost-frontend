
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
    
    // Check if the agent has a getPrincipal method which indicates if it's anonymous or not
    const isAnonymous = !agent.getPrincipal;
    console.log(`Is anonymous agent: ${isAnonymous}`);
    
    // For all verification, use direct method call to avoid query() issues with anonymous agents
    try {
      // Direct call to the verify_proof method on the actor
      console.log("Calling verify_proof directly");
      
      // Access the underlying _service property which has the raw methods
      // @ts-ignore - We need to bypass TypeScript's type checking here
      const rawService = zkProofActor._service;
      
      // Call the raw method without using query() which has getPrincipal checks
      // @ts-ignore - Direct access to internals
      const result = await rawService.verify_proof(proofBytes);
      
      console.log("Raw verification result:", result);
      
      if ('Err' in result) {
        console.error("Error verifying proof:", result.Err);
        return false;
      }
      
      const isValid = result.Ok;
      console.log("ZK proof verification result:", isValid);
      return isValid;
    } catch (error) {
      console.error("Direct verification failed:", error);
      
      // Fallback to traditional method if direct access fails
      console.log("Falling back to traditional method");
      const result = await zkProofActor.verify_proof(proofBytes);
      
      if ('Err' in result) {
        console.error("Error in fallback verification:", result.Err);
        return false;
      }
      
      const isValid = result.Ok;
      console.log("Fallback verification result:", isValid);
      return isValid;
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
