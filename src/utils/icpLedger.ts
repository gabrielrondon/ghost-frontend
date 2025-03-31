
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
  
  // Prepare message components
  const prefix = new Uint8Array([10]); // Prefix for account IDs
  const label = new TextEncoder().encode("account-id");
  const defaultSubAccount = new Uint8Array(32).fill(0);
  const subAccountToUse = subAccount || defaultSubAccount;
  
  // Concatenate all parts for hashing
  const messageLength = prefix.length + label.length + principalBytes.length + subAccountToUse.length;
  const message = new Uint8Array(messageLength);
  
  let offset = 0;
  message.set(prefix, offset);
  offset += prefix.length;
  message.set(label, offset);
  offset += label.length;
  message.set(principalBytes, offset);
  offset += principalBytes.length;
  message.set(subAccountToUse, offset);
  
  // Generate hash using sha224
  const hash = sha224(message);
  const checksum = getCrc32(hash);
  
  // Combine checksum and hash to create account ID
  const checksumArray = new Uint8Array(4);
  checksumArray[0] = checksum >> 24 & 0xFF;
  checksumArray[1] = checksum >> 16 & 0xFF;
  checksumArray[2] = checksum >> 8 & 0xFF;
  checksumArray[3] = checksum & 0xFF;
  
  // Create the final account identifier
  const accountId = new Uint8Array(checksumArray.length + hash.length);
  accountId.set(checksumArray, 0);
  accountId.set(hash, checksumArray.length);

  console.log("Created account identifier with proper checksum:", Array.from(accountId));
  
  return accountId;
};

// Format e8s (ICP's smallest unit) to ICP with proper decimal places
export const formatE8sToICP = (e8s: bigint): string => {
  const icp = Number(e8s) / 100000000;
  return icp.toFixed(8);
};
