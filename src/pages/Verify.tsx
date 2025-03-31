
import { useSearchParams } from "react-router-dom";
import ZKProofVerifier from "@/components/ZKProofVerifier";
import Header from "@/components/Header";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const proofId = searchParams.get("proofId") || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-900 text-white">
      <Header title="Ghost - ZK Proof Verification" />
      <div className="container py-6 px-4 md:px-6">
        <ZKProofVerifier proofId={proofId} />
      </div>
    </div>
  );
};

export default Verify;
