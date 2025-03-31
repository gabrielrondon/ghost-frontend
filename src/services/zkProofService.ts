
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { toast } from "@/components/ui/use-toast";

// ZK Proof Canister ID
export const ZK_PROOF_CANISTER_ID = "hi7bu-myaaa-aaaad-aaloa-cai";

// Interface definitions based on the provided .did file
export type TokenStandard = {
  'ERC20': null;
} | {
  'ERC721': null;
} | {
  'ERC1155': null;
} | {
  'ICRC1': null;
} | {
  'ICRC2': null;
} | {
  'ICP': null;
};

export type TokenMetadata = {
  canister_id: string;
  token_standard: TokenStandard;
  decimals: [] | [number];
};

export type TokenOwnershipInput = {
  token_metadata: TokenMetadata;
  token_id: Uint8Array;
  balance: Uint8Array;
  owner_hash: Uint8Array;
  merkle_path: Uint8Array[];
  path_indices: Uint8Array;
  token_specific_data: [] | [Uint8Array];
};

export type Result = {
  'Ok': boolean;
} | {
  'Err': string;
};

// Transform token data into TokenOwnershipInput
export const createTokenOwnershipInput = (
  token: string,
  principal: Principal
): TokenOwnershipInput => {
  // This is a simplified version - in a real application, you would need
  // to calculate these values based on actual token data
  const tokenMetadata: TokenMetadata = {
    canister_id: "ryjl3-tyaaa-aaaaa-aaaba-cai", // ICP Ledger canister ID
    token_standard: { 'ICP': null },
    decimals: [8]
  };

  // Generate mock balance data for demonstration
  // In a real application, this would be the actual balance converted to bytes
  const balanceBytes = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 10]); // Example: 10 units
  
  // Generate owner hash from principal
  const ownerBytes = new TextEncoder().encode(principal.toString());
  
  return {
    token_metadata: tokenMetadata,
    token_id: new Uint8Array([]),
    balance: balanceBytes,
    owner_hash: ownerBytes,
    merkle_path: [],
    path_indices: new Uint8Array([]),
    token_specific_data: []
  };
};

// Format proof response for frontend use
export interface ZKProofResponse {
  proofId: string;
  proofLink: string;
  token: string;
  timestamp: number;
}

// Define the canister interface
export interface ZKProofCanister {
  prove_ownership: (token: string, input: TokenOwnershipInput) => Promise<{ 'Ok': Uint8Array } | { 'Err': string }>;
  verify_proof: (proofData: Uint8Array) => Promise<Result>;
}

// IDL for the ZK Proof canister
export const zkProofCanisterIDL = ({ IDL }: { IDL: any }) => {
  // Define TokenStandard
  const TokenStandard = IDL.Variant({
    'ERC20': IDL.Null,
    'ERC721': IDL.Null,
    'ERC1155': IDL.Null,
    'ICRC1': IDL.Null,
    'ICRC2': IDL.Null,
    'ICP': IDL.Null
  });
  
  // Define TokenMetadata
  const TokenMetadata = IDL.Record({
    'canister_id': IDL.Text,
    'token_standard': TokenStandard,
    'decimals': IDL.Opt(IDL.Nat8)
  });
  
  // Define TokenOwnershipInput
  const TokenOwnershipInput = IDL.Record({
    'token_metadata': TokenMetadata,
    'token_id': IDL.Vec(IDL.Nat8),
    'balance': IDL.Vec(IDL.Nat8),
    'owner_hash': IDL.Vec(IDL.Nat8),
    'merkle_path': IDL.Vec(IDL.Vec(IDL.Nat8)),
    'path_indices': IDL.Vec(IDL.Nat8),
    'token_specific_data': IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  
  // Define Result
  const Result = IDL.Variant({
    'Ok': IDL.Bool,
    'Err': IDL.Text
  });
  
  // Define service interface
  return IDL.Service({
    'prove_ownership': IDL.Func([IDL.Text, TokenOwnershipInput], [IDL.Variant({
      'Ok': IDL.Vec(IDL.Nat8),
      'Err': IDL.Text
    })], []),
    'verify_proof': IDL.Func([IDL.Vec(IDL.Nat8)], [Result], ['query'])
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
    
    const actor: ActorSubclass<ZKProofCanister> = Actor.createActor(
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
      console.error("Proof not found in localStorage");
      return false;
    }
    
    // Convert base64 back to bytes
    const proofString = atob(proofBase64);
    const proofBytes = new Uint8Array(proofString.length);
    for (let i = 0; i < proofString.length; i++) {
      proofBytes[i] = proofString.charCodeAt(i);
    }
    
    const zkProofActor = await createZKProofActor(agent);
    const result = await zkProofActor.verify_proof(proofBytes);
    
    if ('Err' in result) {
      console.error("Error verifying proof:", result.Err);
      return false;
    }
    
    const isValid = result.Ok;
    console.log("ZK proof verification result:", isValid);
    return isValid;
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

