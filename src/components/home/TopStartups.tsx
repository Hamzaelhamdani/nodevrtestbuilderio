import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft, Award, Users, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { startupService } from '../../services/startupService';
import { API_BASE_URL } from '../../utils/apiClient';

// Interface for API startup data
interface ApiStartup {
  id: number;
  email: string;
  displayName: string;
  telephone: string;
  country: string;
  role: string;
  isApproved: boolean;
  logoPath: string | null;
  lastActiveAt: string | null;
}

// Interface for UI startup data
interface UIStartup {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  logo: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  bgColor: string;
  metrics: {
    funding: string;
    customers: number;
    growth: string;
  };
}

export function TopStartups() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [startups, setStartups] = useState<UIStartup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch startups from startup service
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoading(true);

        // Try to get startups from service
        const approvedStartups = await startupService.getApprovedStartups();

        if (approvedStartups && approvedStartups.length > 0) {
          // Transform to UI format
          const transformedStartups: UIStartup[] = approvedStartups.map((startup) => ({
            id: startup.id,
            name: startup.name,
            logo: startup.logo_url || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
            category: startup.industry || "Startup",
            description: startup.description || `${startup.name} is an innovative startup`,
            tags: [startup.industry || "Innovation", startup.stage || "Growth"],
            rating: 4.5 + Math.random() * 0.5,
            reviews: Math.floor(Math.random() * 100) + 50,
            featured: true,
          }));
          setStartups(transformedStartups);
        } else {
          // Fallback data
          const fallbackStartups: UIStartup[] = [
            {
              id: "1",
              name: "AI Analytics Pro",
              logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
              category: "AI/ML",
              description: "Advanced AI-powered analytics for business intelligence",
              tags: ["AI", "Analytics", "SaaS"],
              rating: 4.8,
              reviews: 234,
              featured: true,
            },
            {
              id: "2",
              name: "EcoTrack Solutions",
              logo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200",
              category: "Environment",
              description: "Environmental monitoring and sustainability tracking",
              tags: ["Environment", "IoT", "Sustainability"],
              rating: 4.6,
              reviews: 189,
              featured: true,
            },
          ];
          setStartups(fallbackStartups);
        }

        // Transform API data to match UI requirements with better defaults
        const transformedStartups: UIStartup[] = apiStartups
          .filter(startup => startup.isApproved) // Only show approved startups
          .map((startup, index) => ({
            id: startup.id,
            name: startup.displayName || 'Unnamed Startup',
            category: startup.role || 'Technology',
            description: `${startup.displayName} is a ${startup.role} startup based in ${startup.country}`,
            image: "https://images.unsplash.com/photo-1581092921461-7d65ca45393a?q=80&w=2070&auto=format&fit=crop",
            logo: startup.logoPath
              ? `${API_BASE_URL}${startup.logoPath}`
              : "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop",
            rating: 4.5 + (Math.random() * 0.5),
            reviewCount: Math.floor(Math.random() * 100) + 50,
            tags: [
              startup.role || 'Tech',
              startup.country || 'Global',
              'Startup'
            ].filter(Boolean),
            bgColor: `rgba(193, 241, 126, ${0.1 + (index * 0.1)})`,
            metrics: {
              funding: `$${(Math.random() * 5 + 1).toFixed(1)}M`,
              customers: Math.floor(Math.random() * 1000) + 100,
              growth: `${Math.floor(Math.random() * 200) + 50}%`
            }
          }));

        console.log('Transformed startups:', transformedStartups);
        setStartups(transformedStartups);
        setError(null);
      } catch (err) {
        console.error('Error fetching startups:', err);
        setError(err instanceof Error ? err.message : 'Failed to load startups');
        // Don't clear existing startups on error if you want to keep showing them
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);

  // Handle automatic sliding
  useEffect(() => {
    if (!autoplayEnabled || isHovering || startups.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, autoplayEnabled, isHovering, startups.length]);

  const nextSlide = () => {
    if (startups.length === 0) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % startups.length);
  };

  const prevSlide = () => {
    if (startups.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + startups.length) % startups.length);
  };

  if (isLoading) {
    return <div className="text-white text-center py-20">Loading startups...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-20">Error: {error}</div>;
  }

  if (startups.length === 0) {
    return <div className="text-white text-center py-20">No startups found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section header with improved contrast and spacing */}
      <div className="flex justify-between items-end flex-wrap mb-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <h2 className="text-4xl font-bold text-white mb-3 flex items-center">
            Featured <span className="text-primary ml-2">Startups</span>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Award className="ml-3 text-primary h-7 w-7" />
            </motion.div>
          </h2>
          <p className="text-foreground/70 max-w-lg text-lg">
            Discover trending startups making waves in our ecosystem
          </p>
        </motion.div>

        {/* Enhanced navigation controls with active state indicators */}
        <motion.div
          className="flex space-x-3 mt-4 sm:mt-0"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center border border-foreground/20 text-foreground relative overflow-hidden group"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(193, 241, 126, 0.15)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
          >
            <motion.div
              className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: "inherit" }}
            />
            <ChevronLeft size={20} className="relative z-10 group-hover:text-primary transition-colors" />
          </motion.button>

          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center border border-foreground/20 text-foreground relative overflow-hidden group"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(193, 241, 126, 0.15)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
          >
            <motion.div
              className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ borderRadius: "inherit" }}
            />
            <ChevronRight size={20} className="relative z-10 group-hover:text-primary transition-colors" />
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced startup carousel with improved visuals and animation */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left side - Featured startup image with overlay info */}
            <motion.div
              className="rounded-2xl overflow-hidden relative h-[500px] md:h-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 w-full h-full">
                <ImageWithFallback
                  src={startups[currentIndex].image}
                  alt={startups[currentIndex].name}
                  className="w-full h-full object-cover"
                />

                {/* Enhanced gradient overlay with more depth */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to bottom, rgba(8, 15, 23, 0.2) 0%, rgba(8, 15, 23, 0.8) 80%, rgba(8, 15, 23, 0.95) 100%)",
                    backdropFilter: "blur(1px)"
                  }}
                />

                {/* Startup logo with improved prominence */}
                <motion.div
                  className="absolute top-6 left-6 flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg"
                    style={{
                      background: "#1e1e1e",
                      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)"
                    }}
                  >
                    <ImageWithFallback
                      src={startups[currentIndex].logo}
                      alt={`${startups[currentIndex].name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div
                      className="py-1 px-3 rounded-full text-xs font-medium inline-flex items-center mb-1"
                      style={{
                        background: "rgba(8, 15, 23, 0.7)",
                        backdropFilter: "blur(10px)"
                      }}
                    >
                      {startups[currentIndex].category}
                    </div>
                    <div
                      className="py-1 px-3 rounded-full flex items-center"
                      style={{
                        background: "rgba(8, 15, 23, 0.7)",
                        backdropFilter: "blur(10px)"
                      }}
                    >
                      <Star className="text-primary mr-1" size={16} fill="#c1f17e" />
                      <span className="text-white font-medium">{startups[currentIndex].rating}</span>
                      <span className="text-foreground/60 text-sm ml-1">({startups[currentIndex].reviewCount})</span>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom info section with name and improved metrics display */}
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <motion.h3
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {startups[currentIndex].name}
                  </motion.h3>

                  <motion.p
                    className="text-foreground/80 mb-6 max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {startups[currentIndex].description}
                  </motion.p>

                  {/* Startup metrics with icons */}
                  <motion.div
                    className="grid grid-cols-3 gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="bg-background/30 backdrop-blur-md rounded-lg p-3 border border-white/5">
                      <div className="flex items-center text-primary text-sm font-medium mb-1">
                        <Award size={14} className="mr-1" />
                        Funding
                      </div>
                      <div className="text-white font-bold">
                        {startups[currentIndex].metrics.funding}
                      </div>
                    </div>

                    <div className="bg-background/30 backdrop-blur-md rounded-lg p-3 border border-white/5">
                      <div className="flex items-center text-primary text-sm font-medium mb-1">
                        <Users size={14} className="mr-1" />
                        Customers
                      </div>
                      <div className="text-white font-bold">
                        {startups[currentIndex].metrics.customers.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-background/30 backdrop-blur-md rounded-lg p-3 border border-white/5">
                      <div className="flex items-center text-primary text-sm font-medium mb-1">
                        <TrendingUp size={14} className="mr-1" />
                        Growth
                      </div>
                      <div className="text-white font-bold">
                        {startups[currentIndex].metrics.growth}
                      </div>
                    </div>
                  </motion.div>

                  {/* Tags with improved styling */}
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {startups[currentIndex].tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center"
                        style={{
                          background: idx === 0 ? startups[currentIndex].bgColor : "rgba(214, 221, 230, 0.1)",
                          color: idx === 0 ? "#c1f17e" : "#d6dde6",
                          border: idx === 0 ? "1px solid rgba(193, 241, 126, 0.3)" : "1px solid rgba(214, 221, 230, 0.1)"
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Other startups in smaller cards */}
            <div className="space-y-6">
              {startups.filter((_, idx) => idx !== currentIndex).map((startup, idx) => (
                <motion.div
                  key={startup.id}
                  className="rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative border border-white/5"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                  onClick={() => {
                    setDirection(idx < currentIndex ? -1 : 1);
                    setCurrentIndex(startups.findIndex(s => s.id === startup.id));
                  }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.3), 0 0 15px rgba(193, 241, 126, 0.15)"
                  }}
                  style={{
                    background: "rgba(30, 30, 30, 0.6)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="flex items-start p-4 gap-4">
                    {/* Startup logo */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                      <ImageWithFallback
                        src={startup.logo}
                        alt={`${startup.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Startup info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-bold truncate">{startup.name}</h4>
                          <p className="text-foreground/70 text-sm">{startup.category}</p>
                        </div>

                        <div className="flex items-center bg-background/50 py-0.5 px-2 rounded-full">
                          <Star className="text-primary mr-1" size={14} fill="#c1f17e" />
                          <span className="text-white text-sm font-medium">{startup.rating}</span>
                        </div>
                      </div>

                      <p className="text-foreground/80 text-sm mt-2 line-clamp-2">
                        {startup.description}
                      </p>

                      {/* Tags - simplified for smaller cards */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {startup.tags.slice(0, 2).map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: tagIdx === 0 ? startup.bgColor : "rgba(214, 221, 230, 0.1)",
                              color: tagIdx === 0 ? "#c1f17e" : "#d6dde6"
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {startup.tags.length > 2 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-foreground/10">
                            +{startup.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Enhanced View All button */}
              <motion.button
                className="w-full py-3 rounded-xl font-medium flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  background: "linear-gradient(90deg, rgba(193, 241, 126, 0.1) 0%, rgba(193, 241, 126, 0.2) 100%)",
                  border: "1px solid rgba(193, 241, 126, 0.3)"
                }}
                whileHover={{
                  boxShadow: "0 0 20px rgba(193, 241, 126, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-primary/10 opacity-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%", opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <span className="text-primary relative z-10 flex items-center">
                  View All Startups
                  <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced pagination dots with animated current indicator */}
        <div className="flex justify-center mt-10 space-x-3">
          {startups.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx < currentIndex ? -1 : 1);
                setCurrentIndex(idx);
              }}
              className="group relative"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-primary"
                    : "bg-foreground/20 group-hover:bg-foreground/40"
                }`}
              />
              {idx === currentIndex && (
                <motion.div
                  className="absolute -inset-2 rounded-full border border-primary/50"
                  layoutId="activeDot"
                  transition={{ duration: 0.3, type: "spring" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
