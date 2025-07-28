import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  XIcon,
  ImageIcon,
  StarIcon,
  InfoIcon
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ProductService } from "./ProductServiceCreation";

interface ProductServiceEditProps {
  product: ProductService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: ProductService) => void;
}

export function ProductServiceEdit({ 
  product,
  open,
  onOpenChange,
  onSave
}: ProductServiceEditProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [editedProduct, setEditedProduct] = useState<ProductService>(product);
  
  // Tag input state
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  
  // Specification form state
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  
  // Reset form when product changes
  useEffect(() => {
    setEditedProduct(product);
    setCurrentStep(1);
  }, [product]);
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === "price" || name === "discountedPrice" || name === "inventory" || 
        name === "supportStructureCommission" || 
        name === "subscriptionDetails.trialPeriod" || 
        name === "subscriptionDetails.setupFee") {
      
      if (name.includes("subscriptionDetails")) {
        const field = name.split(".")[1];
        setEditedProduct(prev => ({
          ...prev,
          subscriptionDetails: {
            ...prev.subscriptionDetails,
            [field]: parseFloat(value) || 0
          }
        }));
      } else {
        setEditedProduct(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
      }
    } 
    // Handle billing cycle specifically
    else if (name === "subscriptionDetails.billingCycle") {
      setEditedProduct(prev => ({
        ...prev,
        subscriptionDetails: {
          ...prev.subscriptionDetails,
          billingCycle: value as 'monthly' | 'quarterly' | 'annually'
        }
      }));
    }
    // Handle all other string fields
    else {
      setEditedProduct(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !editedProduct.tags.includes(tagInput.trim())) {
      setEditedProduct(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tag: string) => {
    setEditedProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle feature addition
  const handleAddFeature = () => {
    if (featureInput.trim() && !editedProduct.features?.includes(featureInput.trim())) {
      setEditedProduct(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };
  
  // Handle feature removal
  const handleRemoveFeature = (feature: string) => {
    setEditedProduct(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || []
    }));
  };
  
  // Handle specification addition
  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setEditedProduct(prev => ({
        ...prev,
        specifications: {
          ...(prev.specifications || {}),
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };
  
  // Handle specification removal
  const handleRemoveSpecification = (key: string) => {
    if (!editedProduct.specifications) return;
    
    const updatedSpecs = { ...editedProduct.specifications };
    delete updatedSpecs[key];
    
    setEditedProduct(prev => ({
      ...prev,
      specifications: updatedSpecs
    }));
  };
  
  // Handle image URL addition
  const handleAddImage = (url: string) => {
    if (url.trim() && !editedProduct.images.includes(url.trim())) {
      setEditedProduct(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
    }
  };
  
  // Handle image removal
  const handleRemoveImage = (url: string) => {
    setEditedProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };
  
  // Move to next step
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!editedProduct.name || !editedProduct.description || !editedProduct.category) {
        toast.error("Please fill out all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!editedProduct.price) {
        toast.error("Please enter a price");
        return;
      }
      
      if (editedProduct.type === 'physical' && !editedProduct.inventory) {
        toast.error("Please enter inventory quantity");
        return;
      }
      
      if (editedProduct.type === 'subscription' && !editedProduct.subscriptionDetails?.billingCycle) {
        toast.error("Please select a billing cycle");
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  // Move to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };
  
  // Handle product update
  const handleSaveProduct = () => {
    // Validate final step
    if (!editedProduct.images || editedProduct.images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }
    
    // Update product
    const updatedProduct: ProductService = {
      ...editedProduct,
      updatedAt: new Date().toISOString()
    };
    
    // Call save callback
    onSave(updatedProduct);
    
    // Show success message
    toast.success("Product updated successfully");
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the details of your product or service.
          </DialogDescription>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="relative mb-6 mt-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            <div className={`z-10 flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="text-xs mt-1">Basics</span>
            </div>
            <div className={`z-10 flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className="text-xs mt-1">Pricing</span>
            </div>
            <div className={`z-10 flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className="text-xs mt-1">Details</span>
            </div>
            <div className={`z-10 flex flex-col items-center ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                4
              </div>
              <span className="text-xs mt-1">Images</span>
            </div>
          </div>
        </div>
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={editedProduct.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your product or service"
                    value={editedProduct.description}
                    onChange={handleInputChange}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                    value={editedProduct.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {[
                      "SaaS Tools",
                      "Web Development",
                      "Mobile Apps",
                      "Design Services",
                      "Marketing",
                      "Consulting",
                      "Hardware",
                      "Education",
                      "AI Solutions",
                      "Fintech",
                      "Healthcare",
                      "Other"
                    ].map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-base">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {editedProduct.tags && editedProduct.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editedProduct.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <TrashIcon className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base">Status</Label>
                  <select
                    id="status"
                    name="status"
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                    value={editedProduct.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleNextStep}>
                Next Step
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
        
        {/* Step 2: Pricing */}
        {currentStep === 2 && (
          <>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={editedProduct.price || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice" className="text-base">Sale Price ($)</Label>
                    <Input
                      id="discountedPrice"
                      name="discountedPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={editedProduct.discountedPrice || ""}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty if not on sale
                    </p>
                  </div>
                </div>
                
                {editedProduct.type === 'physical' && (
                  <div className="space-y-2">
                    <Label htmlFor="inventory" className="text-base">Inventory Quantity *</Label>
                    <Input
                      id="inventory"
                      name="inventory"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={editedProduct.inventory || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                {editedProduct.type === 'subscription' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingCycle" className="text-base">Billing Cycle *</Label>
                      <select
                        id="billingCycle"
                        name="subscriptionDetails.billingCycle"
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                        value={editedProduct.subscriptionDetails?.billingCycle || "monthly"}
                        onChange={handleInputChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trialPeriod" className="text-base">Trial Period (days)</Label>
                        <Input
                          id="trialPeriod"
                          name="subscriptionDetails.trialPeriod"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={editedProduct.subscriptionDetails?.trialPeriod || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="setupFee" className="text-base">Setup Fee ($)</Label>
                        <Input
                          id="setupFee"
                          name="subscriptionDetails.setupFee"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={editedProduct.subscriptionDetails?.setupFee || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="supportStructureCommission" className="text-base">Support Structure Commission (%)</Label>
                      <Badge variant={editedProduct.supportStructureCommission > 15 ? "destructive" : "outline"}>
                        {editedProduct.supportStructureCommission}%
                      </Badge>
                    </div>
                    <Input
                      id="supportStructureCommission"
                      name="supportStructureCommission"
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={editedProduct.supportStructureCommission}
                      onChange={handleInputChange}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>10%</span>
                      <span>20%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Percentage commission offered to support structures (incubators, accelerators, etc.) 
                      who help promote and sell your product.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNextStep}>
                Next Step
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
        
        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="features" className="text-base">Key Features</Label>
                    <div className="flex gap-2">
                      <Input
                        id="features"
                        placeholder="Add feature and press Enter"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddFeature} variant="outline">
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {editedProduct.features && editedProduct.features.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {editedProduct.features.map((feature, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                          >
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-primary mr-2" />
                              <span>{feature}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleRemoveFeature(feature)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {(editedProduct.type === 'physical' || editedProduct.type === 'digital') && (
                    <div className="space-y-2">
                      <Label className="text-base">Technical Specifications</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Specification name"
                          value={specKey}
                          onChange={(e) => setSpecKey(e.target.value)}
                        />
                        <Input
                          placeholder="Specification value"
                          value={specValue}
                          onChange={(e) => setSpecValue(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button 
                          type="button" 
                          onClick={handleAddSpecification} 
                          variant="outline"
                          size="sm"
                        >
                          <PlusIcon className="h-4 w-4 mr-1.5" />
                          Add Specification
                        </Button>
                      </div>
                      
                      {editedProduct.specifications && Object.keys(editedProduct.specifications).length > 0 && (
                        <div className="mt-4 border rounded-md overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/30">
                                <th className="px-4 py-2 text-left text-sm font-medium">Specification</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Value</th>
                                <th className="px-4 py-2 text-right text-sm font-medium w-16">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(editedProduct.specifications).map(([key, value]) => (
                                <tr key={key} className="border-t border-border">
                                  <td className="px-4 py-2 text-sm">{key}</td>
                                  <td className="px-4 py-2 text-sm">{value}</td>
                                  <td className="px-4 py-2 text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleRemoveSpecification(key)}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNextStep}>
                Next Step
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
        
        {/* Step 4: Images */}
        {currentStep === 4 && (
          <>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base">Product Images *</Label>
                  <p className="text-sm text-muted-foreground">
                    Add images to showcase your product or service. You can add up to 5 images.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="imageUrl"
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button 
                          type="button" 
                          onClick={(e) => {
                            const input = document.getElementById('imageUrl') as HTMLInputElement;
                            if (input.value) {
                              handleAddImage(input.value);
                              input.value = '';
                            }
                          }} 
                          variant="outline"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add image URLs from Unsplash or other sources
                      </p>
                    </div>
                    
                    {/* Image preview */}
                    {editedProduct.images && editedProduct.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {editedProduct.images.map((image, index) => (
                          <div key={index} className="relative group rounded-md overflow-hidden">
                            <ImageWithFallback
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleRemoveImage(image)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            {index === 0 && (
                              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 border-2 border-dashed border-muted-foreground/25 rounded-md">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            No images added yet
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleSaveProduct}>
                Save Changes
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}