import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Button } from "../ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { 
  BuildingIcon, 
  CheckIcon, 
  XIcon, 
  InfoIcon, 
  PieChartIcon, 
  UsersIcon, 
  CalendarIcon, 
  BarChart3Icon,
  HandshakeIcon,
  BellIcon,
  PercentIcon,
  SettingsIcon,
  LockIcon,
  UnlockIcon,
  TrashIcon,
  AlertCircleIcon,
  ShieldIcon
} from "lucide-react";
import { toast } from "sonner";

// Mock data for support structures
interface SupportStructure {
  id: string;
  name: string;
  logo: string;
  type: "Incubator" | "Accelerator" | "VC" | "Angel Group";
  status: "pending" | "approved" | "rejected";
  proposalDate: string;
  proposedCommission: number;
  actualCommission?: number;
  description: string;
  startups?: number;
  investmentRange?: string;
  website?: string;
}

// Mock data for support structures
const SUPPORT_STRUCTURES: SupportStructure[] = [
  {
    id: "ss1",
    name: "TechStars",
    logo: "https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=75&auto=format&fit=crop",
    type: "Accelerator",
    status: "approved",
    proposalDate: "2025-01-15",
    proposedCommission: 8,
    actualCommission: 6.5,
    description: "Top-tier global accelerator with extensive network and mentorship program.",
    startups: 500,
    investmentRange: "$120K-$250K",
    website: "https://techstars.com"
  },
  {
    id: "ss2",
    name: "FutureVentures",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=75&auto=format&fit=crop",
    type: "VC",
    status: "pending",
    proposalDate: "2025-05-10",
    proposedCommission: 10,
    description: "Early-stage venture capital firm focused on SaaS and AI startups.",
    startups: 45,
    investmentRange: "$500K-$2M",
    website: "https://futureventures-example.com"
  },
  {
    id: "ss3",
    name: "Founder Factory",
    logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=75&auto=format&fit=crop",
    type: "Incubator",
    status: "pending",
    proposalDate: "2025-05-17",
    proposedCommission: 7.5,
    description: "Startup incubator that helps founders from idea to seed round.",
    startups: 120,
    investmentRange: "$50K-$150K",
    website: "https://founderfactory-example.com"
  },
  {
    id: "ss4",
    name: "Angel Alliance",
    logo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=75&auto=format&fit=crop",
    type: "Angel Group",
    status: "approved",
    proposalDate: "2025-02-25",
    proposedCommission: 6,
    actualCommission: 5.5,
    description: "Alliance of experienced angel investors with industry expertise.",
    startups: 85,
    investmentRange: "$100K-$500K",
    website: "https://angelalliance-example.com"
  },
  {
    id: "ss5",
    name: "GrowthLabs",
    logo: "https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=75&auto=format&fit=crop",
    type: "Accelerator",
    status: "rejected",
    proposalDate: "2025-04-05",
    proposedCommission: 12,
    description: "Specialized accelerator focusing on growth-stage startups.",
    startups: 35,
    investmentRange: "$250K-$1M",
    website: "https://growthlabs-example.com"
  }
];

interface SupportStructureManagementProps {
  user: any;
}

export function SupportStructureManagement({ user }: SupportStructureManagementProps) {
  // State for managing support structures
  const [supportStructures, setSupportStructures] = useState<SupportStructure[]>(SUPPORT_STRUCTURES);
  const [selectedStructure, setSelectedStructure] = useState<SupportStructure | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [commissionValue, setCommissionValue] = useState<string>("");
  const [rejectReason, setRejectReason] = useState<string>("");
  
  // Filter structures by status
  const pendingStructures = supportStructures.filter(ss => ss.status === "pending");
  const approvedStructures = supportStructures.filter(ss => ss.status === "approved");
  const rejectedStructures = supportStructures.filter(ss => ss.status === "rejected");
  
  // Calculate total commission percentage
  const totalCommission = approvedStructures.reduce((sum, ss) => sum + (ss.actualCommission || 0), 0);
  
  // Handle showing support structure details
  const showStructureDetails = (structure: SupportStructure) => {
    setSelectedStructure(structure);
    setIsDetailsDialogOpen(true);
  };
  
  // Handle opening approve dialog
  const openApproveDialog = (structure: SupportStructure) => {
    setSelectedStructure(structure);
    setCommissionValue(structure.proposedCommission.toString());
    setIsApproveDialogOpen(true);
  };
  
  // Handle opening reject dialog
  const openRejectDialog = (structure: SupportStructure) => {
    setSelectedStructure(structure);
    setRejectReason("");
    setIsRejectDialogOpen(true);
  };
  
  // Handle opening remove dialog
  const openRemoveDialog = (structure: SupportStructure) => {
    setSelectedStructure(structure);
    setIsRemoveDialogOpen(true);
  };
  
  // Handle approving a support structure
  const handleApproveStructure = () => {
    if (!selectedStructure) return;
    
    const commission = parseFloat(commissionValue);
    if (isNaN(commission) || commission <= 0 || commission > 20) {
      toast.error("Please enter a valid commission between 0.1% and 20%");
      return;
    }
    
    // Check if total commission would exceed 20%
    const otherCommissions = approvedStructures
      .filter(ss => ss.id !== selectedStructure.id)
      .reduce((sum, ss) => sum + (ss.actualCommission || 0), 0);
      
    if (otherCommissions + commission > 20) {
      toast.error("Total commission cannot exceed 20%. Please adjust the value.");
      return;
    }
    
    // Update the support structure's status and commission
    setSupportStructures(prev => 
      prev.map(ss => 
        ss.id === selectedStructure.id 
          ? { 
              ...ss, 
              status: "approved", 
              actualCommission: commission 
            } 
          : ss
      )
    );
    
    toast.success(`Approved partnership with ${selectedStructure.name}`, {
      description: `Commission set at ${commission}%`
    });
    
    setIsApproveDialogOpen(false);
  };
  
  // Handle rejecting a support structure
  const handleRejectStructure = () => {
    if (!selectedStructure) return;
    
    // Update the support structure's status
    setSupportStructures(prev => 
      prev.map(ss => 
        ss.id === selectedStructure.id 
          ? { 
              ...ss, 
              status: "rejected"
            } 
          : ss
      )
    );
    
    toast.success(`Rejected partnership with ${selectedStructure.name}`);
    setIsRejectDialogOpen(false);
  };
  
  // Handle removing a support structure
  const handleRemoveStructure = () => {
    if (!selectedStructure) return;
    
    // Update the support structures list
    setSupportStructures(prev => 
      prev.filter(ss => ss.id !== selectedStructure.id)
    );
    
    toast.success(`Removed ${selectedStructure.name} from your partnerships`);
    setIsRemoveDialogOpen(false);
  };
  
  // Handle updating a commission split
  const handleUpdateCommission = (id: string, commission: number) => {
    // Validate commission
    if (isNaN(commission) || commission <= 0 || commission > 20) {
      toast.error("Please enter a valid commission between 0.1% and 20%");
      return;
    }
    
    // Check if total commission would exceed 20%
    const otherCommissions = approvedStructures
      .filter(ss => ss.id !== id)
      .reduce((sum, ss) => sum + (ss.actualCommission || 0), 0);
      
    if (otherCommissions + commission > 20) {
      toast.error("Total commission cannot exceed 20%. Please adjust the value.");
      return;
    }
    
    // Update the support structure's commission
    setSupportStructures(prev => 
      prev.map(ss => 
        ss.id === id 
          ? { 
              ...ss, 
              actualCommission: commission 
            } 
          : ss
      )
    );
    
    toast.success("Commission updated successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BuildingIcon className="h-5 w-5 text-primary" />
                Support Structure Partnerships
              </CardTitle>
              <CardDescription>
                Manage your support structure partnerships and commission splits
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-muted/30 rounded-md">
              <span className="text-muted-foreground">Current Commission:</span>
              <span className="font-medium">{totalCommission.toFixed(1)}%</span>
              <span className="text-muted-foreground">of 20% max</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="approved" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="approved" className="relative">
                Approved
                {approvedStructures.length > 0 && (
                  <Badge className="ml-2 bg-primary/20 text-primary border-primary/30">
                    {approvedStructures.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingStructures.length > 0 && (
                  <Badge className="ml-2 bg-warning/20 text-warning border-warning/30">
                    {pendingStructures.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="relative">
                Rejected
                {rejectedStructures.length > 0 && (
                  <Badge className="ml-2 bg-destructive/20 text-destructive border-destructive/30">
                    {rejectedStructures.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Approved tab */}
            <TabsContent value="approved" className="pt-4">
              {approvedStructures.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                    <BuildingIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No approved partnerships</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                    You don't have any approved support structures yet. Approve pending proposals to establish partnerships.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Support Structure</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedStructures.map((structure) => (
                        <TableRow key={structure.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 rounded-md">
                                <AvatarImage src={structure.logo} alt={structure.name} />
                                <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                                  {structure.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{structure.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Approved on {new Date(structure.proposalDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-muted/30">
                              {structure.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0.1"
                                max="20"
                                step="0.1"
                                className="w-16 h-7 text-sm"
                                value={structure.actualCommission}
                                onChange={(e) => {
                                  const newValue = parseFloat(e.target.value);
                                  handleUpdateCommission(structure.id, newValue);
                                }}
                              />
                              <span className="text-muted-foreground">%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => showStructureDetails(structure)}
                              >
                                <InfoIcon className="h-4 w-4" />
                                <span className="sr-only">Details</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => openRemoveDialog(structure)}
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      <div className="flex items-center justify-between px-1 py-2">
                        <div className="text-sm text-muted-foreground">
                          {approvedStructures.length} approved partnership{approvedStructures.length !== 1 && 's'}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Total commission:</span>
                          <Badge variant={totalCommission > 15 ? "destructive" : "outline"}>
                            {totalCommission.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </TableCaption>
                  </Table>
                </div>
              )}
              
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    Commission is split among your support structure partners. The total commission cannot exceed 20% of your sales. 
                    Adjust individual percentages to manage how commissions are distributed.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Pending tab */}
            <TabsContent value="pending" className="pt-4">
              {pendingStructures.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                    <HandshakeIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No pending proposals</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    You don't have any pending partnership proposals from support structures.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingStructures.map((structure) => (
                    <Card key={structure.id} className="overflow-hidden border-warning/30">
                      <div className="bg-warning/10 px-4 py-1 text-xs font-medium text-warning border-b border-warning/20">
                        Partnership Proposal
                      </div>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <Avatar className="h-12 w-12 rounded-md">
                            <AvatarImage src={structure.logo} alt={structure.name} />
                            <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                              {structure.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <h3 className="font-medium">{structure.name}</h3>
                              <Badge variant="outline" className="bg-muted/30 text-xs">
                                {structure.type}
                              </Badge>
                            </div>
                            
                            <p className="text-sm mb-2">
                              {structure.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                <span>Received {new Date(structure.proposalDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <UsersIcon className="h-3.5 w-3.5" />
                                <span>{structure.startups} startups</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <PercentIcon className="h-3.5 w-3.5" />
                                <span>Proposed commission: {structure.proposedCommission}%</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Button
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={() => showStructureDetails(structure)}
                              >
                                <InfoIcon className="h-3.5 w-3.5 mr-1.5" />
                                View Details
                              </Button>
                              <Button
                                variant="destructive" 
                                size="sm"
                                className="h-8"
                                onClick={() => openRejectDialog(structure)}
                              >
                                <XIcon className="h-3.5 w-3.5 mr-1.5" />
                                Reject
                              </Button>
                              <Button
                                variant="default" 
                                size="sm"
                                className="h-8"
                                onClick={() => openApproveDialog(structure)}
                              >
                                <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Rejected tab */}
            <TabsContent value="rejected" className="pt-4">
              {rejectedStructures.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                    <XIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No rejected proposals</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    You haven't rejected any partnership proposals.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Support Structure</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Proposed Commission</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedStructures.map((structure) => (
                        <TableRow key={structure.id} className="opacity-70">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 rounded-md">
                                <AvatarImage src={structure.logo} alt={structure.name} />
                                <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                                  {structure.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{structure.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Rejected on {new Date(structure.proposalDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-muted/30">
                              {structure.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {structure.proposedCommission}%
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => showStructureDetails(structure)}
                              >
                                <InfoIcon className="h-4 w-4" />
                                <span className="sr-only">Details</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => openApproveDialog(structure)}
                              >
                                Reconsider
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Support Structure Details Dialog */}
      {selectedStructure && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Support Structure Details</DialogTitle>
              <DialogDescription>
                Information about {selectedStructure.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-md">
                  <AvatarImage src={selectedStructure.logo} alt={selectedStructure.name} />
                  <AvatarFallback className="rounded-md bg-primary/10 text-primary text-xl">
                    {selectedStructure.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-lg font-medium">{selectedStructure.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="bg-muted/30 text-xs">
                      {selectedStructure.type}
                    </Badge>
                    <Badge variant={
                      selectedStructure.status === "approved" ? "secondary" :
                      selectedStructure.status === "pending" ? "outline" : "destructive"
                    } className="text-xs">
                      {selectedStructure.status.charAt(0).toUpperCase() + selectedStructure.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="text-sm mt-1">{selectedStructure.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">Startups Supported</Label>
                    <p className="text-sm mt-1">{selectedStructure.startups}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Investment Range</Label>
                    <p className="text-sm mt-1">{selectedStructure.investmentRange}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Proposed Commission</Label>
                    <p className="text-sm mt-1">{selectedStructure.proposedCommission}%</p>
                  </div>
                  {selectedStructure.status === "approved" && (
                    <div>
                      <Label className="text-muted-foreground text-xs">Actual Commission</Label>
                      <p className="text-sm mt-1">{selectedStructure.actualCommission}%</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground text-xs">Proposal Date</Label>
                    <p className="text-sm mt-1">{new Date(selectedStructure.proposalDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Website</Label>
                    <p className="text-sm mt-1 truncate">
                      <a 
                        href={selectedStructure.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedStructure.website}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsDialogOpen(false)}
              >
                Close
              </Button>
              
              {selectedStructure.status === "pending" && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      openRejectDialog(selectedStructure);
                    }}
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      openApproveDialog(selectedStructure);
                    }}
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
              
              {selectedStructure.status === "approved" && (
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    openRemoveDialog(selectedStructure);
                  }}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Remove Partnership
                </Button>
              )}
              
              {selectedStructure.status === "rejected" && (
                <Button 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    openApproveDialog(selectedStructure);
                  }}
                >
                  Reconsider Proposal
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Approve Dialog */}
      {selectedStructure && (
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Approve Partnership</DialogTitle>
              <DialogDescription>
                Set commission percentage for {selectedStructure.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-md">
                  <AvatarImage src={selectedStructure.logo} alt={selectedStructure.name} />
                  <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                    {selectedStructure.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedStructure.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedStructure.type} • Proposed commission: {selectedStructure.proposedCommission}%
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="commission">Commission Percentage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="commission"
                    type="number"
                    min="0.1"
                    max="20"
                    step="0.1"
                    className="flex-1"
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(e.target.value)}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-start gap-2">
                  <InfoIcon className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    Current total commission: {totalCommission.toFixed(1)}%.
                    {totalCommission > 0 && " Commission is split among your partners."}
                    Maximum allowed: 20%.
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsApproveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApproveStructure}
              >
                Approve Partnership
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Reject Dialog */}
      {selectedStructure && (
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Partnership Proposal</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject the proposal from {selectedStructure.name}?
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-md">
                  <AvatarImage src={selectedStructure.logo} alt={selectedStructure.name} />
                  <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                    {selectedStructure.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedStructure.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedStructure.type} • Proposed commission: {selectedStructure.proposedCommission}%
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="rejectReason">Reason for rejection (optional)</Label>
                <textarea
                  id="rejectReason"
                  className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm"
                  placeholder="Provide a reason for rejecting this proposal..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleRejectStructure}
              >
                Reject Proposal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Remove Partnership Dialog */}
      {selectedStructure && (
        <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Partnership</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {selectedStructure.name} from your partnerships?
                This will end your commission-sharing arrangement with them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-2">
              <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <AlertCircleIcon className="h-5 w-5 text-destructive" />
                <div className="text-sm">
                  <span className="font-medium">Warning:</span> This action cannot be undone.
                  The support structure will need to send a new proposal to re-establish partnership.
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleRemoveStructure}
              >
                Remove Partnership
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}