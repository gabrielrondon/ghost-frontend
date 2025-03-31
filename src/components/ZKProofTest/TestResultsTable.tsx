
import React from "react";
import { TestSuiteResults } from "@/utils/zkProofTesting";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TestResultsTableProps {
  testResults: TestSuiteResults;
}

const TestResultsTable = ({ testResults }: TestResultsTableProps) => {
  return (
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <XCircle className="h-5 w-5 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs whitespace-normal">{result.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell className="max-w-[200px] overflow-hidden text-ellipsis">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="cursor-help">
                      <div className="flex items-center">
                        <span className="truncate">{result.message}</span>
                        {result.message.length > 30 && (
                          <AlertCircle className="h-3 w-3 ml-1 text-gray-400" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs whitespace-normal">{result.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{new Date(result.timestamp).toLocaleTimeString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TestResultsTable;
