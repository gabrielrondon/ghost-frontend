
import { HttpAgent, Identity } from "@dfinity/agent";
import { Actor, ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { IDL } from "@dfinity/candid";
import { sha224 } from "@dfinity/principal/lib/esm/utils/sha224";
import { getCrc32 } from "@dfinity/principal/lib/esm/utils/getCrc";

// ICP Ledger Canister ID
export const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

// Interface for the Tokens type returned by the ICP ledger
export interface Tokens {
  e8s: bigint;
}

export interface Token {
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
  logo?: string;
}

// Updated IDL for the ICP Ledger canister account_balance method
// The account_balance method expects an object with an 'account' field that's a blob (Uint8Array)
export const icpLedgerIDL = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({ "account": AccountIdentifier });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  
  return IDL.Service({
    'account_balance' : IDL.Func([Account], [Tokens], ['query']),
  });
};

// Properly convert principal to account identifier with valid checksum
export const principalToAccountIdentifier = (principal: Principal, subAccount?: Uint8Array): Uint8Array => {
  console.log("Converting principal to account ID:", principal.toString());
  
  // Ensure the principal is included in the account identifier
  const principalBytes = principal.toUint8Array();
  
  // Create a new instance of sha224 hasher
  const shaObj = sha224.create();
  
  // Concatenate byte arrays for hashing
  const prefix = new Uint8Array([10]); // Prefix for account IDs
  const label = new TextEncoder().encode("account-id");
  
  // Update the hash with all parts
  shaObj.update(prefix);
  shaObj.update(label);
  shaObj.update(principalBytes);
  shaObj.update(subAccount || new Uint8Array(32).fill(0)); // default subAccount to all 0s
  
  const hash = shaObj.digest();
  const checksum = getCrc32(hash);
  
  // Combine checksum and hash to create account ID
  const accountId = new Uint8Array([
    ...Array.from(checksum),
    ...Array.from(hash)
  ]);

  console.log("Created account identifier with proper checksum:", Array.from(accountId));
  
  return accountId;
};

// Format e8s (ICP's smallest unit) to ICP with proper decimal places
export const formatE8sToICP = (e8s: bigint): string => {
  const icp = Number(e8s) / 100000000;
  return icp.toFixed(8);
};
