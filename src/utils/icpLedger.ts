
import { HttpAgent, Identity } from "@dfinity/agent";
import { Actor, ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { IDL } from "@dfinity/candid";

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

// Convert principal to account identifier (subaccount 0)
export const principalToAccountIdentifier = (principal: Principal): Array<number> => {
  // This is a simplified version - in a real app, you'd use a proper conversion function
  // that follows the ICP standard for account identifiers
  console.log("Converting principal to account ID:", principal.toString());
  
  // For demo purposes, we'll create a deterministic byte array
  // In a real implementation, you would use a proper conversion library
  const bytes = [...new Uint8Array(principal.toUint8Array())];
  
  // Pad with zeros to make a 32-byte account identifier (simplified)
  while (bytes.length < 32) {
    bytes.push(0);
  }
  
  return bytes.slice(0, 32);
};

// Format e8s (ICP's smallest unit) to ICP with proper decimal places
export const formatE8sToICP = (e8s: bigint): string => {
  const icp = Number(e8s) / 100000000;
  return icp.toFixed(8);
};
