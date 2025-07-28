import React from "react";
import { motion } from "framer-motion";
import { 
  UserPlusIcon, 
  PaletteIcon, 
  UsersIcon, 
  CreditCardIcon,
  CheckCircle2Icon, 
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  ShieldIcon,
  ZapIcon
} from "lucide-react";
import { Button } from "../ui/button";

// Enhanced step data with supporting info for mini-cards
const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up and select your role as a startup, incubator, or client to access tailored features.",
    icon: UserPlusIcon,
    color: "from-[#a7ee43]/20 to-[#95d838]/5",
    iconColor: "text-[#a7ee43]",
    bgColor: "bg-[#a7ee43]",
    miniDescription: "Quick 2-minute signup",
    supportPoints: [
      { text: "No credit card required", icon: CheckIcon },
      { text: "Secure authentication", icon: ShieldIcon },
      { text: "Role-based access", icon: StarIcon }
    ]
  },
  {
    number: "02",
    title: "Build Profile",
    description: "Customize your storefront or dashboard with your unique branding, offerings, and showcase your value proposition.",
    icon: PaletteIcon,
    color: "from-[#8A4FFF]/20 to-[#7a3afd]/5",
    iconColor: "text-[#8A4FFF]",
    bgColor: "bg-[#8A4FFF]",
    miniDescription: "Intuitive profile builder",
    supportPoints: [
      { text: "Customizable layouts", icon: CheckIcon },
      { text: "Brand identity tools", icon: PaletteIcon },
      { text: "SEO optimization", icon: ZapIcon }
    ]
  },
  {
    number: "03",
    title: "Connect",
    description: "Discover startups and support structures through our intelligent matching system based on your specific needs and interests.",
    icon: UsersIcon,
    color: "from-[#0066FF]/20 to-[#0055cc]/5", 
    iconColor: "text-[#0066FF]",
    bgColor: "bg-[#0066FF]",
    miniDescription: "AI-powered matching",
    supportPoints: [
      { text: "Smart recommendation engine", icon: ZapIcon },
      { text: "Direct messaging", icon: CheckIcon },
      { text: "Collaboration tools", icon: UsersIcon }
    ]
  },
  {
    number: "04",
    title: "Transact",
    description: "Buy, sell, or promote with ease using our secure payment and commission tracking system with full transparency.",
    icon: CreditCardIcon,
    color: "from-[#FF6B00]/20 to-[#cc5500]/5",
    iconColor: "text-[#FF6B00]",
    bgColor: "bg-[#FF6B00]",
    miniDescription: "Secure payment system",
    supportPoints: [
      { text: "Multiple payment options", icon: CheckIcon },
      { text: "Automated commission tracking", icon: CreditCardIcon },
      { text: "Transparent fee structure", icon: ShieldIcon }
    ]
  }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const pulseVariants = {
  initial: { scale: 1, opacity: 0.8 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function HowItWorks() {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-[#a7ee43]/5 blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/6 w-72 h-72 rounded-full bg-[#8A4FFF]/5 blur-3xl opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          custom={0}
        >
          <div className="inline-block bg-gradient-to-r from-[#080f17] via-[#131e29] to-[#080f17] p-1.5 rounded-full mb-4">
            <div className="bg-[#a7ee43]/10 px-4 py-1.5 rounded-full">
              <span className="text-sm font-semibold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#a7ee43] to-[#c1f17e]">
                Simple Process
              </span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-[#a7ee43]">It Works</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join VenturesRoom and transform your business in four simple steps
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative mb-20">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-gray-800/50 via-[#a7ee43]/30 to-gray-800/50 transform -translate-x-1/2 z-0">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#a7ee43]/50 to-transparent"
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ 
                opacity: [0, 1, 0], 
                height: "100%",
                transition: { 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "loop"
                } 
              }}
              viewport={{ once: false }}
            />
          </div>

          {/* Steps */}
          <div className="relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className="mb-20 last:mb-8"
              >
                {/* Desktop view with main content on one side and mini cards on the other */}
                <div className="hidden md:grid md:grid-cols-7 items-center gap-6">
                  {/* Left side content */}
                  <motion.div 
                    className="col-span-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={index % 2 === 0 ? slideInLeft : slideInRight}
                  >
                    {index % 2 === 0 ? (
                      // Main content for even steps
                      <div className="flex justify-end">
                        <motion.div 
                          className={`
                            relative overflow-hidden bg-gray-900/70 
                            border border-gray-800 rounded-xl p-8 max-w-sm w-full 
                            backdrop-blur-sm transition-all duration-300
                            hover:border-${step.bgColor}/40 hover:shadow-lg hover:shadow-${step.bgColor}/5
                          `}
                          whileHover={{ 
                            y: -5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          {/* Gradient background */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-30`}></div>
                          
                          <div className="relative z-10 text-right">
                            <div className="flex items-center justify-end mb-6 gap-4">
                              <div className="flex items-center justify-center h-8 px-3 rounded-full bg-[#a7ee43]/10 text-[#a7ee43] font-bold">
                                {step.number}
                              </div>
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/60 backdrop-blur-sm border border-gray-700">
                                <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                              </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                            
                            <div className="flex justify-end mt-6">
                              <span className="inline-flex items-center bg-black/30 px-3 py-1 rounded-full text-sm text-gray-300">
                                {step.miniDescription}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      // Mini support cards for odd steps
                      <div className="space-y-3 pr-8">
                        {step.supportPoints.map((point, i) => (
                          <motion.div
                            key={i}
                            className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 backdrop-blur-sm flex items-center gap-3 hover:border-gray-700 transition-all duration-300"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ 
                              opacity: 1, 
                              x: 0,
                              transition: { delay: i * 0.1 + 0.2, duration: 0.3 }
                            }}
                            viewport={{ once: true }}
                          >
                            <div className={`w-8 h-8 rounded-full ${step.bgColor}/20 flex items-center justify-center`}>
                              <point.icon className={`h-4 w-4 ${step.iconColor}`} />
                            </div>
                            <p className="text-sm text-gray-300">{point.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Center circle marker - column 4 */}
                  <div className="col-span-1 flex justify-center">
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-gray-800/90 border border-gray-700 flex items-center justify-center relative"
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      variants={pulseVariants}
                    >
                      <div className="absolute inset-0 rounded-full bg-[#a7ee43]/20"></div>
                      <motion.div 
                        className={`w-10 h-10 rounded-full ${step.bgColor} flex items-center justify-center`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <CheckCircle2Icon className="h-6 w-6 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Right side content */}
                  <motion.div 
                    className="col-span-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={index % 2 === 1 ? slideInLeft : slideInRight}
                  >
                    {index % 2 === 1 ? (
                      // Main content for odd steps
                      <motion.div 
                        className={`
                          relative overflow-hidden bg-gray-900/70 
                          border border-gray-800 rounded-xl p-8 max-w-sm w-full 
                          backdrop-blur-sm transition-all duration-300
                          hover:border-${step.bgColor}/40 hover:shadow-lg hover:shadow-${step.bgColor}/5
                        `}
                        whileHover={{ 
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        {/* Gradient background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-30`}></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center mb-6 gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/60 backdrop-blur-sm border border-gray-700">
                              <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                            </div>
                            <div className="flex items-center justify-center h-8 px-3 rounded-full bg-[#a7ee43]/10 text-[#a7ee43] font-bold">
                              {step.number}
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                          <p className="text-gray-400">{step.description}</p>
                          
                          <div className="mt-6">
                            <span className="inline-flex items-center bg-black/30 px-3 py-1 rounded-full text-sm text-gray-300">
                              {step.miniDescription}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // Mini support cards for even steps
                      <div className="space-y-3 pl-8">
                        {step.supportPoints.map((point, i) => (
                          <motion.div
                            key={i}
                            className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 backdrop-blur-sm flex items-center gap-3 hover:border-gray-700 transition-all duration-300"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ 
                              opacity: 1, 
                              x: 0,
                              transition: { delay: i * 0.1 + 0.2, duration: 0.3 }
                            }}
                            viewport={{ once: true }}
                          >
                            <div className={`w-8 h-8 rounded-full ${step.bgColor}/20 flex items-center justify-center`}>
                              <point.icon className={`h-4 w-4 ${step.iconColor}`} />
                            </div>
                            <p className="text-sm text-gray-300">{point.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Mobile view - stacked layout */}
                <motion.div 
                  className="md:hidden"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeIn}
                  custom={index + 1}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-10 h-10 rounded-full ${step.bgColor} flex items-center justify-center`}>
                        <step.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 w-full backdrop-blur-sm">
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center justify-center h-7 px-3 rounded-full bg-[#a7ee43]/10 text-[#a7ee43] font-bold text-sm">
                          {step.number}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-white text-center">{step.title}</h3>
                      <p className="text-gray-400 text-center text-sm">{step.description}</p>
                      
                      <div className="flex justify-center mt-4">
                        <span className="inline-flex items-center bg-black/30 px-3 py-1 rounded-full text-xs text-gray-300">
                          {step.miniDescription}
                        </span>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        {step.supportPoints.map((point, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <div className={`w-5 h-5 rounded-full ${step.bgColor}/20 flex items-center justify-center flex-shrink-0`}>
                              <point.icon className={`h-3 w-3 ${step.iconColor}`} />
                            </div>
                            <p>{point.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Connector line for mobile (except last item) */}
                    {index < steps.length - 1 && (
                      <div className="h-8 w-0.5 bg-gray-800 my-2"></div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button 
            className="relative overflow-hidden group bg-[#a7ee43] hover:bg-[#b6f25c] text-black px-8 py-6 text-lg rounded-full transition-all"
          >
            <span className="relative z-10 flex items-center">
              Start Your Journey 
              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#a7ee43] to-[#c1f17e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
          <p className="mt-3 text-sm text-gray-500">No credit card required. Start with a free account.</p>
        </motion.div>
      </div>
    </section>
  );
}