
import { useState } from "react";
import { 
  PackageIcon, 
  Briefcase, 
  ImageIcon, 
  TagIcon, 
  DollarSignIcon, 
  ListIcon,
  X,
  ArrowLeft,
  ShoppingBag,
  Calendar,
  Star,
  Share,
  CircleDollarSign,
  Users,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProductData, ServiceData } from "./ProductServiceEdit";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Discount {
  type: "none" | "percentage" | "fixed";
  value: number;
}

interface ProductServiceViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ProductData | ServiceData;
  type: "product" | "service";
  onEdit?: () => void;
}

export function ProductServiceView({ 
  open, 
  onOpenChange, 
  data, 
  type,
  onEdit
}: ProductServiceViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "reviews">("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Calculate final price after discount
  const calculateDiscountedPrice = (basePrice: number, discount: Discount): [number, number] => {
    if (discount.type === "none" || discount.value <= 0) {
      return [0, basePrice];
    }
    
    let discountAmount = 0;
    let finalPrice = basePrice;
    
    if (discount.type === "percentage") {
      // Cap percentage at 100%
      const cappedPercentage = Math.min(discount.value, 100);
      discountAmount = (basePrice * cappedPercentage) / 100;
      finalPrice = basePrice - discountAmount;
    } else if (discount.type === "fixed") {
      // Cap fixed discount at base price
      discountAmount = Math.min(discount.value, basePrice);
      finalPrice = basePrice - discountAmount;
    }
    
    return [discountAmount, finalPrice];
  };
  
  // Next image in the carousel
  const nextImage = () => {
    if (data && data.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.images.length);
    }
  };
  
  // Previous image in the carousel
  const prevImage = () => {
    if (data && data.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + data.images.length) % data.images.length);
    }
  };

  // If no data provided, don't render
  if (!data) {
    return null;
  }

  // Check if there's a discount
  const [discountAmount, finalPrice] = calculateDiscountedPrice(data.basePrice, data.discount);
  const hasDiscount = data.discount.type !== "none" && data.discount.value > 0;

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: { name: "Alex Johnson", avatar: "AJ", role: "CTO at TechStart" },
      rating: 5,
      date: "2025-05-12",
      content: "Exactly what our team needed. The integration was seamless and customer support was very responsive when we had questions."
    },
    {
      id: 2,
      user: { name: "Maria Garcia", avatar: "MG", role: "Product Manager" },
      rating: 4,
      date: "2025-05-08",
      content: "Great product with most of the features we were looking for. Would be perfect with a few more customization options."
    },
    {
      id: 3,
      user: { name: "Sam Williams", avatar: "SW", role: "Developer" },
      rating: 5,
      date: "2025-04-30",
      content: "Exceeded our expectations. Well documented and easy to implement. Definitely recommending this to others."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[90vw] md:max-w-[900px] p-0 overflow-hidden"
        aria-describedby="product-service-view-description"
      >
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl flex items-center gap-2">
              {type === "product" ? (
                <PackageIcon className="h-5 w-5 text-primary" />
              ) : (
                <Briefcase className="h-5 w-5 text-primary" />
              )}
              {data.name}
            </DialogTitle>
            <DialogDescription id="product-service-view-description" className="sr-only">
              View details for {data.name}
            </DialogDescription>
            <div className="flex items-center gap-2">
              <Badge 
                variant={data.status === "active" ? "default" : "outline"}
                className={
                  data.status === "active" 
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : data.status === "draft"
                    ? "bg-muted text-muted-foreground"
                    : "bg-destructive/20 text-destructive/80 border-destructive/30"
                }
              >
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Fix: Wrap the TabsContent components inside a Tabs parent */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "details" | "reviews")}>
          <div className="border-b border-border">
            <div className="px-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">
                  {type === "product" ? "Features" : "Deliverables"}
                </TabsTrigger>
                <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="max-h-[calc(80vh-120px)] overflow-y-auto">
            <div className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image carousel */}
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden aspect-video bg-card">
                      {data.images.length > 0 ? (
                        <>
                          <ImageWithFallback
                            src={data.images[currentImageIndex]}
                            alt={data.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {data.images.length > 1 && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                onClick={prevImage}
                              >
                                <ChevronLeft className="h-5 w-5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                onClick={nextImage}
                              >
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                              
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {data.images.map((_, idx) => (
                                  <button
                                    key={idx}
                                    className={`w-2 h-2 rounded-full ${
                                      idx === currentImageIndex 
                                        ? 'bg-primary' 
                                        : 'bg-white/30'
                                    }`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    
                    {data.images.length > 1 && (
                      <div className="grid grid-cols-5 gap-2">
                        {data.images.map((image, idx) => (
                          <button
                            key={idx}
                            className={`rounded-md overflow-hidden aspect-video border-2 ${
                              idx === currentImageIndex 
                                ? 'border-primary' 
                                : 'border-transparent'
                            }`}
                            onClick={() => setCurrentImageIndex(idx)}
                          >
                            <ImageWithFallback
                              src={image}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Listed on {new Date(data.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{data.sales} sales</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product/Service info */}
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold">{data.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{data.category}</Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 opacity-50" />
                          <span className="text-sm ml-1">4.8 (24 reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {data.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">Price</h3>
                          <div className="flex items-baseline">
                            {hasDiscount && (
                              <span className="text-muted-foreground line-through mr-2">
                                ${data.basePrice.toFixed(2)}
                              </span>
                            )}
                            <span className="text-2xl font-bold text-primary">
                              ${finalPrice.toFixed(2)}
                            </span>
                            {data.priceModel === "subscription" && (
                              <span className="text-muted-foreground ml-1">/ month</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {data.priceModel === "one-time" 
                              ? "One-time purchase" 
                              : data.priceModel === "subscription"
                              ? "Subscription"
                              : data.priceModel === "freemium"
                              ? "Freemium"
                              : data.priceModel === "contact"
                              ? "Contact for pricing"
                              : "Custom pricing"}
                          </div>
                        </div>
                        
                        {hasDiscount && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-base px-3 py-1.5">
                            {data.discount.type === "percentage" 
                              ? `${data.discount.value}% OFF` 
                              : `$${data.discount.value} OFF`}
                          </Badge>
                        )}
                      </div>
                      
                      {type === "service" && (data as ServiceData).duration && (
                        <div className="mt-4 flex items-center text-sm">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1.5" />
                            Duration: {(data as ServiceData).duration}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {data.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4">
                      <Button className="w-full gap-2">
                        {type === "product" ? (
                          <>
                            <ShoppingBag className="h-4 w-4" />
                            Purchase Now
                          </>
                        ) : (
                          <>
                            <CircleDollarSign className="h-4 w-4" />
                            Request Service
                          </>
                        )}
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2">
                          <Heart className="h-4 w-4" />
                          Add to Wishlist
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2">
                          <Share className="h-4 w-4" />
                          Share
                        </Button>
                      </div>
                      
                      {onEdit && (
                        <Button 
                          variant="outline" 
                          onClick={onEdit} 
                          className="mt-2"
                        >
                          Edit {type === "product" ? "Product" : "Service"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-0 space-y-6">
                {type === "product" ? (
                  <>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Features</h3>
                      {(data as ProductData).features.length > 0 ? (
                        <ul className="space-y-4">
                          {(data as ProductData).features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg">
                              <div className="rounded-full bg-primary/20 p-1.5 mt-0.5">
                                <svg
                                  className="h-4 w-4 text-primary"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p>{feature}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center p-8 border border-dashed rounded-lg">
                          <ListIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                          <p className="text-muted-foreground">No features have been added yet.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Technical Requirements</CardTitle>
                          <CardDescription>
                            System requirements and compatibility
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                          <p>Information not provided</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Support & Updates</CardTitle>
                          <CardDescription>
                            Support details and update policy
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                          <p>Information not provided</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-xl font-bold mb-4">Deliverables</h3>
                      {(data as ServiceData).deliverables.length > 0 ? (
                        <ul className="space-y-4">
                          {(data as ServiceData).deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-start gap-3 bg-muted/30 p-3 rounded-lg">
                              <div className="rounded-full bg-primary/20 p-1.5 mt-0.5">
                                <svg
                                  className="h-4 w-4 text-primary"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p>{deliverable}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center p-8 border border-dashed rounded-lg">
                          <PackageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                          <p className="text-muted-foreground">No deliverables have been added yet.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Service Process</CardTitle>
                          <CardDescription>
                            How the service is delivered
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                          <p>Information not provided</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Turnaround Time</CardTitle>
                          <CardDescription>
                            Expected timeline and milestones
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {(data as ServiceData).duration ? (
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2 text-primary" />
                              <p>{(data as ServiceData).duration}</p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Information not provided</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Rating Summary</CardTitle>
                      <CardDescription>Based on 24 reviews</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold">4.8</div>
                        <div className="flex mt-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 opacity-50" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">out of 5 stars</p>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground w-8">{rating} stars</div>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${rating >= 4 ? 'bg-primary' : rating === 3 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                                style={{ 
                                  width: `${rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 5 : 0}%` 
                                }}
                              />
                            </div>
                            <div className="text-sm w-8">
                              {rating === 5 ? '18' : rating === 4 ? '5' : rating === 3 ? '1' : '0'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                    
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src="" alt={review.user.name} />
                                <AvatarFallback>{review.user.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.user.name}</div>
                                <div className="text-sm text-muted-foreground">{review.user.role}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star 
                                  key={idx} 
                                  className={`h-4 w-4 ${
                                    idx < review.rating 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-muted-foreground'
                                  }`} 
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="flex justify-center pt-4">
                      <Button variant="outline">Load More Reviews</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>

        <DialogFooter className="p-6 pt-2 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              Edit {type === "product" ? "Product" : "Service"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Icon components
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
