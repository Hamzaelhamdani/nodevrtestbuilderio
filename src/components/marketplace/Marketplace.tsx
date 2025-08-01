import { useState, useEffect } from "react";
import { startupService } from '../../services/startupService';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar } from "../ui/avatar";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  ArrowUpRight,
  ListFilter,
  Grid,
  Columns,
  SortAsc,
  SortDesc,
  RefreshCw
} from "lucide-react";

// Liste enrichie de catégories populaires
const POPULAR_CATEGORIES = [
  "General", "SaaS", "Services", "Hardware", "Marketing", "Design", "Développement", "Éducation", "Santé", "Finance", "IA", "Marketplace", "E-commerce", "Mobilité", "Énergie", "Agriculture", "FoodTech", "LegalTech", "RH", "Tourisme", "Immobilier", "Transport", "Gaming", "Media", "Artisanat", "Mode", "Beauté", "Sport", "Bien-être", "Environnement", "Sécurité", "Logistique", "Assurance", "Crypto", "Blockchain", "Data", "Cloud", "IoT", "Robotics", "Autres"
];

// Génère dynamiquement la liste des catégories à partir des produits avec le compte de produits
const getCategories = (products: any[]) => {
  const categoryCounts = new Map<string, number>();
  
  // Count products per category
  products.forEach(p => {
    const category = p.category || 'General';
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  });
  
  // Add all popular categories with 0 count if they don't exist
  POPULAR_CATEGORIES.forEach(cat => {
    if (!categoryCounts.has(cat)) {
      categoryCounts.set(cat, 0);
    }
  });
  
  const totalCount = products.length;
  
  return [
    { id: "all", name: "All Categories", count: totalCount },
    ...Array.from(categoryCounts).map(([cat, count]) => ({ 
      id: cat, 
      name: cat, 
      count: count 
    })).sort((a, b) => b.count - a.count) // Sort by count descending
  ];
};

// API Product Type
interface StartupCreator {
  id: number;
  displayName: string;
  logoPath: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  type: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  startupCreator: StartupCreator;
}

// Sort options
const sortOptions = [
  { id: "popular", name: "Most Popular" },
  { id: "newest", name: "Newest First" },
  { id: "price-asc", name: "Price: Low to High" },
  { id: "price-desc", name: "Price: High to Low" },
  { id: "rating", name: "Highest Rated" }
];

// View types
type ViewType = "grid" | "list";

export function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState(sortOptions[0].id);
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🔍 Marketplace: Fetching all products...');
      
      // Fetch all products for marketplace (all startups)
      const result: any = await startupService.getAllProducts();
      console.log('🔍 Marketplace: API returned', result?.data?.length || result?.length || 0, 'products');
      
      let productsArr = Array.isArray(result) ? result : (Array.isArray(result?.data) ? result.data : []);
      console.log('📦 Products loaded in Marketplace:', productsArr.length);
      console.log('🔍 Sample products with categories:', productsArr.slice(0, 5).map(p => ({
        name: p.name,
        category: p.category,
        categoryType: typeof p.category
      })));
      
      // Also fetch categories for debugging
      try {
        const response = await fetch('/api/products/categories');
        const categoriesData = await response.json();
        console.log('🏷️ Categories from backend:', categoriesData);
      } catch (error) {
        console.log('⚠️ Could not fetch categories for debugging:', error);
      }
      
      setProducts(productsArr);
    } catch (e: any) {
      console.error('❌ Marketplace: Error fetching products:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Listen for storage events to detect product changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'marketplace-refresh' && e.newValue === 'true') {
        console.log('🔄 Detected product changes, refreshing marketplace...');
        fetchProducts();
        // Clear the flag
        localStorage.setItem('marketplace-refresh', 'false');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes when the window gains focus
    const handleFocus = () => {
      const shouldRefresh = localStorage.getItem('marketplace-refresh');
      if (shouldRefresh === 'true') {
        console.log('🔄 Window focused, refreshing marketplace...');
        fetchProducts();
        localStorage.setItem('marketplace-refresh', 'false');
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Refresh products manually
  const handleRefresh = () => {
    console.log('🔄 Refreshing marketplace products...');
    fetchProducts();
  };

  // Map and Filter products
  const mappedProducts = products.map(product => {
    // Handle different image URL formats
    let imageUrl = '';
    if (product.images && product.images[0]) {
      const firstImage = product.images[0];
      // If it's already a full URL (placeholder or external), use as is
      if (firstImage.startsWith('http')) {
        imageUrl = firstImage;
      } else {
        // If it's a filename, prepend the uploads path
        imageUrl = `/api/uploads/images/${firstImage}`;
      }
    } else if (product.image) {
      // Fallback to product.image field
      imageUrl = product.image.startsWith('http') ? product.image : `/api/uploads/images/${product.image}`;
    }

    return {
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      image: imageUrl,
      category: product.category || 'General',
      startupName: product.startup?.name || 'Unknown Startup',
      startupLogo: product.startup?.logo || '',
      badge: "New",
      rating: 4.5,
      reviews: 0,
      incubator: "N/A",
    };
  });

  const filteredProducts = mappedProducts.filter(product => {
    try {
      if (!product) return false;

      const safeName = (() => {
        try {
          return String(product.name || "").toLowerCase() || "";
        } catch {
          return "";
        }
      })();

      const safeDescription = (() => {
        try {
          return String(product.description || "").toLowerCase() || "";
        } catch {
          return "";
        }
      })();

      const safeStartupName = (() => {
        try {
          return String(product.startupName || "").toLowerCase() || "";
        } catch {
          return "";
        }
      })();

      const safeSearchQuery = (() => {
        try {
          return String(searchQuery || "").toLowerCase() || "";
        } catch {
          return "";
        }
      })();

      // More robust category matching with multiple fallbacks
      const productCategory = (product.category || '').toLowerCase().trim().replace(/\s+/g, ' ');
      const filterCategory = selectedCategory.toLowerCase().trim().replace(/\s+/g, ' ');
      
      // Try multiple matching strategies
      const exactMatch = productCategory === filterCategory;
      const includesMatch = productCategory.includes(filterCategory) || filterCategory.includes(productCategory);
      const wordMatch = productCategory.split(' ').some(word => filterCategory.split(' ').includes(word));
      
      const matchesCategory = selectedCategory === "all" || exactMatch || (filterCategory.length > 2 && includesMatch);

      // Enhanced debug category matching for troubleshooting
      if (selectedCategory === "Blockchain" || productCategory.includes('blockchain') || selectedCategory.includes('blockchain')) {
        console.log('🔍 Enhanced Category matching debug:', {
          productName: product.name,
          originalCategory: product.category,
          productCategory,
          selectedCategory,
          filterCategory,
          exactMatch,
          includesMatch,
          wordMatch,
          finalMatch: matchesCategory
        });
      }

      const matchesSearch = (() => {
        try {
          return safeName.includes(safeSearchQuery) ||
                 safeDescription.includes(safeSearchQuery) ||
                 safeStartupName.includes(safeSearchQuery);
        } catch {
          return true; // If search fails, include the item
        }
      })();

      const matchesPrice = (product.price || 0) >= (priceRange[0] || 0) && (product.price || 0) <= (priceRange[1] || 1000);

      return matchesCategory && matchesSearch && matchesPrice;
    } catch (error) {
      console.warn('Error filtering product:', error);
      return true; // Include the product if filtering fails
    }
  });

  const categories = getCategories(mappedProducts);

  // Debug logging
  console.log('🔍 Marketplace Debug:', {
    totalProducts: products.length,
    mappedProducts: mappedProducts.length,
    filteredProducts: filteredProducts.length,
    selectedCategory,
    searchQuery,
    loading,
    error,
    // Show first few products for debugging
    sampleProducts: mappedProducts.slice(0, 3).map(p => ({ name: p.name, category: p.category })),
    // Show blockchain products specifically
    blockchainProducts: mappedProducts.filter(p => p.category?.toLowerCase().includes('blockchain'))
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error fetching products: {error}</div>;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
            <p className="text-foreground/70">
              Discover innovative products and services from startups
            </p>
          </div>

          {/* Search and View Options */}
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
              <input
                type="text"
                placeholder="Search products, startups..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-1"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </Button>

              <Button
                variant={filterOpen ? "default" : "outline"}
                className={`gap-1 ${filterOpen ? "bg-primary hover:bg-primary/90" : ""}`}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} />
                Filter
                {(selectedCategory !== "all" || searchQuery || priceRange[0] > 0 || priceRange[1] < 500) && (
                  <Badge variant="secondary" className="ml-1 bg-red-500 text-white text-xs">
                    !
                  </Badge>
                )}
              </Button>

              <div className="border border-border rounded-lg flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-r-none ${viewType === 'grid' ? 'bg-muted' : ''}`}
                  onClick={() => setViewType("grid")}
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-l-none ${viewType === 'list' ? 'bg-muted' : ''}`}
                  onClick={() => setViewType("list")}
                >
                  <Columns size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setPriceRange([0, 500]);
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setFilterOpen(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                  <ListFilter size={16} />
                  Categories
                </h3>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                        selectedCategory === category.id
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="font-medium">{category.name}</span>
                      <Badge 
                        variant={selectedCategory === category.id ? "default" : "outline"} 
                        className={`text-xs transition-all ${
                          selectedCategory === category.id 
                            ? "bg-primary text-white" 
                            : "bg-slate-700 text-slate-300 group-hover:bg-slate-600"
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                  <SortAsc size={16} />
                  Price Range
                </h3>
                <div className="px-2 py-4">
                  <div className="relative h-2 bg-slate-700 rounded-full mb-6">
                    <div
                      className="absolute h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full"
                      style={{
                        left: `${(priceRange[0] / 500) * 100}%`,
                        right: `${100 - (priceRange[1] / 500) * 100}%`
                      }}
                    ></div>
                    <button
                      className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full -translate-y-1/2 -translate-x-1/2 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg"
                      style={{ left: `${(priceRange[0] / 500) * 100}%`, top: '50%' }}
                      aria-label="Minimum price"
                    ></button>
                    <button
                      className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full -translate-y-1/2 -translate-x-1/2 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg"
                      style={{ left: `${(priceRange[1] / 500) * 100}%`, top: '50%' }}
                      aria-label="Maximum price"
                    ></button>
                  </div>

                  <div className="flex justify-between mb-4">
                    <div className="bg-slate-700 px-3 py-2 rounded-lg">
                      <span className="text-sm text-slate-300">Min:</span>
                      <span className="font-medium ml-1 text-white">${priceRange[0]}</span>
                    </div>
                    <div className="bg-slate-700 px-3 py-2 rounded-lg">
                      <span className="text-sm text-slate-300">Max:</span>
                      <span className="font-medium ml-1 text-white">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => setPriceRange([0, 500])}
                  >
                    Reset
                  </Button>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {}}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              {/* Sort Options */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                  <SortDesc size={16} />
                  Sort By
                </h3>
                <div className="space-y-1">
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        sortOption === option.id
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent"
                      }`}
                      onClick={() => setSortOption(option.id)}
                    >
                      <span className="font-medium">{option.name}</span>
                      {sortOption === option.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-2 bg-slate-800/50 border border-slate-700">
            {categories.slice(0, 8).map(category => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white text-slate-300 hover:text-white"
              >
                {category.name}
                {category.count > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-slate-600 text-slate-300">
                    {category.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
            {categories.length > 8 && (
              <TabsTrigger
                value="more"
                className="flex-shrink-0 text-slate-400"
                onClick={() => setFilterOpen(true)}
              >
                +{categories.length - 8} more
              </TabsTrigger>
            )}
          </TabsList>

          {/* Results Count and Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-foreground/70">
              Showing <span className="font-medium">{filteredProducts.length}</span> results
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/70">Sort:</span>
              <select
                className="text-sm border-none bg-transparent focus:outline-none focus:ring-0 pl-1"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid/List View */}
          <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {filteredProducts.map(product => (
              <Card key={product.id} className={`overflow-hidden transition-all hover:shadow-md`}>
                {viewType === 'grid' ? (
                  <>
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      {product.badge && (
                        <Badge
                          className={`absolute top-2 right-2 ${
                            product.badge === 'Popular'
                              ? 'bg-tertiary text-white'
                              : product.badge === 'New'
                                ? 'bg-primary text-white'
                                : product.badge === 'Incubator Pick'
                                  ? 'bg-secondary text-white'
                                  : 'bg-amber-500 text-white'
                          }`}
                        >
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold truncate">{product.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                              {product.category ? product.category : "Non renseignée"}
                            </Badge>
                            <div className="flex items-center text-sm">
                              <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                          {/* Ajoute le nom de la startup */}
                          <div className="text-xs text-foreground/70 mt-1">{product.startupName}</div>
                        </div>
                        <span className="font-bold">${product.price}</span>
                      </div>
                      <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <ImageWithFallback
                              src={product.startupLogo}
                              alt={product.startupName}
                              width={24}
                              height={24}
                            />
                          </Avatar>
                          <span className="text-sm">{product.startupName}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Heart size={16} />
                          </Button>
                          <Button className="h-8 w-8 p-0 bg-primary hover:bg-primary/90">
                            <ShoppingCart size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      {product.badge && (
                        <Badge
                          className={`absolute top-2 right-2 ${
                            product.badge === 'Popular'
                              ? 'bg-tertiary text-white'
                              : product.badge === 'New'
                                ? 'bg-primary text-white'
                                : product.badge === 'Incubator Pick'
                                  ? 'bg-secondary text-white'
                                  : 'bg-amber-500 text-white'
                          }`}
                        >
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 md:p-6 flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <Badge variant="outline">
                              {product.category}
                            </Badge>
                          </div>
                          {/* Ajoute le nom de la startup */}
                          <div className="text-xs text-foreground/70 mt-1">{product.startupName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{product.rating}</span>
                              <span className="text-sm text-foreground/70 ml-1">({product.reviews})</span>
                            </div>
                            <span className="text-sm text-secondary">
                              {product.incubator}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-lg mt-2 md:mt-0">${product.price}</span>
                      </div>
                      <p className="text-foreground/70 my-4">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <ImageWithFallback
                              src={product.startupLogo}
                              alt={product.startupName}
                              width={32}
                              height={32}
                            />
                          </Avatar>
                          <span>{product.startupName}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="gap-1">
                            <Heart size={16} />
                            Save
                          </Button>
                          <Button className="gap-1 bg-primary hover:bg-primary/90">
                            <ShoppingCart size={16} />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 text-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-foreground/70 mb-6">
                We couldn't find any products matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setPriceRange([0, 150]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
