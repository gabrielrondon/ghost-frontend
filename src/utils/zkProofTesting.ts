
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { generateZKProof, verifyZKProof, ZKProofResponse } from "@/services/zkProof";
import { createAgent } from "@/services/authService";
import { Token } from "@/utils/icpLedger";

// Test result interface
export interface TestResult {
  name: string;
  success: boolean;
  message: string;
  timestamp: number;
  error?: string; // Add error field to store detailed error information
}

// Complete test suite results
export interface TestSuiteResults {
  allPassed: boolean;
  results: TestResult[];
  startTime: number;
  endTime: number;
  duration: number;
}

/**
 * Runs a complete end-to-end test of the ZK proof system
 */
export const runZKProofTest = async (
  agent: HttpAgent,
  principal: Principal,
  token: Token
): Promise<TestSuiteResults> => {
  const results: TestResult[] = [];
  const startTime = Date.now();
  let allPassed = true;
  
  console.log("Starting ZK Proof Test Suite");
  
  // Test 1: Generate ZK Proof
  try {
    console.log(`Test 1: Generating ZK proof for token ${token.symbol}`);
    const proofResponse = await generateZKProof(agent, token.symbol, principal);
    
    results.push({
      name: "Generate ZK Proof",
      success: true,
      message: `Successfully generated proof with ID: ${proofResponse.proofId}`,
      timestamp: Date.now()
    });
    
    // Test 2: Verify the generated ZK Proof
    try {
      console.log(`Test 2: Verifying ZK proof with ID ${proofResponse.proofId}`);
      const isValid = await verifyZKProof(agent, proofResponse.proofId);
      
      if (isValid) {
        results.push({
          name: "Verify ZK Proof",
          success: true,
          message: `Successfully verified proof with ID: ${proofResponse.proofId}`,
          timestamp: Date.now()
        });
      } else {
        allPassed = false;
        results.push({
          name: "Verify ZK Proof",
          success: false,
          message: `Failed to verify proof with ID: ${proofResponse.proofId}`,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      allPassed = false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({
        name: "Verify ZK Proof",
        success: false,
        message: `Error verifying proof`,
        timestamp: Date.now(),
        error: errorMessage
      });
    }
    
    // Test 3: Verify with anonymous agent
    try {
      console.log(`Test 3: Verifying ZK proof with anonymous agent`);
      
      // Create a new anonymous agent specifically for verification
      // Use the IC_HOST constant instead of accessing agent.host
      const IC_HOST = "https://ic0.app"; // Define the IC host URL
      const anonymousAgentOptions = { host: IC_HOST };
      const anonymousAgent = new HttpAgent(anonymousAgentOptions);
      
      console.log("Created anonymous agent:", anonymousAgent);
      console.log("Anonymous agent host:", IC_HOST);
      
      // Make sure the localStorage has the proof available for the anonymousAgent to access
      console.log(`Checking if proof exists in localStorage: ${localStorage.getItem(`proof_${proofResponse.proofId}`) !== null}`);
      
      // Add a short delay to ensure storage is synced
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the proof with the anonymous agent
      const anonymousVerify = await verifyZKProof(anonymousAgent, proofResponse.proofId);
      
      console.log(`Anonymous verification result: ${anonymousVerify}`);
      
      if (anonymousVerify) {
        results.push({
          name: "Anonymous Verification",
          success: true,
          message: "Successfully verified proof with anonymous agent",
          timestamp: Date.now()
        });
      } else {
        allPassed = false;
        results.push({
          name: "Anonymous Verification",
          success: false,
          message: "Failed to verify proof with anonymous agent",
          timestamp: Date.now()
        });
      }
    } catch (error) {
      allPassed = false;
      console.error("Anonymous verification error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      results.push({
        name: "Anonymous Verification",
        success: false,
        message: `Error in anonymous verification`,
        timestamp: Date.now(),
        error: errorMessage
      });
    }
    
  } catch (error) {
    allPassed = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({
      name: "Generate ZK Proof",
      success: false,
      message: `Error generating proof`,
      timestamp: Date.now(),
      error: errorMessage
    });
  }
  
  const endTime = Date.now();
  
  return {
    allPassed,
    results,
    startTime,
    endTime,
    duration: endTime - startTime
  };
};

// Export a JSON representation of test results
export const exportTestResults = (results: TestSuiteResults): string => {
  return JSON.stringify(results, null, 2);
};

// Save test results to localStorage
export const saveTestResults = (results: TestSuiteResults): void => {
  localStorage.setItem('zkproof_test_results', JSON.stringify(results));
};

// Load test results from localStorage
export const loadTestResults = (): TestSuiteResults | null => {
  const saved = localStorage.getItem('zkproof_test_results');
  return saved ? JSON.parse(saved) : null;
};

// Clear test results from localStorage
export const clearTestResults = (): void => {
  localStorage.removeItem('zkproof_test_results');
};
