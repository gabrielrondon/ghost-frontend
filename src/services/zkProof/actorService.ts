
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { ZKProofCanister } from "./types";
import { ZK_PROOF_CANISTER_ID, zkProofCanisterIDL } from "./canisterDefinition";

/**
 * Creates an actor to interact with the ZK Proof canister
 */
export const createZKProofActor = async (
  agent: HttpAgent
): Promise<ActorSubclass<ZKProofCanister>> => {
  try {
    console.log("Creating ZK Proof actor");
    
    // Check if the agent is anonymous (doesn't have getPrincipal method)
    const isAnonymous = !agent.getPrincipal;
    
    // Create the actor with special options for anonymous verification
    const actorOptions = {
      agent,
      canisterId: ZK_PROOF_CANISTER_ID,
    };
    
    // If anonymous, add configuration to bypass authentication checks
    if (isAnonymous) {
      console.log("Configuring actor for anonymous verification");
      // @ts-ignore - Adding custom options that might not be in the type definition
      actorOptions.queryTransform = (args: any) => {
        return { ...args, certified: false };
      };
    }
    
    const actor: ActorSubclass<ZKProofCanister> = Actor.createActor(
      zkProofCanisterIDL,
      actorOptions
    );
    
    console.log("ZK Proof actor created successfully");
    return actor;
  } catch (error) {
    console.error("Error creating ZK Proof actor:", error);
    throw error;
  }
};
