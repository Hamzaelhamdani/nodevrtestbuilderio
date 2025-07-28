import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  BoxIcon,
  FileIcon,
  HeadphonesIcon,
  Code2Icon,
  ShoppingBagIcon,
  TagIcon,
  PackageIcon,
  CalendarIcon,
  ClockIcon,
  ImageIcon,
  TrashIcon,
  GlobeIcon,
  SendIcon,
  InfoIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PercentIcon,
  StoreIcon,
  BriefcaseIcon,
  StarIcon,
  ArrowUpIcon,
  LightbulbIcon,
  CreditCardIcon,
  RepeatIcon,
  CodeIcon,
  BarChartIcon,
  PenToolIcon,
  MegaphoneIcon,
  ActivityIcon,
  BrainIcon,
  BuildingIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  DollarSignIcon
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";

// Update JWT interface to match the actual token structure
interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  exp: number;
  iss: string;
  aud: string;
}

// Update interfaces to match API exactly
interface ProductResponse {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  type: ProductType;
  sellerId: string;
  images: string[];
  createdByUserId: string;
  originalPrice: number;
  discountedPrice: number;
}

type ProductType = 'product' | 'service';

interface ProductServiceCreationProps {
  limit?: number;
  showHeader?: boolean;
  onProductCreated?: (product: ProductService) => void;
}

// Add missing interfaces
interface ProductFormState {
  name: string;
  description: string;
  type: ProductType;
  price: number;
  categoryId: string;
  sellerId: string;
  imagePreview?: string;
  images?: string[];
}

interface ProductService {
  id: string | number;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  categoryId: string;
  sellerId: string;
  images: string[];
  createdByUserId: string;
  originalPrice?: number;
  discountedPrice?: number;
  category?: string;
  createdAt?: string;
}

export function ProductServiceCreation({
  limit,
  showHeader = true,
  onProductCreated
}: ProductServiceCreationProps) {
  // Define categories inside component to avoid global scope issues
  const CATEGORIES = [
    { name: "SaaS Tools", icon: CodeIcon, description: "Software as a Service applications" },
    { name: "Web Development", icon: GlobeIcon, description: "Website and web application development" },
    { name: "Mobile Apps", icon: ShoppingBagIcon, description: "iOS, Android and cross-platform applications" },
    { name: "Design Services", icon: PenToolIcon, description: "UI/UX, graphic design and branding services" },
    { name: "Marketing", icon: MegaphoneIcon, description: "Marketing, advertising and promotion services" },
    { name: "Consulting", icon: BriefcaseIcon, description: "Business, technology and strategic consulting" },
    { name: "Hardware", icon: BoxIcon, description: "Physical tech products and devices" },
    { name: "Education", icon: GraduationCapIcon, description: "Courses, tutorials and educational content" },
    { name: "AI Solutions", icon: BrainIcon, description: "Artificial intelligence and machine learning" },
    { name: "Fintech", icon: DollarSignIcon, description: "Financial technology products and services" },
    { name: "Healthcare", icon: HeartPulseIcon, description: "Health tech and medical solutions" },
    { name: "Other", icon: TagIcon, description: "Other product or service types" }
  ] as const;

  // Remove unused states
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ProductType>('product');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductService[]>([]);
  // Add state for startup info
  const [startupInfo, setStartupInfo] = useState<{
    id: string;
    email: string;
    role: string;
    name: string;
  } | null>(null);

  // Simplify form state to match API
  const [newProduct, setNewProduct] = useState<ProductFormState>({
    name: "",
    description: "",
    type: "product",
    price: 0,
    categoryId: "",
    sellerId: "string"
  });

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle dialog opening
  const handleOpenDialog = () => {
    // Reset form state when opening dialog
    setNewProduct({
      name: "",
      description: "",
      type: "product",
      price: 0,
      categoryId: "",
      sellerId: "string"
    });
    setCurrentStep(1);
    setSelectedType('product');
    setShowDialog(true);
  };

  // Handle dialog closing
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  // Handle type selection
  const handleTypeSelect = (type: ProductType) => {
    setSelectedType(type);
    setNewProduct((prev: ProductFormState) => ({
      ...prev,
      type
    }));
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "price" || name === "discountedPrice" || name === "inventory" ||
        name === "supportStructureCommission") {
      setNewProduct(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle category selection using ShadCN's Select component
  const handleCategoryChange = (value: string) => {
    setNewProduct(prev => ({ ...prev, categoryId: value }));
  };

  // Get user ID from JWT
  const getUserId = (): string => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode<JwtPayload>(token);
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  };

  // Add function to decode and validate token
  const getTokenInfo = () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Retrieved token:', token); // Debug log

      if (!token) {
        throw new Error('No authentication token found - please login');
      }

      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Decoded token:', decoded); // Debug log
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        throw new Error('Your session has expired - please login again');
      }

      // Validate role is startup
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role !== 'startup') {
        throw new Error('Unauthorized - only startups can manage products');
      }

      return {
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        role: role,
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      };
    } catch (error) {
      console.error('Token validation error:', error);
      // Redirect to login if token is invalid
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
  };

  // Fetch user's products on mount
  const fetchUserProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching products with token:', token);
      const response = await fetch('http://localhost:5139/api/Product/my-products', {
        headers:
         {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(errorText || 'Failed to fetch products');
      }

      const data = await response.json();
      console.log('Products fetched:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
      toast.error('Failed to load products');
    }
  };

  // Fetch products on mount
  React.useEffect(() => {
    const startup = getTokenInfo();
    if (startup) {
      setStartupInfo(startup);
      fetchUserProducts();
    } else {
      // Show login required message
      setError('Please login as a startup to manage products');
      // Optional: Redirect to login
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
  }, []);

  // Update create product handler to match API exactly
  const handleCreateProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const startup = getTokenInfo();
      if (!startup) {
        throw new Error('Invalid startup session');
      }

      const formData = new FormData();
      formData.append('Name', newProduct.name);
      formData.append('Description', newProduct.description);
      formData.append('Type', newProduct.type);
      formData.append('Price', newProduct.price.toString());
      formData.append('CategoryId', 'string'); // API expects "string"
      formData.append('SellerId', 'string'); // API expects "string"

      if (selectedFile) {
        formData.append('ImageFile', selectedFile);
      }

      console.log('Creating product with data:', {
        name: newProduct.name,
        description: newProduct.description,
        type: newProduct.type,
        price: newProduct.price,
        categoryId: 'string',
        sellerId: 'string',
        hasImage: !!selectedFile
      });

      const response = await fetch('http://localhost:5139/api/Product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseText = await response.text();
      console.log('API Response:', response.status, responseText);

      if (!response.ok) {
        throw new Error(responseText || 'Failed to create product');
      }

      const result = JSON.parse(responseText);
      console.log('Product created:', result);

      toast.success(result.message || 'Product created successfully');
      handleCloseDialog();
      fetchUserProducts(); // Refresh products list

      if (onProductCreated) {
        onProductCreated(result.product);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to create product');
      toast.error(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products if limit is specified
  const displayProducts = limit ? products.slice(0, limit) : products;

  // Find the selected category object with error handling
  const getCategoryIcon = (categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || TagIcon;
  };

  // Update product type cards to only show product and service
  const productTypes = [
    {
      type: 'product' as ProductType,
      title: 'Physical Product',
      description: 'Tangible items that require shipping',
      icon: BoxIcon
    },
    {
      type: 'service' as ProductType,
      title: 'Service',
      description: 'Consulting, development, or other services',
      icon: HeadphonesIcon
    }
  ];

  // Product type display helper
  const productTypeDisplay = (type: ProductType): string => {
    return type === 'product' ? 'Product' : 'Service';
  };

  // Add step navigation handlers
  const handleNextStep = () => {
    if (currentStep === 1 && (!newProduct.name || !newProduct.description || !newProduct.type || !newProduct.categoryId)) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (currentStep === 2 && !newProduct.price) {
      toast.error('Please enter a price');
      return;
    }

    // Skip step 3 (Details) and go directly to step 4 (Images) after Pricing
    if (currentStep === 2) {
      setCurrentStep(4);
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Update file selection handler with preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({
        ...prev,
        imagePreview: previewUrl
      }));
    }
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (newProduct.imagePreview) {
        URL.revokeObjectURL(newProduct.imagePreview);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {showHeader && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Your Products & Services</h3>
            <p className="text-sm text-muted-foreground">Manage your offerings and reach new customers</p>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleOpenDialog}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <ImageWithFallback
                src={`http://localhost:5139${product.images[0] || ""}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-primary text-white">
                {product.type === 'product' ? 'Product' : 'Service'}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                ${product.discountedPrice}
                {product.originalPrice !== product.discountedPrice && (
                  <span className="ml-2 text-sm line-through text-muted-foreground">
                    ${product.originalPrice}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Creation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Product or Service</DialogTitle>
            <DialogDescription>
              Create a new product or service to showcase on your storefront.
            </DialogDescription>
          </DialogHeader>

          {/* Step indicator */}
          <div className="relative mb-6 mt-2">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              {/* Step 1: Basics */}
              <div className={`z-10 flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <span className="text-xs mt-1">Basics</span>
              </div>
              
              {/* Step 2: Pricing */}
              <div className={`z-10 flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <span className="text-xs mt-1">Pricing</span>
              </div>
              
              {/* Step 4: Images */}
              <div className={`z-10 flex flex-col items-center ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  3
                </div>
                <span className="text-xs mt-1">Images</span>
              </div>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product-type" className="text-base mb-2 block">Product Type</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {productTypes.map((type) => (
                          <Card
                            key={type.type}
                            className={`cursor-pointer transition-all hover:border-primary ${
                              selectedType === type.type ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => handleTypeSelect(type.type)}
                          >
                            <CardContent className="p-4 flex flex-col items-center text-center">
                              {React.createElement(type.icon, {
                                className: `h-8 w-8 mb-2 ${
                                  selectedType === type.type ? 'text-primary' : ''
                                }`,
                                "aria-hidden": true
                              })}
                              <h4 className="text-sm font-medium">{type.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your product or service"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-base">Category *</Label>
                      <Select
                        value={newProduct.categoryId}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger id="category" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {CATEGORIES.map(category => (
                              <SelectItem
                                key={category.name}
                                value={category.name}
                                className="flex items-center cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  {React.createElement(category.icon, {
                                    className: "h-4 w-4 text-primary mr-2",
                                    "aria-hidden": true
                                  })}
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {newProduct.categoryId && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {CATEGORIES.find(c => c.name === newProduct.categoryId)?.description || ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
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
                        value={newProduct.price || ""}
                        onChange={handleInputChange}
                      />
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

          {/* Step 4: Images */}
          {currentStep === 4 && (
            <>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base">Product Images *</Label>
                    <p className="text-sm text-muted-foreground">
                      Select an image to showcase your product or service.
                    </p>

                    <div className="grid grid-cols-1 gap-4 mt-4">
                      <div className="space-y-2">
                        <Input
                          id="imageFile"
                          name="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                        />
                        {selectedFile && (
                          <p className="text-sm text-muted-foreground">
                            Selected file: {selectedFile.name}
                          </p>
                        )}
                      </div>

                      {/* Image preview */}
                      {newProduct.imagePreview ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img
                            src={newProduct.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              URL.revokeObjectURL(newProduct.imagePreview!);
                              setNewProduct(prev => ({ ...prev, imagePreview: undefined }));
                              setSelectedFile(null);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-40 border-2 border-dashed border-muted-foreground/25 rounded-md">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              No image selected
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-md border border-border">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Product Preview</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Here's how your product will appear in the marketplace. Make sure all information is accurate before publishing.
                        </p>

                        {/* Mini product preview */}
                        {newProduct.name && (
                          <div className="mt-4 border border-border rounded-md p-3 bg-background">
                            <div className="flex items-start gap-3">
                              <div className="relative h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                                {newProduct.images && newProduct.images.length > 0 ? (
                                  <ImageWithFallback
                                    src={newProduct.images[0]}
                                    alt={newProduct.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <h4 className="font-medium text-sm truncate">{newProduct.name}</h4>
                                  <span className="text-sm font-bold">${newProduct.price || 0}</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {newProduct.description || "No description provided"}
                                </p>
                                {newProduct.categoryId && (
                                  <div className="flex items-center mt-2">
                                    {React.createElement(getCategoryIcon(newProduct.categoryId), {
                                      className: "h-3.5 w-3.5 text-primary mr-1.5",
                                      "aria-hidden": "true"
                                    })}
                                    <Badge variant="outline" className="text-xs">
                                      {newProduct.categoryId}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={handleCreateProduct}>
                  Create Product
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}