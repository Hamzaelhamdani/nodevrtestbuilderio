import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RocketIcon,
  BuildingIcon,
  UserIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  StarIcon,
  PackageIcon,
  ShoppingBagIcon,
  BarChartIcon,
  HeartIcon,
  ZapIcon,
  TrophyIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { HowItWorks } from "./HowItWorks";
import { VenturesClubElite } from "./VenturesClubElite";
import { TransformCTA } from "./TransformCTA";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BestProducts } from "./BestProducts";
import { API_BASE_URL } from "../../utils/apiClient";
import { DataSourceIndicator } from "../DataSourceIndicator";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

// User type cards data
const userTypeCards = [
  {
    id: "startups",
    title: "For Startups",
    description:
      "Create your storefront, showcase products or services, and connect with other startups in the ecosystem.",
    icon: RocketIcon,
    iconColor: "text-[#a7ee43]",
    iconBg: "bg-[#a7ee43]/10",
    color: "bg-gradient-to-br from-[#080f17] to-[#0c131c] backdrop-blur-sm",
    link: "#startup-features",
  },
  {
    id: "incubators",
    title: "For Support Structures",
    description:
      "Register, list and promote startups you support while earning commissions on successful sales.",
    icon: BuildingIcon,
    iconColor: "text-[#8A4FFF]",
    iconBg: "bg-[#8A4FFF]/10",
    color: "bg-gradient-to-br from-[#080f17] to-[#0c131c] backdrop-blur-sm",
    link: "#incubator-features",
  },
  {
    id: "clients",
    title: "For Clients",
    description:
      "Discover innovative startups, browse curated products and services, and make secure purchases.",
    icon: UserIcon,
    iconColor: "text-[#0066FF]",
    iconBg: "bg-[#0066FF]/10",
    color: "bg-gradient-to-br from-[#080f17] to-[#0c131c] backdrop-blur-sm",
    link: "#client-features",
  },
];

// Platform stats
const platformStats = [
  {
    label: "Startups",
    value: "300+",
    color: "text-[#a7ee43]",
    icon: RocketIcon,
  },
  {
    label: "Incubators",
    value: "50+",
    color: "text-[#a7ee43]",
    icon: BuildingIcon,
  },
  { label: "Clients", value: "12+", color: "text-[#a7ee43]", icon: UserIcon },
];

// Add these interfaces after imports
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

interface UIStartup {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  tags: string[];
  rating: number;
  reviews: number;
  featured: boolean;
}

interface Incubator {
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

interface IncubatorWithStartups {
  incubatorInfo: Incubator;
  startups: any[];
  startupsCount: number;
}

export function HomePage() {
  // States for each carousel
  const [currentStartupSlide, setCurrentStartupSlide] = useState(0);
  const [currentSupportSlide, setCurrentSupportSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("startups");

  // Add new state for startups
  const [startups, setStartups] = useState<UIStartup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New states for incubators
  const [incubators, setIncubators] = useState<IncubatorWithStartups[]>([]);
  const [isIncubatorsLoading, setIsIncubatorsLoading] = useState(true);
  const [incubatorsError, setIncubatorsError] = useState<string | null>(null);

  // Functions to handle slides for startups
  const nextStartupSlide = () => {
    setCurrentStartupSlide((prev) =>
      prev === startups.length - 3 ? 0 : prev + 1,
    );
  };

  const prevStartupSlide = () => {
    setCurrentStartupSlide((prev) =>
      prev === 0 ? startups.length - 3 : prev - 1,
    );
  };

  // Functions to handle slides for support structures
  const nextSupportSlide = () => {
    setCurrentSupportSlide((prev) =>
      prev === incubators.length - 3 ? 0 : prev + 1,
    );
  };

  const prevSupportSlide = () => {
    setCurrentSupportSlide((prev) =>
      prev === 0 ? incubators.length - 3 : prev - 1,
    );
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const startupInterval = setInterval(() => {
      if (activeTab === "startups") nextStartupSlide();
    }, 5000);

    const supportInterval = setInterval(() => {
      if (activeTab === "support") nextSupportSlide();
    }, 5000);

    return () => {
      clearInterval(startupInterval);
      clearInterval(supportInterval);
    };
  }, [activeTab, currentStartupSlide, currentSupportSlide]);

  // Load startups data from Supabase
  useEffect(() => {
    const loadStartups = async () => {
      try {
        setIsLoading(true);

        // Import and use the startup service
        const { startupService } = await import(
          "../../services/startupService"
        );
        const approvedStartups = await startupService.getApprovedStartups();

        // Transform to UI format
        const transformedStartups: UIStartup[] = approvedStartups.map(
          (startup) => ({
            id: startup.id,
            name: startup.name,
            logo:
              startup.logo_url ||
              "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop",
            category: "Startup", // Can be enhanced with category field
            description:
              startup.description || `${startup.name} is an innovative startup`,
            tags: ["Startup", "Innovation"],
            rating: 4.5 + Math.random() * 0.5,
            reviews: Math.floor(Math.random() * 100) + 50,
            featured: true,
          }),
        );

        // If no data from Supabase, use fallback data
        if (transformedStartups.length === 0) {
          const fallbackStartups: UIStartup[] = [
            {
              id: "1",
              name: "TechVision AI",
              logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop",
              category: "AI/ML",
              description:
                "TechVision AI is an innovative AI/ML startup revolutionizing computer vision",
              tags: ["AI/ML", "Computer Vision", "Startup"],
              rating: 4.8,
              reviews: 127,
              featured: true,
            },
            {
              id: "2",
              name: "EcoSmart Solutions",
              logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop",
              category: "Sustainability",
              description:
                "EcoSmart Solutions creates sustainable technology for a greener future",
              tags: ["Sustainability", "GreenTech", "Startup"],
              rating: 4.6,
              reviews: 89,
              featured: true,
            },
            {
              id: "3",
              name: "FinTech Pro",
              logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2139&auto=format&fit=crop",
              category: "FinTech",
              description:
                "FinTech Pro is transforming financial services with cutting-edge solutions",
              tags: ["FinTech", "Finance", "Startup"],
              rating: 4.7,
              reviews: 156,
              featured: true,
            },
          ];
          setStartups(fallbackStartups);
        } else {
          setStartups(transformedStartups);
        }
        setError(null);
      } catch (err) {
        console.error("Error loading startups:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load startups",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStartups();
  }, []);

  // Load incubators data from Supabase
  useEffect(() => {
    const loadIncubators = async () => {
      try {
        setIsIncubatorsLoading(true);

        // Import and use the structure service
        const { structureService } = await import(
          "../../services/structureService"
        );
        const approvedStructures =
          await structureService.getApprovedStructures();

        // Transform to incubator format with mock startup data for now
        const transformedIncubators: IncubatorWithStartups[] =
          approvedStructures.map((structure, index) => ({
            incubatorInfo: {
              id: parseInt(structure.id),
              email: `contact@${structure.name.toLowerCase().replace(/\s+/g, "")}.com`,
              displayName: structure.name,
              telephone: `+1-555-0${100 + index}`,
              country: "USA", // Could be enhanced with country field
              role:
                structure.structure_type === "incubator"
                  ? "Incubator"
                  : "Accelerator",
              isApproved: structure.is_approved,
              logoPath: structure.logo_url,
              lastActiveAt: structure.updated_at,
            },
            startups: [], // Would need to fetch related startups
            startupsCount: Math.floor(Math.random() * 5) + 1, // Mock count for now
          }));

        // If no data from Supabase, use fallback data
        if (transformedIncubators.length === 0) {
          const fallbackIncubators: IncubatorWithStartups[] = [
            {
              incubatorInfo: {
                id: 1,
                email: "contact@techstart.com",
                displayName: "TechStart Accelerator",
                telephone: "+1-555-0123",
                country: "USA",
                role: "Accelerator",
                isApproved: true,
                logoPath:
                  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop",
                lastActiveAt: "2024-01-01T00:00:00Z",
              },
              startups: [
                { id: 1, displayName: "TechVision AI", role: "AI/ML" },
                { id: 2, displayName: "DataFlow Pro", role: "Analytics" },
                { id: 3, displayName: "CloudSync", role: "Cloud Services" },
              ],
              startupsCount: 3,
            },
            {
              incubatorInfo: {
                id: 2,
                email: "info@greeninnov.com",
                displayName: "Green Innovation Hub",
                telephone: "+49-30-12345678",
                country: "Germany",
                role: "Incubator",
                isApproved: true,
                logoPath:
                  "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2139&auto=format&fit=crop",
                lastActiveAt: "2024-01-01T00:00:00Z",
              },
              startups: [
                {
                  id: 4,
                  displayName: "EcoSmart Solutions",
                  role: "Sustainability",
                },
                { id: 5, displayName: "RenewTech", role: "Energy" },
              ],
              startupsCount: 2,
            },
            {
              incubatorInfo: {
                id: 3,
                email: "hello@fintechcentral.com",
                displayName: "FinTech Central",
                telephone: "+44-20-7946-0958",
                country: "UK",
                role: "Accelerator",
                isApproved: true,
                logoPath:
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2070&auto=format&fit=crop",
                lastActiveAt: "2024-01-01T00:00:00Z",
              },
              startups: [
                { id: 6, displayName: "FinTech Pro", role: "FinTech" },
                { id: 7, displayName: "PayFlow", role: "Payments" },
                { id: 8, displayName: "CryptoSecure", role: "Blockchain" },
                { id: 9, displayName: "InvestSmart", role: "Investment" },
              ],
              startupsCount: 4,
            },
          ];
          setIncubators(fallbackIncubators);
        } else {
          setIncubators(transformedIncubators);
        }

        setIncubatorsError(null);
      } catch (err) {
        console.error("Error loading incubators:", err);
        setIncubatorsError(
          err instanceof Error ? err.message : "Failed to load incubators",
        );
      } finally {
        setIsIncubatorsLoading(false);
      }
    };

    loadIncubators();
  }, []);

  // Replace the featuredStartups constant with the dynamic data
  const displayStartups = startups;

  // Add this helper function to calculate success rate
  const calculateSuccessRate = (startupsCount: number) => {
    // Base success rate
    const baseRate = 65;
    // Additional rate based on number of startups (max 25%)
    const additionalRate = Math.min(25, startupsCount * 2);
    return baseRate + additionalRate;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Updated to match the reference image */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#080f17] px-4">
        {/* Subtle stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 5 + 3}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto w-full z-10 text-center">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-[#a7ee43]">VENTURES</span>
              <span className="text-white">ROOM</span>
            </h1>

            {/* Tagline */}
            <p className="text-base md:text-lg text-gray-300 mb-16 max-w-2xl">
              The future of startup ecosystems. Connect, collaborate, and scale
              in our digital venture space.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-12 mb-16">
              {platformStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i + 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full border border-[#1e293b] bg-[#0f172a]/50 flex items-center justify-center mb-3">
                    <stat.icon className="h-6 w-6 text-[#a7ee43]" />
                  </div>
                  <span className="text-2xl font-bold mb-1 text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-[#a7ee43] hover:bg-[#b6f25c] text-black px-8 py-6 text-base rounded-full transition-all"
                onClick={() => window.navigateTo?.("auth")}
              >
                Get Started
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border border-gray-700 hover:border-[#a7ee43]/50 hover:bg-white/5 text-white px-8 py-6 text-base rounded-full"
                onClick={() => window.navigateTo?.("marketplace")}
              >
                Explore Marketplace
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tailored For Everyone Section */}
      <section className="py-24 px-4 relative">
        {/* Enhanced background with gradients and decorative elements */}
        <div className="absolute inset-0 bg-[#080f17] overflow-hidden">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080f17] via-[#0a1019] to-[#080f17]"></div>

          {/* Subtle radial gradients */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#a7ee43]/3 blur-[100px] opacity-40"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#8A4FFF]/3 blur-[120px] opacity-30"></div>
          </div>

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(rgba(214, 221, 230, 0.8) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          ></div>

          {/* Subtle animated glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full bg-[#a7ee43]/5 blur-[150px]"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              transform: "translate(-50%, -50%)",
            }}
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-[#080f17] via-[#131e29] to-[#080f17] p-1.5 rounded-full mb-4">
              <div className="bg-[#a7ee43]/10 px-4 py-1.5 rounded-full">
                <span className="text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#a7ee43] to-[#c1f17e]">
                  Complete Ecosystem
                </span>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tailored For <span className="text-[#a7ee43]">Everyone</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              VenturesRoom offers specialized features for each user type in the
              startup ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypeCards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`rounded-2xl p-8 h-full transition-all ${card.color} border border-gray-800 hover:border-[#a7ee43]/50 hover:shadow-lg hover:shadow-[#a7ee43]/5 backdrop-blur-md`}
                whileHover={{ y: -5 }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                custom={index}
              >
                <div
                  className={`${card.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}
                >
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  {card.title}
                </h3>
                <p className="text-gray-400 mb-6">{card.description}</p>
                <a
                  href={card.link}
                  className="inline-flex items-center text-[#a7ee43] hover:text-[#b6f25c]"
                >
                  Learn more <ChevronRightIcon className="ml-1 h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background with subtle gradients */}
        <div className="absolute inset-0 bg-[#080f17] overflow-hidden">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080f17] via-[#0a1221] to-[#080f17]"></div>

          {/* Subtle glow effects */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#8A4FFF]/5 blur-[150px] opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#a7ee43]/5 blur-[150px] opacity-30"></div>

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(rgba(214, 221, 230, 0.5) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-gradient-to-r from-[#080f17] via-[#131e29] to-[#080f17] p-1.5 rounded-full mb-4">
              <div className="bg-[#a7ee43]/10 px-4 py-1.5 rounded-full">
                <span className="text-sm font-semibold uppercase tracking-wider text-[#a7ee43]">
                  Discover Excellence
                </span>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#a7ee43]">Featured</span> Highlights
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore the best of our ecosystem across startups, products, and
              support structures
            </p>
          </motion.div>

          {/* Tabs for different categories */}
          <Tabs
            defaultValue="startups"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#0c131d] border border-gray-800 p-1 rounded-full">
                <TabsTrigger
                  value="startups"
                  className="rounded-full px-6 py-3 data-[state=active]:bg-[#a7ee43] data-[state=active]:text-black transition-all duration-300"
                >
                  <RocketIcon className="h-4 w-4 mr-2" />
                  Best Startups
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="rounded-full px-6 py-3 data-[state=active]:bg-[#a7ee43] data-[state=active]:text-black transition-all duration-300"
                >
                  <PackageIcon className="h-4 w-4 mr-2" />
                  Best Products
                </TabsTrigger>
                <TabsTrigger
                  value="support"
                  className="rounded-full px-6 py-3 data-[state=active]:bg-[#a7ee43] data-[state=active]:text-black transition-all duration-300"
                >
                  <BuildingIcon className="h-4 w-4 mr-2" />
                  Best Support
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab content for startups */}
            <TabsContent value="startups" className="outline-none">
              {isLoading ? (
                <div className="text-center py-12">Loading startups...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-12">{error}</div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#a7ee43]/10 flex items-center justify-center mr-4">
                        <TrophyIcon className="h-5 w-5 text-[#a7ee43]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Best Featured Startups
                      </h3>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/5 border-gray-800 hover:bg-white/10 hover:border-[#a7ee43]/50 rounded-full h-10 w-10"
                        onClick={prevStartupSlide}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/5 border-gray-800 hover:bg-white/10 hover:border-[#a7ee43]/50 rounded-full h-10 w-10"
                        onClick={nextStartupSlide}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentStartupSlide * (100 / displayStartups.length) * 3}%)`,
                      }}
                    >
                      {displayStartups.map((startup) => (
                        <div
                          key={startup.id}
                          className="min-w-[calc(100%-1rem)] sm:min-w-[calc(50%-1rem)] md:min-w-[calc(33.333%-1rem)] px-2"
                        >
                          <motion.div
                            className="startup-card bg-[#0c131d]/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-full"
                            whileHover={{ y: -5 }}
                          >
                            <div className="relative">
                              <ImageWithFallback
                                src={startup.logo}
                                alt={startup.name}
                                className="w-full h-48 object-cover"
                                width={400}
                                height={200}
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-black/50 backdrop-blur-sm text-white border-0">
                                  {startup.category}
                                </Badge>
                              </div>
                              {startup.featured && (
                                <div className="absolute top-4 right-4">
                                  <Badge className="bg-[#a7ee43] text-black border-0 flex items-center">
                                    <StarIcon className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-semibold mb-2">
                                {startup.name}
                              </h3>
                              <p className="text-gray-400 text-sm mb-4">
                                {startup.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-6">
                                {startup.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-[#a7ee43]/10 text-[#a7ee43] px-2 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-medium">
                                    {startup.rating}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({startup.reviews})
                                  </span>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-white/5 hover:bg-white/10 border-gray-800 hover:border-[#a7ee43]/50"
                                  onClick={() =>
                                    window.navigateTo?.("startup-storefront", {
                                      startupId: startup.id,
                                    })
                                  }
                                >
                                  View Profile
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Tab content for products and services */}
            <TabsContent value="products" className="outline-none">
              <BestProducts />
            </TabsContent>

            {/* Tab content for support structures */}
            <TabsContent value="support" className="outline-none">
              {isIncubatorsLoading ? (
                <div className="text-center py-12">
                  Loading support structures...
                </div>
              ) : incubatorsError ? (
                <div className="text-center text-red-500 py-12">
                  {incubatorsError}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#0066FF]/10 flex items-center justify-center mr-4">
                        <BarChartIcon className="h-5 w-5 text-[#0066FF]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Best Support Structures
                      </h3>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/5 border-gray-800 hover:bg-white/10 hover:border-[#0066FF]/50 rounded-full h-10 w-10"
                        onClick={prevSupportSlide}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/5 border-gray-800 hover:bg-white/10 hover:border-[#0066FF]/50 rounded-full h-10 w-10"
                        onClick={nextSupportSlide}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSupportSlide * (100 / incubators.length) * 3}%)`,
                      }}
                    >
                      {incubators.map((item) => (
                        <div
                          key={item.incubatorInfo.id}
                          className="min-w-[calc(100%-1rem)] sm:min-w-[calc(50%-1rem)] md:min-w-[calc(33.333%-1rem)] px-2"
                        >
                          <motion.div
                            className="startup-card bg-[#0c131d]/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-full"
                            whileHover={{ y: -5 }}
                          >
                            <div className="relative">
                              <ImageWithFallback
                                src={
                                  item.incubatorInfo.logoPath
                                    ? `${API_BASE_URL}${item.incubatorInfo.logoPath}`
                                    : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"
                                }
                                alt={item.incubatorInfo.displayName}
                                className="w-full h-48 object-cover"
                                width={400}
                                height={200}
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-black/50 backdrop-blur-sm text-white border-0">
                                  {item.incubatorInfo.role}
                                </Badge>
                              </div>
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-[#0066FF] text-white border-0 flex items-center">
                                  <StarIcon className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              </div>
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-semibold mb-2">
                                {item.incubatorInfo.displayName}
                              </h3>
                              <p className="text-gray-400 text-sm mb-4">
                                {item.incubatorInfo.country || "International"}{" "}
                                based {item.incubatorInfo.role} supporting
                                innovative startups.
                              </p>

                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#0c131d] rounded-lg p-3 border border-gray-800">
                                  <p className="text-xs text-gray-400 mb-1">
                                    Startups Supported
                                  </p>
                                  <p className="text-xl font-bold text-white">
                                    {item.startupsCount}
                                  </p>
                                </div>
                                <div className="bg-[#0c131d] rounded-lg p-3 border border-gray-800">
                                  <p className="text-xs text-gray-400 mb-1">
                                    Success Rate
                                  </p>
                                  <p className="text-xl font-bold text-[#0066FF]">
                                    {calculateSuccessRate(item.startupsCount)}%
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {[
                                  item.incubatorInfo.role,
                                  item.incubatorInfo.country || "Global",
                                  "Innovation",
                                ].map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-[#0066FF]/10 text-[#0066FF] px-2 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                                  <span className="text-sm font-medium">
                                    {(4 + Math.random()).toFixed(1)}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({Math.floor(Math.random() * 100 + 50)})
                                  </span>
                                </div>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-white/5 hover:bg-white/10 border-gray-800 hover:border-[#0066FF]/50"
                                  onClick={() =>
                                    window.navigateTo?.(
                                      "support-structure-dashboard",
                                    )
                                  }
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
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-12">
            <Button
              className="bg-white/5 backdrop-blur-sm border border-gray-700 hover:bg-white/10 hover:border-[#a7ee43]/50 text-white rounded-full px-8"
              onClick={() => window.navigateTo?.("marketplace")}
            >
              View All{" "}
              {activeTab === "startups"
                ? "Startups"
                : activeTab === "products"
                  ? "Products & Services"
                  : "Support Structures"}
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* VenturesClub Elite */}
      <VenturesClubElite />

      {/* Call to Action */}
      <TransformCTA />

      {/* Data Source Indicator */}
      <DataSourceIndicator />
    </div>
  );
}
