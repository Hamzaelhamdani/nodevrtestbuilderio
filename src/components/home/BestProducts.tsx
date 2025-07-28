import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ShoppingBagIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { startupService } from '../../services/startupService';

interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  type: string;
  sellerId: string;
  images: string[];
  createdByUserId: string;
  originalPrice: number;
  discountedPrice: number;
}

export function BestProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get products from startup service
      const products = await startupService.getProducts();

      if (products && products.length > 0) {
        // Transform to match expected format
        const transformedProducts = products.map((product, index) => ({
          id: parseInt(product.id) || index,
          name: product.name,
          description: product.description || '',
          categoryId: product.category || 'general',
          type: product.category || 'Product',
          sellerId: product.startup_id,
          images: product.image_urls || ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400'],
          createdByUserId: product.startup_id,
          originalPrice: product.price * 1.2, // Mock original price
          discountedPrice: product.price,
        }));
        setProducts(transformedProducts);
      } else {
        // Fallback mock data when no products available
        const mockProducts = [
          {
            id: 1,
            name: "Business Intelligence Dashboard",
            description: "Advanced analytics platform for business insights",
            categoryId: "analytics",
            type: "SaaS",
            sellerId: "startup-1",
            images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"],
            createdByUserId: "user-1",
            originalPrice: 399.99,
            discountedPrice: 299.99,
          },
          {
            id: 2,
            name: "EcoTrack Monitor",
            description: "Environmental monitoring solution",
            categoryId: "environment",
            type: "IoT",
            sellerId: "startup-2",
            images: ["https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400"],
            createdByUserId: "user-2",
            originalPrice: 199.99,
            discountedPrice: 149.99,
          },
          {
            id: 3,
            name: "Smart Security System",
            description: "AI-powered security monitoring",
            categoryId: "security",
            type: "Hardware",
            sellerId: "startup-3",
            images: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400"],
            createdByUserId: "user-3",
            originalPrice: 299.99,
            discountedPrice: 249.99,
          },
        ];
        setProducts(mockProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // Use fallback data even on error
      const fallbackProducts = [
        {
          id: 1,
          name: "Business Dashboard",
          description: "Analytics platform for businesses",
          categoryId: "analytics",
          type: "SaaS",
          sellerId: "startup-1",
          images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"],
          createdByUserId: "user-1",
          originalPrice: 399.99,
          discountedPrice: 299.99,
        },
        {
          id: 2,
          name: "Eco Monitor",
          description: "Environmental tracking solution",
          categoryId: "environment",
          type: "IoT",
          sellerId: "startup-2",
          images: ["https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400"],
          createdByUserId: "user-2",
          originalPrice: 199.99,
          discountedPrice: 149.99,
        },
      ];
      setProducts(fallbackProducts);
      setError(null); // Don't show error to user, just use fallback data
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 3 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 3 : prev - 1));
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mx-auto mb-4">
          <ShoppingBagIcon className="h-5 w-5 text-[#8A4FFF] animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Loading Products...</h3>
        <p className="text-gray-400">Please wait while we fetch the latest products</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-red-500 mb-4">Error Loading Products</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button
          variant="outline"
          className="bg-white/5 hover:bg-white/10 border-gray-800"
          onClick={fetchProducts}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-4">
            <ShoppingBagIcon className="h-5 w-5 text-[#8A4FFF]" />
          </div>
          <h3 className="text-2xl font-bold text-white">Best Products & Services</h3>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/5 border-gray-800 hover:bg-white/10 hover:border-[#8A4FFF]/50 rounded-full h-10 w-10"
            onClick={prevSlide}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-white/5 border-gray-800 hover:bg-white/10 hover:border-[#8A4FFF]/50 rounded-full h-10 w-10"
            onClick={nextSlide}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * (100 / products.length) * 3}%)` }}
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="min-w-[calc(100%-1rem)] sm:min-w-[calc(50%-1rem)] md:min-w-[calc(33.333%-1rem)] px-2"
            >
              <motion.div
                className="startup-card bg-[#0c131d]/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-full"
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    width={400}
                    height={200}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 backdrop-blur-sm text-white border-0">
                      {product.type || 'Product'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#8A4FFF] text-white border-0 flex items-center">
                      <StarIcon className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {product.description || 'No description available'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-[#8A4FFF]/10 text-[#8A4FFF] px-2 py-1 rounded-full">
                      {product.categoryId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-[#8A4FFF]">
                        ${product.discountedPrice}
                        {product.discountedPrice < product.originalPrice && (
                          <span className="text-sm text-gray-500 ml-2 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="text-xs bg-[#8A4FFF] hover:bg-[#7A3FFE] text-white border-0"
                      onClick={() => window.navigateTo?.('marketplace')}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
