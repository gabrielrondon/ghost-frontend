
// ZK Proof Canister ID
export const ZK_PROOF_CANISTER_ID = "hi7bu-myaaa-aaaad-aaloa-cai";

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
