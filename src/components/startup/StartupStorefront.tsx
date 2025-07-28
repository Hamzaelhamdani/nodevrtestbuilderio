import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  MessageCircle,
  Star,
  Share2,
  Heart,
  ShoppingCart,
  MapPin,
  Calendar,
  Users,
  Award,
  Link as LinkIcon,
  Globe,
  ArrowUpRight,
  ChevronLeft
} from "lucide-react";
import { StartupStorefrontListing } from "./StartupStorefrontListing";
import { startupService } from '../../services/startupService';

// API response types
interface ApiStartupInfo {
  id: number;
  displayName: string;
  logoPath: string;
  email: string;
  country: string;
  isApproved: boolean;
}

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
}

interface StartupWithProducts {
  startupInfo: ApiStartupInfo;
  products: ApiProduct[];
  productsCount: number;
}

// Transformed data types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge: string | null;
  rating: number;
  reviews: number;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface SocialLink {
    name: string;
    url: string;
}

interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  reviews: number;
  location:string;
  founded: string;
  employees: string;
  funding: string;
  website: string;
  incubator: string;
  socials: SocialLink[];
  categories: string[];
  products: Product[];
  team: TeamMember[];
}

interface StartupStorefrontProps {
  // Optional startupId allows for either showing the listing or an individual startup
  startupId?: string;
}

export function StartupStorefront({ startupId }: StartupStorefrontProps) {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStartupId, setCurrentStartupId] = useState(startupId);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        // Fetch startups and their products from backend API
        const startups = await startupService.getStartups();
        const transformedData = (startups || []).map((item: any): Startup => ({
          id: item.id,
          name: item.name,
          tagline: "Innovative solutions for the modern world.",
          description: item.description || `Explore the products and services offered by ${item.name}.`,
          logo: item.logo_url || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
          banner: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&h=400&fit=crop&q=80",
          rating: 4.5,
          reviews: item.products?.length || 0,
          location: item.location || '',
          founded: "2023",
          employees: "1-10",
          funding: "Seed",
          website: item.website || "#",
          incubator: "VenturesRoom",
          socials: [],
          categories: ["Technology", "Innovation"],
          products: (item.products || []).map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image_urls?.[0] || "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400",
            category: product.category || "General",
            badge: "New",
            rating: 4.5,
            reviews: 0,
          })),
          team: [],
        }));
        setStartups(transformedData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  useEffect(() => {
    setCurrentStartupId(startupId);
  }, [startupId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading startups...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!currentStartupId) {
    return <StartupStorefrontListing startups={startups} />;
  }

  const startup = startups.find(s => s.id === currentStartupId);

  if (!startup) {
    return <StartupStorefrontListing startups={startups} />;
  }

  return (
    <div className="bg-background">
      <Button
        variant="ghost"
        className="flex items-center gap-2 mb-6"
        onClick={() => setCurrentStartupId(undefined)}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Startups
      </Button>

      {/* Banner and Profile Section */}
      <div className="relative">
        <div className="h-64 w-full overflow-hidden">
          <ImageWithFallback
            src={startup.banner}
            alt={`${startup.name} Banner`}
            width={1200}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row -mt-16 relative z-10">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-background shadow-md bg-white">
              <ImageWithFallback
                src={startup.logo}
                alt={startup.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 md:mt-12 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{startup.name}</h1>
                    <Badge className="bg-tertiary text-white hover:bg-tertiary/90">
                      {startup.incubator}
                    </Badge>
                  </div>
                  <p className="text-foreground/70 mt-1">{startup.tagline}</p>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" className="gap-1">
                    <Heart size={16} />
                    Save
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Share2 size={16} />
                    Share
                  </Button>
                  <Button className="gap-1 bg-primary hover:bg-primary-hover">
                    <MessageCircle size={16} />
                    Chat
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {startup.categories.map((category: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-6 md:ml-40 text-sm text-foreground/70">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{startup.rating}</span>
              <span>({startup.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{startup.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Founded {startup.founded}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{startup.employees} employees</span>
            </div>
            <div className="flex items-center gap-1">
              <Award size={16} />
              <span>{startup.funding}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe size={16} />
              <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 mt-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {startup.products.map((product: Product) => (
                <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground hover:bg-primary-hover">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center text-sm mb-4">
                      <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium mr-1">{product.rating}</span>
                      <span className="text-foreground/70">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">${product.price}/mo</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Heart size={16} />
                        </Button>
                        <Button className="h-8 gap-1 bg-primary hover:bg-primary-hover text-primary-foreground">
                          <ShoppingCart size={14} />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">About {startup.name}</h2>
                <p className="text-foreground/80 mb-6">{startup.description}</p>
                <p className="text-foreground/80 mb-6">
                  Our mission is to democratize access to advanced analytics and make data-driven decision making accessible to businesses of all sizes. With our intuitive platform, even non-technical users can gain valuable insights from their data.
                </p>
                <p className="text-foreground/80 mb-6">
                  We're backed by {startup.incubator} and have raised {startup.funding} to date. Our team of data scientists and engineers are passionate about building tools that help businesses succeed.
                </p>

                <h3 className="text-lg font-semibold mt-8 mb-4">Connect with us</h3>
                <div className="flex gap-3">
                  {startup.socials.map((social: SocialLink, index: number) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-muted rounded-lg flex items-center gap-2 hover:bg-muted/80 transition-colors"
                    >
                      <LinkIcon size={16} />
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-muted rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-foreground/70">Founded</p>
                      <p>{startup.founded}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Location</p>
                      <p>{startup.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Team Size</p>
                      <p>{startup.employees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Funding</p>
                      <p>{startup.funding}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Incubator</p>
                      <p>{startup.incubator}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-primary hover:underline"
                    >
                      <span>Visit Website</span>
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={18} className={`${i < Math.floor(startup.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="font-medium">{startup.rating}</span>
                    <span className="text-foreground/70">({startup.reviews} reviews)</span>
                  </div>
                </div>
                <Button>Write a Review</Button>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((review: number) => (
                  <div key={review} className="border-b border-border pb-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <ImageWithFallback
                          src={`https://images.unsplash.com/photo-${1570295999919 + review * 10000}-b8bacba8a4a2?w=32&h=32&fit=crop&q=80`}
                          alt="User"
                          width={40}
                          height={40}
                        />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">John Doe</h4>
                          <span className="text-sm text-foreground/70">2 weeks ago</span>
                        </div>
                        <div className="flex my-1">
                          {Array(5).fill(0).map((_, i: number) => (
                            <Star key={i} size={14} className={`${i < 5 - review % 2 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-foreground/80 mt-2">
                          The analytics dashboard has been a game-changer for our business. It's intuitive, powerful, and provides insights that we couldn't get from other tools. The customer support is also excellent.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {startup.team.map((member: TeamMember, index: number) => (
                <Card key={index}>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="rounded-full"
                      />
                    </Avatar>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-primary text-sm">{member.role}</p>
                    <p className="text-foreground/70 text-sm mt-2">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
