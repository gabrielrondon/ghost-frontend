
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";
import Header from "@/components/Header";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-900 text-white flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Ghost className="h-24 w-24 text-purple-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-8 text-purple-200">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
