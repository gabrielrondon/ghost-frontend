
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { HttpAgent } from "@dfinity/agent";

interface VerifierFormProps {
  proofId: string;
  setProofId: (id: string) => void;
  handleVerifyProof: () => Promise<void>;
  isVerifying: boolean;
  agent: HttpAgent | null;
}

const VerifierForm = ({ 
  proofId, 
  setProofId, 
  handleVerifyProof, 
  isVerifying,
  agent
}: VerifierFormProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-purple-100">Proof ID</label>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter the proof ID"
          value={proofId}
          onChange={(e) => setProofId(e.target.value)}
          className="bg-white/10 border-purple-400 text-white"
          disabled={isVerifying}
        />
        <Button
          onClick={handleVerifyProof}
          disabled={!proofId || isVerifying || !agent}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shrink-0"
        >
          {isVerifying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  );
};

export default VerifierForm;
