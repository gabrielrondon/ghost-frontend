
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Ghost, Github } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Ghost - ZK Notary Agent" }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="py-6 border-b border-white/10 backdrop-blur-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Ghost className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <Button variant="ghost" className="text-white hover:text-purple-200 hover:bg-white/10">
                  Home
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/test">
                <Button variant="ghost" className="text-white hover:text-purple-200 hover:bg-white/10">
                  ZK Test Suite
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/verify">
                <Button variant="ghost" className="text-white hover:text-purple-200 hover:bg-white/10">
                  Verify Proof
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about">
                <Button variant="ghost" className="text-white hover:text-purple-200 hover:bg-white/10">
                  About
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/ZKNotary/ghost" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-purple-200 transition-colors"
          >
            <Github className="h-6 w-6" />
          </a>
          
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              className="text-white hover:text-purple-200 hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-purple-200 hover:bg-white/10"
              onClick={() => navigate('/test')}
            >
              Test
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-purple-200 hover:bg-white/10"
              onClick={() => navigate('/verify')}
            >
              Verify
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:text-purple-200 hover:bg-white/10"
              onClick={() => navigate('/about')}
            >
              About
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
