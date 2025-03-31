
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
