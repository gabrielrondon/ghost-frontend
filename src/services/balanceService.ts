
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { toast } from "@/components/ui/use-toast";
import { 
  LEDGER_CANISTER_ID, 
  icpLedgerIDL, 
  principalToAccountIdentifier, 
  formatE8sToICP, 
  Token, 
  Tokens 
} from "@/utils/icpLedger";

/**
 * Fetches the ICP balance for a principal from the ledger canister
 */
export const fetchICPBalance = async (
  agent: HttpAgent,
  userPrincipal: Principal
): Promise<Token[]> => {
  try {
    console.log("Attempting to fetch ICP balance for:", userPrincipal.toString());

    // Create account identifier from principal
    const accountId = principalToAccountIdentifier(userPrincipal);
    console.log("Account identifier created:", accountId);

    // Create an actor to interact with the ICP Ledger
    const icpLedger: ActorSubclass<{
      account_balance: (accountId: number[]) => Promise<Tokens>
    }> = await Actor.createActor(icpLedgerIDL, {
      agent,
      canisterId: LEDGER_CANISTER_ID,
    });
    
    console.log("ICP Ledger actor created, calling account_balance");
    
    // Call the account_balance method
    const balance = await icpLedger.account_balance(accountId);
    console.log("Received balance response:", balance);
    
    // Format the balance
    const icpAmount = formatE8sToICP(balance.e8s);
    console.log("Formatted ICP amount:", icpAmount);
    
    // Return the token data
    return [
      {
        name: "Internet Computer",
        symbol: "ICP",
        amount: icpAmount,
        decimals: 8,
        logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png"
      }
    ];
  } catch (error) {
    console.error("Error fetching ICP balance:", error);
    toast({
      variant: "destructive",
      title: "Failed to fetch ICP balance",
      description: "Could not retrieve your token balance from the ledger canister"
    });
    
    // Return a placeholder token with 0 balance to show something
    return [
      {
        name: "Internet Computer",
        symbol: "ICP",
        amount: "0.00000000",
        decimals: 8,
        logo: "https://cryptologos.cc/logos/internet-computer-icp-logo.png"
      }
    ];
  }
};
