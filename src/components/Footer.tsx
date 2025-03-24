
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-6">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KhetSeva. All rights reserved.
            </p>
          </div>
          
          <nav className="flex space-x-6">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link 
              to="/settings" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
