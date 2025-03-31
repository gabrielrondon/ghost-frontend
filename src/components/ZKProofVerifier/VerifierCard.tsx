
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VerifierCardProps {
  children: React.ReactNode;
}

const VerifierCard = ({ children }: VerifierCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg text-white border-purple-900/50">
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default VerifierCard;
