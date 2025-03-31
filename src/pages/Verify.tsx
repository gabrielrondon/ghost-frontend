
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ZKProofVerifier from "@/components/ZKProofVerifier";

const Verify = () => {
  const location = useLocation();
  const [proofId, setProofId] = useState<string | null>(null);

  useEffect(() => {
    // Extract proofId from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("proofId");
    if (id) {
      setProofId(id);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-950 to-purple-900">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Ghost - ZK Proof Verifier</h1>
          <p className="text-purple-200">Verify token proof without revealing the balance</p>
        </div>
        
        <ZKProofVerifier proofId={proofId || undefined} />
        
        <p className="text-purple-300 text-sm mt-6 text-center">
          Powered by Internet Computer blockchain and zero-knowledge proofs
        </p>
      </div>
    </div>
  );
};

export default Verify;
