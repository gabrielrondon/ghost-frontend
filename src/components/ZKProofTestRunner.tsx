
import { useState } from "react";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, FileDown, PlayCircle, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Token } from "@/utils/icpLedger";
import { 
  runZKProofTest, 
  TestSuiteResults, 
  exportTestResults, 
  saveTestResults, 
  loadTestResults 
} from "@/utils/zkProofTesting";

interface ZKProofTestRunnerProps {
  agent: HttpAgent | null;
  principal: string | null;
  tokens: Token[] | null;
}

const ZKProofTestRunner = ({ agent, principal, tokens }: ZKProofTestRunnerProps) => {
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<TestSuiteResults | null>(
    loadTestResults()
  );

  const handleRunTests = async () => {
    if (!agent || !principal || !selectedToken || !tokens) {
      toast({
        variant: "destructive",
        title: "Cannot run tests",
        description: "Please connect your wallet and select a token"
      });
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
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-100">Select Token for Test</label>
            <Select
              value={selectedToken}
              onValueChange={setSelectedToken}
              disabled={!tokens || tokens.length === 0 || isRunningTests}
            >
              <SelectTrigger className="bg-white/10 border-purple-400 text-white">
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent>
                {tokens && tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {testResults && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Test Results</h3>
                <Badge 
                  variant={testResults.allPassed ? "default" : "destructive"}
                  className={`${testResults.allPassed ? 'bg-green-600' : 'bg-red-600'}`}
                >
                  {testResults.allPassed ? "All Tests Passed" : "Some Tests Failed"}
                </Badge>
              </div>
              
              <Table>
                <TableCaption>
                  Test run completed in {testResults.duration}ms at {new Date(testResults.endTime).toLocaleString()}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{result.message}</TableCell>
                      <TableCell>{new Date(result.timestamp).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-2 bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    View Detailed Results
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gradient-to-b from-indigo-950 to-purple-950 text-white border-purple-500 max-w-3xl max-h-[80vh] overflow-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Detailed Test Results</AlertDialogTitle>
                    <AlertDialogDescription className="text-purple-200">
                      Complete output from the test execution
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="my-4 p-4 bg-black/30 rounded-md">
                    <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap overflow-auto max-h-[40vh]">
                      {JSON.stringify(testResults, null, 2)}
                    </pre>
                  </div>
                  
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white">
                      Close
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={handleExportResults}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Export Results
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={handleRunTests}
          disabled={!selectedToken || isRunningTests || !agent || !principal}
        >
          {isRunningTests ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Run End-to-End Tests
            </>
          )}
        </Button>
      </CardFooter>
      
      {testResults && (
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
      )}
    </Card>
  );
};

export default ZKProofTestRunner;
