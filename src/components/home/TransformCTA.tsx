import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRightIcon, RocketIcon, CalendarIcon } from "lucide-react";

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

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut"
    }
  }
};

const glowVariants = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.7, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut"
    }
  }
};

export function TransformCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-background">
        {/* Animated gradient background */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#a7ee43]/5 to-transparent"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        />
        
        {/* Animated dots */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Accent blurs */}
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#8A4FFF]/10 blur-3xl"
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#a7ee43]/10 blur-3xl"
          variants={glowVariants}
          initial="initial"
          animate="animate"
          custom={1}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={fadeIn}
            custom={0}
            className="inline-flex items-center bg-[#a7ee43]/10 border border-[#a7ee43]/20 rounded-full px-4 py-1.5 mb-4"
          >
            <span className="text-sm font-medium text-[#a7ee43]">Launch Your Business Today</span>
          </motion.div>
          
          <motion.h2 
            variants={fadeIn} 
            custom={1} 
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#a7ee43] leading-tight"
          >
            Ready to <span className="text-[#a7ee43]">Transform</span><br className="hidden md:block" /> Your Business?
          </motion.h2>
          
          <motion.p 
            variants={fadeIn} 
            custom={2} 
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Join thousands of startups, support structures, and clients already thriving in our ecosystem.
            Take the first step toward exponential growth.
          </motion.p>
          
          <motion.div 
            variants={fadeIn} 
            custom={3} 
            className="relative z-10 flex flex-wrap gap-5 justify-center mt-10"
          >
            <Button 
              className="group relative overflow-hidden px-8 py-6 rounded-full bg-[#a7ee43] hover:bg-[#b6f25c] text-black text-lg font-semibold"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative z-10 flex items-center">
                <RocketIcon className="mr-2 h-5 w-5 transition-all duration-500 group-hover:rotate-[45deg]" />
                Get Started Now
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#a7ee43] to-[#c1f17e]"></span>
            </Button>
            
            <Button 
              variant="outline" 
              className="group relative overflow-hidden px-8 py-6 rounded-full border-gray-700 hover:border-[#a7ee43] hover:text-[#a7ee43] text-lg font-semibold"
            >
              <span className="relative z-10 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 transition-all duration-300" />
                Schedule a Demo
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-[#a7ee43]"></span>
            </Button>
          </motion.div>
          
          <motion.div
            variants={fadeIn}
            custom={4}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-white">300+</p>
              <p className="text-sm text-gray-400">Active Startups</p>
            </div>
            <div className="w-px h-12 bg-gray-800 self-center"></div>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-white">98%</p>
              <p className="text-sm text-gray-400">Customer Satisfaction</p>
            </div>
            <div className="w-px h-12 bg-gray-800 self-center"></div>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-bold text-white">24/7</p>
              <p className="text-sm text-gray-400">Support Available</p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Rocket animation on hover */}
        {isHovered && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: [0, -300],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <RocketIcon className="h-10 w-10 text-[#a7ee43]" />
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-20 bg-gradient-to-t from-transparent to-[#a7ee43]/50"></div>
          </motion.div>
        )}
      </div>
    </section>
  );
}