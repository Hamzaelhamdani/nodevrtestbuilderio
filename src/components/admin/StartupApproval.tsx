import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CheckIcon, XIcon, ChevronRightIcon, ThumbsUpIcon, ThumbsDownIcon, ExternalLinkIcon } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";

// Update interface to match API response
interface PendingStartup {
  id: number;
  email: string;
  displayName: string;
  telephone: string;
  country: string;
  role: string;
  isApproved: boolean;
  logoPath: string;
}

interface StartupApprovalProps {
  onView?: (id: number) => void;
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
}

export function StartupApproval({ onView }: StartupApprovalProps) {
  const [items, setItems] = useState<PendingStartup[]>([]);
  const [currentDragIndex, setCurrentDragIndex] = useState<number | null>(null);
  const [draggingDirection, setDraggingDirection] = useState<"left" | "right" | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Add fetch function
  const fetchPendingStartups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5139/api/Admin/pending-startups', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch pending startups');
      const data = await response.json();
      setItems(data || []); // Ensure we set an empty array if no data
    } catch (error) {
      console.error('Error fetching startups:', error);
      setItems([]); // Set empty array on error
      toast.error('Failed to load pending startups');
    }
  };

  // Handle approve/reject with optimistic updates
  const handleApprove = async (id: number) => {
    try {
      setLoading(true);
      // Optimistically remove from UI
      setItems(prev => prev.filter(item => item.id !== id));
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5139/api/Admin/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        // Revert on error
        await fetchPendingStartups();
        throw new Error('Failed to approve startup');
      }
      
      toast.success('Startup approved successfully');
    } catch (error) {
      console.error('Error approving startup:', error);
      toast.error('Failed to approve startup');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setLoading(true);
      // Optimistically remove from UI
      setItems(prev => prev.filter(item => item.id !== id));
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5139/api/Admin/reject/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        // Revert on error
        await fetchPendingStartups();
        throw new Error('Failed to reject startup');
      }
      
      toast.error('Startup rejected');
    } catch (error) {
      console.error('Error rejecting startup:', error);
      toast.error('Failed to reject startup');
    } finally {
      setLoading(false);
    }
  };

  // Fetch startups on mount and set up refresh interval
  useEffect(() => {
    fetchPendingStartups();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingStartups, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (index: number, direction: number) => {
    setCurrentDragIndex(null);
    setDraggingDirection(null);
    
    const threshold = 100; // Minimum drag distance to trigger action
    
    if (Math.abs(direction) > threshold) {
      const startup = items[index];
      
      if (direction > threshold) {
        // Dragged right - approve
        handleApprove(startup.id);
      } else if (direction < -threshold) {
        // Dragged left - reject
        handleReject(startup.id);
      }
    }
  };

  const getSwipeHintColor = (direction: "left" | "right" | null, index: number) => {
    if (currentDragIndex !== index) return "bg-transparent";
    
    if (direction === "right") {
      return "bg-success/10 border-success/20";
    }
    
    if (direction === "left") {
      return "bg-destructive/10 border-destructive/20";
    }
    
    return "bg-transparent";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Startup Registration Approval</h3>
        <div className="text-sm text-muted-foreground hidden sm:flex items-center">
          <span className="inline-flex items-center mr-4">
            <span className="bg-green-500/20 w-2 h-2 rounded-full mr-1"></span> 
            Swipe right to approve
          </span>
          <span className="inline-flex items-center">
            <span className="bg-destructive/20 w-2 h-2 rounded-full mr-1"></span> 
            Swipe left to reject
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.length > 0 ? (
          items.map((startup, index) => (
            <motion.div
              key={startup.id}
              className="relative overflow-hidden"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={() => setCurrentDragIndex(index)}
              onDrag={(_, info) => {
                if (info.offset.x > 50) {
                  setDraggingDirection("right");
                } else if (info.offset.x < -50) {
                  setDraggingDirection("left");
                } else {
                  setDraggingDirection(null);
                }
              }}
              onDragEnd={(_, info) => handleDragEnd(index, info.offset.x)}
            >
              <div className={`absolute inset-0 flex items-center px-8 transition-opacity duration-200 ${
                currentDragIndex === index && draggingDirection === "right" 
                  ? "opacity-100" 
                  : "opacity-0"
              }`}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-success/20 text-success">
                  <ThumbsUpIcon className="h-6 w-6" />
                </div>
                <div className="ml-4 text-success font-medium">Approve</div>
              </div>
              
              <div className={`absolute inset-0 flex items-center justify-end px-8 transition-opacity duration-200 ${
                currentDragIndex === index && draggingDirection === "left" 
                  ? "opacity-100" 
                  : "opacity-0"
              }`}>
                <div className="text-destructive font-medium mr-4">Reject</div>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/20 text-destructive">
                  <ThumbsDownIcon className="h-6 w-6" />
                </div>
              </div>
              
              <Card className={`border ${getSwipeHintColor(draggingDirection, index)}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border">
                      <AvatarImage 
                        src={`http://localhost:5139${startup.logoPath}`} 
                        alt={startup.displayName} 
                      />
                      <AvatarFallback>
                        {startup.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{startup.displayName}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Badge variant="outline" className="mr-2 bg-accent/50">
                              {startup.role}
                            </Badge>
                            <span>{startup.country}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-muted-foreground">
                          Contact: {startup.telephone}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-destructive/30 hover:border-destructive hover:bg-destructive/10 text-destructive"
                            onClick={() => handleReject(startup.id)}
                            disabled={loading}
                          >
                            <XIcon className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            className="border-success/30 hover:border-success hover:bg-success/10 text-success"
                            onClick={() => handleApprove(startup.id)}
                            disabled={loading}
                          >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <CheckIcon className="h-6 w-6 text-success" />
              </div>
              <h4 className="text-lg font-medium mb-1">All caught up!</h4>
              <p className="text-muted-foreground">There are no pending startups to review.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}