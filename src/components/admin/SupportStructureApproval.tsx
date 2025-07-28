import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CheckIcon, XIcon, ChevronRightIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";

interface SupportStructure {
  id: string;
  name: string;
  logo: string;
  type: string;
  location: string;
  startups: number;
  revenue: string;
  status: "pending" | "approved" | "rejected";
  lastActive: string;
}

interface SupportStructureApprovalProps {
  structures: SupportStructure[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function SupportStructureApproval({ structures, onApprove, onReject }: SupportStructureApprovalProps) {
  const [items, setItems] = useState(structures);
  const [currentDragIndex, setCurrentDragIndex] = useState<number | null>(null);
  const [draggingDirection, setDraggingDirection] = useState<"left" | "right" | null>(null);

  const handleDragEnd = (index: number, direction: number) => {
    setCurrentDragIndex(null);
    setDraggingDirection(null);
    
    const threshold = 100; // Minimum drag distance to trigger action
    
    if (Math.abs(direction) > threshold) {
      const structure = items[index];
      
      if (direction > threshold) {
        // Dragged right - approve
        handleApprove(structure.id);
      } else if (direction < -threshold) {
        // Dragged left - reject
        handleReject(structure.id);
      }
    }
  };

  const handleApprove = (id: string) => {
    // Update local state
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, status: "approved" } : item
      )
    );
    
    // Call parent handler
    onApprove(id);
    
    // Show toast
    toast.success("Support structure approved", {
      description: "The support structure has been approved and notified.",
    });
  };

  const handleReject = (id: string) => {
    // Update local state
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, status: "rejected" } : item
      )
    );
    
    // Call parent handler
    onReject(id);
    
    // Show toast
    toast.error("Support structure rejected", {
      description: "The support structure has been rejected and notified.",
    });
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
        <h3 className="text-xl font-semibold">Support Structure Verification</h3>
        <div className="text-sm text-muted-foreground">
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
        {items.filter(item => item.status === "pending").map((structure, index) => (
          <motion.div
            key={structure.id}
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
                    <AvatarImage src={structure.logo} alt={structure.name} />
                    <AvatarFallback>{structure.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{structure.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Badge variant="outline" className="mr-2 bg-accent/50">{structure.type}</Badge>
                          <span>{structure.location}</span>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex flex-col items-end">
                        <div className="text-sm font-medium">{structure.startups} startups</div>
                        <div className="text-sm text-muted-foreground">Est. revenue: {structure.revenue}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm text-muted-foreground">
                        Last active: {structure.lastActive}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-destructive/30 hover:border-destructive hover:bg-destructive/10 text-destructive"
                          onClick={() => handleReject(structure.id)}
                        >
                          <XIcon className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          className="border-success/30 hover:border-success hover:bg-success/10 text-success"
                          onClick={() => handleApprove(structure.id)}
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
        ))}
        
        {items.filter(item => item.status === "pending").length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <CheckIcon className="h-6 w-6 text-success" />
              </div>
              <h4 className="text-lg font-medium mb-1">All caught up!</h4>
              <p className="text-muted-foreground">There are no pending support structures to review.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {items.some(item => item.status !== "pending") && (
        <>
          <Separator className="my-8" />
          
          <h3 className="text-xl font-semibold mb-4">Recent Actions</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {items.filter(item => item.status !== "pending").map((structure) => (
              <Card key={structure.id} className={structure.status === "approved" ? "border-success/30" : "border-destructive/30"}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={structure.logo} alt={structure.name} />
                      <AvatarFallback>{structure.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{structure.name}</h4>
                        <Badge variant={structure.status === "approved" ? "outline" : "destructive"}>
                          {structure.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{structure.type} • {structure.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}