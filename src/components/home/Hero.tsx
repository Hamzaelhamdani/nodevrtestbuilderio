
import React from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FuturisticBackground } from '../ui/FuturisticBackground';

export function Hero() {
  return (
    <FuturisticBackground>
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Glowing orb accent */}
        <div 
          className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(193, 241, 126, 0.4) 0%, rgba(193, 241, 126, 0.1) 40%, rgba(8, 15, 23, 0) 70%)',
            filter: 'blur(40px)',
            zIndex: 1
          }}
        />
        
        {/* Geometric accent shapes */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 border border-primary/20"
          style={{ background: 'rgba(193, 241, 126, 0.03)' }}
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 45, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-20 w-32 h-32 border border-primary/20"
          style={{ 
            background: 'rgba(193, 241, 126, 0.03)',
            borderRadius: '50% 50% 50% 0'
          }}
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: -20, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
        />
        
        {/* Main content */}
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Logo animation */}
          <motion.div
            className="mb-6 inline-block"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-0 tracking-tighter">
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="text-primary">VENTURES</span>
                <span className="text-white">ROOM</span>
              </motion.span>
            </h1>
          </motion.div>
          
          {/* Animated tagline */}
          <motion.div
            className="overflow-hidden mb-8"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto font-light">
              The future of startup ecosystems. Connect, collaborate, and scale in our digital venture space.
            </h2>
          </motion.div>
          
          {/* Stats counter with glowing border */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { value: "300+", label: "Startups", icon: "🚀" },
              { value: "50+", label: "Incubators", icon: "🏢" },
              { value: "12K+", label: "Clients", icon: "👥" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-4 rounded-xl" 
                style={{
                  background: 'rgba(30, 30, 30, 0.5)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: index === 1 ? '0 0 20px rgba(193, 241, 126, 0.15)' : 'none',
                  border: index === 1 ? '1px solid rgba(193, 241, 126, 0.3)' : '1px solid rgba(214, 221, 230, 0.1)'
                }}
              >
                <div className="text-4xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-foreground/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(193, 241, 126, 0.5)' 
              }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
            
            <motion.button
              className="px-8 py-4 rounded-full bg-transparent text-foreground font-semibold text-lg border border-foreground/20"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(214, 221, 230, 0.1)' 
              }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Marketplace
            </motion.button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.5, duration: 1 },
            y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-foreground/60 mb-2">Scroll to explore</span>
            <div className="w-5 h-10 border-2 border-foreground/20 rounded-full flex justify-center p-1">
              <motion.div 
                className="w-1 h-2 bg-primary rounded-full"
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </FuturisticBackground>
  );
}
