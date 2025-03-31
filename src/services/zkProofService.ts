
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { toast } from "@/components/ui/use-toast";

// ZK Proof Canister ID
export const ZK_PROOF_CANISTER_ID = "hi7bu-myaaa-aaaad-aaloa-cai";

// Interface for ZK Proof response
export interface ZKProofResponse {
  proofId: string;
  proofLink: string;
  token: string;
  timestamp: number;
}

// Define the canister interface
export interface ZKProofCanister {
  generateProof: (token: string, principal: Principal) => Promise<ZKProofResponse>;
  verifyProof: (proofId: string) => Promise<boolean>;
}

// IDL for the ZK Proof canister
export const zkProofCanisterIDL = ({ IDL }: { IDL: any }) => {
  const ProofResponse = IDL.Record({
    'proofId': IDL.Text,
    'proofLink': IDL.Text,
    'token': IDL.Text,
    'timestamp': IDL.Nat64
  });
  
  return IDL.Service({
    'generateProof': IDL.Func([IDL.Text, IDL.Principal], [ProofResponse], []),
    'verifyProof': IDL.Func([IDL.Text], [IDL.Bool], ['query']),
  });
};

/**
 * Creates an actor to interact with the ZK Proof canister
 */
export const createZKProofActor = async (
  agent: HttpAgent
): Promise<ActorSubclass<ZKProofCanister>> => {
  try {
    console.log("Creating ZK Proof actor");
    
    const actor: ActorSubclass<ZKProofCanister> = await Actor.createActor(
      zkProofCanisterIDL,
      {
        agent,
        canisterId: ZK_PROOF_CANISTER_ID,
      }
    );
    
    console.log("ZK Proof actor created successfully");
    return actor;
  } catch (error) {
    console.error("Error creating ZK Proof actor:", error);
    throw error;
  }
};

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
    const response = await zkProofActor.generateProof(token, principal);
    
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

/**
 * Verifies a ZK proof
 */
export const verifyZKProof = async (
  agent: HttpAgent,
  proofId: string
): Promise<boolean> => {
  try {
    console.log(`Verifying ZK proof with ID ${proofId}`);
    
    const zkProofActor = await createZKProofActor(agent);
    const isValid = await zkProofActor.verifyProof(proofId);
    
    console.log("ZK proof verification result:", isValid);
    return isValid;
  } catch (error) {
    console.error("Error verifying ZK proof:", error);
    toast({
      variant: "destructive",
      title: "Failed to verify ZK proof",
      description: "An error occurred while verifying the ZK proof"
    });
    throw error;
  }
};
