import React from "react";
import { motion } from "framer-motion";
import { CheckIcon, StarIcon, ChevronRightIcon, AwardIcon, BadgeCheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";

// Simple fade-in animation
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

// Benefits data
const benefits = [
  {
    title: "Priority access to exclusive startup events and demos",
    icon: StarIcon
  },
  {
    title: "Advanced analytics and market intelligence reports",
    icon: BadgeCheckIcon
  },
  {
    title: "Dedicated startup success manager and concierge",
    icon: CheckIcon
  },
  {
    title: "Premium placement in the marketplace and search results",
    icon: StarIcon
  },
  {
    title: "Zero commission for the first 6 months on all transactions",
    icon: CheckIcon
  },
  {
    title: "Access to the VenturesRoom private investor network",
    icon: BadgeCheckIcon
  }
];

export function VenturesClubElite() {
  return (
    <section className="relative py-24 bg-[#080f17] overflow-hidden">
      {/* Simple, clean background with minimal accents */}
      <div className="absolute inset-0">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080f17] via-[#0a1221] to-[#080f17]"></div>
        
        {/* Subtle grid pattern for texture */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(214, 221, 230, 0.5) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        ></div>
        
        {/* Simple, subtle accent glows - very minimal */}
        <div className="absolute w-full h-full">
          {/* Single accent glow in the top left - very subtle */}
          <div 
            className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#a7ee43]/[0.02] blur-[120px]"
          />
          
          {/* Single accent glow in the bottom right - very subtle */}
          <div 
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#8A4FFF]/[0.02] blur-[120px]"
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content section - 8 columns on large screens */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1, transition: { duration: 0.8 } }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 bg-[#a7ee43]/10 px-3 py-1 rounded-full mb-6">
                <StarIcon className="h-4 w-4 text-[#a7ee43]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#a7ee43]">
                  EXCLUSIVE MEMBERSHIP
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ventures<span className="text-[#a7ee43]">Club</span> Elite
              </h2>
              
              <p className="text-gray-400 mb-8 max-w-2xl">
                Elevate your startup journey with our premium membership designed 
                for founders who demand excellence. Gain exclusive benefits, 
                dedicated support, and privileged access to our ecosystem.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn}
                  custom={index * 0.15}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-transparent">
                    <benefit.icon className="h-5 w-5 text-[#a7ee43]" />
                  </div>
                  <p className="text-gray-300">{benefit.title}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10"
            >
              <Button 
                className="bg-[#a7ee43] hover:bg-[#b6f25c] text-black px-8 py-6 text-lg rounded-full transition-all"
              >
                <span className="relative z-10 flex items-center">
                  Apply for Membership 
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </span>
              </Button>
              <p className="text-sm text-gray-500 mt-3">Limited membership slots available. Application subject to review.</p>
            </motion.div>
          </div>
          
          {/* Membership card section - 5 columns on large screens */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative"
            >
              {/* Membership card */}
              <div className="relative bg-[#0c131d] rounded-2xl overflow-hidden border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c131d] to-black opacity-50"></div>
                
                <div className="relative p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-sm text-gray-400 uppercase mb-1">VENTURESROOM</h3>
                      <h2 className="text-xl text-white font-bold">ELITE</h2>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#a7ee43]/20 flex items-center justify-center">
                      <StarIcon className="h-4 w-4 text-[#a7ee43]" />
                    </div>
                  </div>
                  
                  <div className="h-12"></div>
                  
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-4 h-4 rounded-full bg-[#a7ee43]"></div>
                    <p className="text-gray-300 text-sm">Founding Member</p>
                  </div>
                  
                  <div className="h-24"></div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase">MEMBER SINCE</span>
                    <span className="text-white font-semibold">2025</span>
                  </div>
                  
                  <div className="absolute bottom-8 right-8 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#a7ee43]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#8A4FFF]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#0066FF]"></div>
                  </div>
                </div>
              </div>
              
              {/* Card shadow */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[80%] h-8 bg-[#a7ee43]/5 blur-xl rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}