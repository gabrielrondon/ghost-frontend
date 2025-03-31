
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { toast } from "@/components/ui/use-toast";
import { ZKProofResponse } from "./types";
import { createZKProofActor } from "./actorService";
import { createTokenOwnershipInput } from "./tokenUtils";

/**
 * Generates a ZK proof for a token
 */
export const generateZKProof = async (
  agent: HttpAgent,
  token: string,
  principal: Principal
): Promise<ZKProofResponse> => {
  try {
    console.log(`Generating ZK proof for token ${token} with principal ${principal.toString()}`);
    
    const zkProofActor = await createZKProofActor(agent);
    const tokenInput = createTokenOwnershipInput(token, principal);
    
    const result = await zkProofActor.prove_ownership(token, tokenInput);
    
    if ('Err' in result) {
      throw new Error(`Error generating proof: ${result.Err}`);
    }
    
    // Convert proof bytes to base64 for sharing
    const proofBytes = result.Ok;
    const proofBase64 = btoa(String.fromCharCode(...proofBytes));
    
    // Generate a unique ID based on the proof
    const proofId = Array.from(proofBytes.slice(0, 8))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Create shareable link
    const proofLink = `${window.location.origin}/verify?proofId=${proofId}`;
    
    // Prepare the response
    const response: ZKProofResponse = {
      proofId,
      proofLink,
      token,
      timestamp: Date.now()
    };
    
    // Store the proof in localStorage for verification
    console.log(`Storing proof in localStorage with key: proof_${proofId}`);
    localStorage.setItem(`proof_${proofId}`, proofBase64);
    
    console.log("ZK proof generated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error generating ZK proof:", error);
    toast({
      variant: "destructive",
      title: "Failed to generate ZK proof",
      description: "An error occurred while generating the ZK proof"
    });
    throw error;
  }
};
