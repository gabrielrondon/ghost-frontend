
import { useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, PlayCircle } from "lucide-react";
import { Token } from "@/utils/icpLedger";
import { 
  runZKProofTest, 
  TestSuiteResults, 
  exportTestResults, 
  saveTestResults, 
  loadTestResults 
} from "@/utils/zkProofTesting";

import TestForm from "./TestForm";
import TestResultsTable from "./TestResultsTable";
import DetailedResultsDialog from "./DetailedResultsDialog";

interface ZKProofTestRunnerProps {
  agent: HttpAgent | null;
  principal: string | null;
  tokens: Token[] | null;
}

const ZKProofTestRunner = ({ agent, principal, tokens }: ZKProofTestRunnerProps) => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResults | null>(
    loadTestResults()
  );

  const handleRunTests = async (selectedToken: string) => {
    if (!agent || !principal || !selectedToken || !tokens) {
      return;
    }

    setIsRunningTests(true);
    
    try {
      const token = tokens.find(t => t.symbol === selectedToken);
      if (!token) {
        throw new Error(`Token ${selectedToken} not found`);
      }
      
      const principalObj = Principal.fromText(principal);
      const results = await runZKProofTest(agent, principalObj, token);
      
      setTestResults(results);
      saveTestResults(results);
      
      if (results.allPassed) {
        toast({
          title: "All tests passed!",
          description: `Completed ${results.results.length} tests successfully in ${results.duration}ms`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Some tests failed",
          description: `Completed ${results.results.length} tests with failures in ${results.duration}ms`
        });
      }
    } catch (error) {
      console.error("Error running tests:", error);
      toast({
        variant: "destructive",
        title: "Test execution failed",
        description: "An unexpected error occurred while running tests"
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleExportResults = () => {
    if (!testResults) return;
    
    const jsonData = exportTestResults(testResults);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `zkproof-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Test results exported",
      description: "The test results have been downloaded as a JSON file"
    });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlayCircle className="mr-2 h-5 w-5" />
          ZK Proof Test Runner
        </CardTitle>
        <CardDescription className="text-purple-200">
          Run end-to-end tests to verify ZK proof generation and verification
        </CardDescription>
      </CardHeader>
      
      <TestForm 
        tokens={tokens}
        isRunningTests={isRunningTests}
        agent={agent}
        principal={principal}
        onRunTests={handleRunTests}
      />
      
      {testResults && (
        <>
          <CardContent>
            <TestResultsTable testResults={testResults} />
            <DetailedResultsDialog testResults={testResults} />
          </CardContent>
          
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
              onClick={handleExportResults}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export Test Results
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

// Need to import toast since it's used in the component
import { toast } from "@/components/ui/use-toast";

export default ZKProofTestRunner;
