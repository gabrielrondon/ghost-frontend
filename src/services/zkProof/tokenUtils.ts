
import { Principal } from "@dfinity/principal";
import { TokenOwnershipInput, TokenMetadata } from "./types";

/**
 * Transform token data into TokenOwnershipInput
 */
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
