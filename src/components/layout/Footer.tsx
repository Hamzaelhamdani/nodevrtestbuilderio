import { Logo } from "./Logo";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { GithubIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo and description */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">
              A marketplace platform connecting startups with clients and support structures.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <TwitterIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <LinkedinIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <GithubIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                <YoutubeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Column 2: For Startups */}
          <div>
            <h4 className="font-semibold mb-4">For Startups</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Create Storefront
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Join VentureRoom Club
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Find Support
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Resources
                </Button>
              </li>
            </ul>
          </div>
          
          {/* Column 3: For Support Structures */}
          <div>
            <h4 className="font-semibold mb-4">For Support Structures</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Register as Incubator
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Startup Management
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Commission Structure
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Success Stories
                </Button>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  About Us
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Careers
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Blog
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                  Contact
                </Button>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} VenturesRoom. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
              Terms of Service
            </Button>
            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Button>
            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
              Cookie Policy
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}