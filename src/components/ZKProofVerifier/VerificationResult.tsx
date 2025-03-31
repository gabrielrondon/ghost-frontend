
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface VerificationResultProps {
  isValid: boolean;
}

const VerificationResult = ({ isValid }: VerificationResultProps) => {
  return (
    <div className={`p-4 rounded-lg flex items-center ${
      isValid 
        ? "bg-green-500/20 text-green-100" 
        : "bg-red-500/20 text-red-100"
    }`}>
      {isValid ? (
        <>
          <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
          <span>Valid ZK Proof: This proof is authentic and has been verified on the Internet Computer blockchain.</span>
        </>
      ) : (
        <>
          <XCircle className="mr-2 h-5 w-5 text-red-400" />
          <span>Invalid ZK Proof: This proof could not be verified or does not exist.</span>
        </>
      )}
    </div>
  );
};

export default VerificationResult;
