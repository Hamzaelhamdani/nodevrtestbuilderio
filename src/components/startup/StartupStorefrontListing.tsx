import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  Search, 
  Star, 
  Filter,
  MapPin, 
  Calendar, 
  Users, 
  Award,
  ArrowUpRight,
  Building
} from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Startup {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  banner: string;
  rating: number;
  reviews: number;
  location: string;
  founded: string;
  employees: string;
  funding: string;
  incubator: string;
  categories: string[];
  description: string;
}

interface StartupStorefrontListingProps {
  startups: Startup[];
}

export function StartupStorefrontListing({ startups }: StartupStorefrontListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [incubatorFilter, setIncubatorFilter] = useState("All Incubators");
  const [sortBy, setSortBy] = useState("rating");

  // Dynamically generate filter options from startup data
  const categories = ["All Categories", ...Array.from(new Set(startups.flatMap(s => s.categories)))];
  const incubators = ["All Incubators", ...Array.from(new Set(startups.map(s => s.incubator)))];

  // Filter and sort startups
  const filteredStartups = startups.filter(startup => {
    // Apply search filter
    const searchMatch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        startup.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply category filter
    const categoryMatch = categoryFilter === "All Categories" || 
                         startup.categories.some(cat => cat === categoryFilter);
    
    // Apply incubator filter
    const incubatorMatch = incubatorFilter === "All Incubators" || 
                           startup.incubator === incubatorFilter;
    
    return searchMatch && categoryMatch && incubatorMatch;
  }).sort((a, b) => {
    // Apply sorting
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "newest") {
      return new Date(b.founded).getFullYear() - new Date(a.founded).getFullYear();
    } else if (sortBy === "reviews") {
      return b.reviews - a.reviews;
    }
    return 0;
  });

  const handleStartupClick = (startupId: string) => {
    // In a real application, this would navigate to the startup detail page
    if (typeof window !== 'undefined') {
      window.navigateTo?.("startup-storefront", { startupId });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold">Discover Startups</h1>
            <p className="text-foreground/70 mt-2">
              Explore innovative startups across various industries and connect with them directly
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search startups by name or description..."
                className="pl-10 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={incubatorFilter} onValueChange={setIncubatorFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Incubator" />
                </SelectTrigger>
                <SelectContent>
                  {incubators.map((incubator) => (
                    <SelectItem key={incubator} value={incubator}>
                      {incubator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-foreground/70">
              {filteredStartups.length} startups found
              {categoryFilter !== "All Categories" && ` in ${categoryFilter}`}
              {incubatorFilter !== "All Incubators" && ` from ${incubatorFilter}`}
            </p>
            <Button variant="ghost" className="text-primary" onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All Categories");
              setIncubatorFilter("All Incubators");
              setSortBy("rating");
            }}>
              Clear Filters
            </Button>
          </div>

          {/* Startups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <Card 
                key={startup.id} 
                className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                onClick={() => handleStartupClick(startup.id)}
              >
                <div className="h-32 w-full overflow-hidden relative">
                  <ImageWithFallback
                    src={startup.banner}
                    alt={`${startup.name} Banner`}
                    width={600}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-background bg-white shadow-lg">
                      <ImageWithFallback
                        src={startup.logo}
                        alt={startup.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {startup.incubator && (
                      <Badge className="bg-tertiary text-white hover:bg-tertiary/90">
                        {startup.incubator}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4 pt-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{startup.name}</h3>
                      <p className="text-sm text-foreground/70 line-clamp-2 mt-1">
                        {startup.tagline}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{startup.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {startup.categories.map((category, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-foreground/70">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{startup.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Founded {startup.founded}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{startup.employees}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{startup.funding}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center text-xs">
                      <Building className="w-3 h-3 mr-1" />
                      <span className="text-foreground/70">{startup.reviews} reviews</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary gap-1 text-xs h-8 p-2"
                    >
                      View Startup 
                      <ArrowUpRight className="w-3 h-3 mt-px" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}