
import React from "react";
import { TestSuiteResults, exportTestResults } from "@/utils/zkProofTesting";
import { Button } from "@/components/ui/button";
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
import { AlertCircle, FileDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DetailedResultsDialogProps {
  testResults: TestSuiteResults;
}

const DetailedResultsDialog = ({ testResults }: DetailedResultsDialogProps) => {
  const handleExportResults = () => {
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
  );
};

export default DetailedResultsDialog;
