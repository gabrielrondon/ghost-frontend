
import { Ghost } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Ghost - ZK Notary Agent" }: HeaderProps) => {
  return (
    <header className="flex items-center justify-center py-6">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Ghost className="h-8 w-8 text-purple-500" />
        <span>{title}</span>
      </div>
    </header>
  );
};

export default Header;
