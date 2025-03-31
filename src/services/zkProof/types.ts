
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Token standard types
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

// Token metadata structure
export type TokenMetadata = {
  canister_id: string;
  token_standard: TokenStandard;
  decimals: [] | [number];
};

// Input structure for token ownership proofs
export type TokenOwnershipInput = {
  token_metadata: TokenMetadata;
  token_id: Uint8Array;
  balance: Uint8Array;
  owner_hash: Uint8Array;
  merkle_path: Uint8Array[];
  path_indices: Uint8Array;
  token_specific_data: [] | [Uint8Array];
};

// Result type for canister calls
export type Result = {
  'Ok': boolean;
} | {
  'Err': string;
};

// Response format for frontend
export interface ZKProofResponse {
  proofId: string;
  proofLink: string;
  token: string;
  timestamp: number;
}

// Canister interface definition
export interface ZKProofCanister {
  prove_ownership: (token: string, input: TokenOwnershipInput) => Promise<{ 'Ok': Uint8Array } | { 'Err': string }>;
  verify_proof: (proofData: Uint8Array) => Promise<Result>;
}
