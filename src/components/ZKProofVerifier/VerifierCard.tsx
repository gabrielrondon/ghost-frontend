
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface VerifierCardProps {
  children: React.ReactNode;
}

const VerifierCard = ({ children }: VerifierCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          ZK Proof Verifier
        </CardTitle>
        <CardDescription className="text-purple-200">
          Verify a ZK proof without revealing the actual token balance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifierCard;
