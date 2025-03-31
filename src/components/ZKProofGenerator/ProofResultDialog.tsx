
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { Share, Copy, Link } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ZKProofResponse } from "@/services/zkProof";

interface ProofResultDialogProps {
  proofResult: ZKProofResponse;
}

const ProofResultDialog = ({ proofResult }: ProofResultDialogProps) => {
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: message
      });
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again"
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-4 w-full bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
        >
          <Link className="mr-2 h-4 w-4" />
          View Generated Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-b from-indigo-950 to-purple-950 text-white border-purple-500">
        <DialogHeader>
          <DialogTitle>ZK Proof Generated</DialogTitle>
          <DialogDescription className="text-purple-200">
            Share this link with anyone who needs to verify your {proofResult.token} balance without revealing the actual amount.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <ProofDetailItem 
            label="Proof ID"
            value={proofResult.proofId}
            onCopy={() => copyToClipboard(proofResult.proofId, "Proof ID copied to clipboard")}
          />
          <ProofDetailItem 
            label="Shareable Link"
            value={proofResult.proofLink}
            onCopy={() => copyToClipboard(proofResult.proofLink, "Proof link copied to clipboard")}
          />
          <ProofDetailItem 
            label="Token"
            value={proofResult.token}
            readonly
          />
          <ProofDetailItem 
            label="Generated At"
            value={new Date(proofResult.timestamp).toLocaleString()}
            readonly
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Close
            </Button>
          </DialogClose>
          <Button
            variant="outline"
            className="bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
            onClick={() => copyToClipboard(proofResult.proofLink, "Proof link copied to clipboard")}
          >
            <Share className="mr-2 h-4 w-4" />
            Share Proof
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ProofDetailItemProps {
  label: string;
  value: string;
  readonly?: boolean;
  onCopy?: () => void;
}

const ProofDetailItem = ({ label, value, readonly = false, onCopy }: ProofDetailItemProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-purple-100">{label}</label>
      <div className={readonly ? "" : "flex"}>
        <Input
          readOnly
          value={value}
          className="bg-white/10 border-purple-400 text-white"
        />
        {!readonly && onCopy && (
          <Button
            variant="outline"
            className="ml-2 bg-white/10 border-purple-400 text-purple-100 hover:bg-white/20 hover:text-white"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProofResultDialog;
