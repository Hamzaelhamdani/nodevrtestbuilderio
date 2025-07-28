import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PlusIcon } from "lucide-react";

interface AddStartupFormProps {
  onClose: (addedStartup?: any) => void;
}

// Simple industries list
const INDUSTRIES = [
  "SaaS", 
  "FinTech", 
  "HealthTech", 
  "EdTech", 
  "CleanTech", 
  "E-commerce", 
  "AI/ML", 
  "Other"
];

export function AddStartupForm({ onClose }: AddStartupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    email: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value }));
  };
  
  const handleSubmit = () => {
    // Simple validation
    if (!formData.name || !formData.industry) {
      return;
    }
    
    // Create a basic startup object
    const newStartup = {
      id: `startup-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      website: formData.website,
      industry: formData.industry,
      joinDate: new Date().toISOString()
    };
    
    // Close and return the new startup
    onClose(newStartup);
  };
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Startup</DialogTitle>
          <DialogDescription>
            Add a startup to your portfolio to track and promote
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Startup Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Enter startup name" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="industry">Industry</Label>
            <Select 
              value={formData.industry} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="contact@startup.com" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              name="website" 
              value={formData.website} 
              onChange={handleInputChange} 
              placeholder="https://example.com" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Briefly describe what the startup does"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-chart-4 text-white hover:bg-chart-4/90"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Startup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}