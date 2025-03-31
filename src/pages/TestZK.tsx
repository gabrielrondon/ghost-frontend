
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ZKProofTestRunner from "@/components/ZKProofTestRunner";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";

const TestZK = () => {
  const { 
    connected, 
    principal, 
    balances, 
    agent,
    connect
  } = useWallet();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-950 to-purple-900">
      <div className="w-full max-w-4xl px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-purple-200 hover:text-white hover:bg-white/10"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Ghost - ZK Proof Testing</h1>
          <p className="text-purple-200">Run end-to-end tests to validate the ZK proof system</p>
        </div>
        
        {connected ? (
          <div className="space-y-6">
            <ZKProofTestRunner 
              agent={agent} 
              principal={principal} 
              tokens={balances}
            />
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">About ZK Proof Testing</h2>
              <p className="text-purple-200 mb-4">
                This test suite validates the complete end-to-end functionality of the ZK proof system:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-purple-200">
                <li>Proof Generation - Tests the ability to create a zero-knowledge proof for token ownership</li>
                <li>Proof Verification - Tests that the generated proof can be verified by the original creator</li>
                <li>Anonymous Verification - Tests that the proof can be verified by an anonymous party</li>
              </ul>
              <p className="mt-4 text-purple-200">
                The test results can be exported as a JSON file for documentation or audit purposes.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">Wallet Connection Required</h3>
              <p className="text-purple-200 mb-6">
                You need to connect your wallet to run ZK proof tests. Please connect using one of the options below.
              </p>
              <div className="max-w-sm mx-auto">
                <WalletConnect connect={connect} />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">About ZK Proof Testing</h2>
              <p className="text-purple-200 mb-4">
                This test suite validates the complete end-to-end functionality of the ZK proof system:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-purple-200">
                <li>Proof Generation - Tests the ability to create a zero-knowledge proof for token ownership</li>
                <li>Proof Verification - Tests that the generated proof can be verified by the original creator</li>
                <li>Anonymous Verification - Tests that the proof can be verified by an anonymous party</li>
              </ul>
              <p className="mt-4 text-purple-200">
                The test results can be exported as a JSON file for documentation or audit purposes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestZK;
