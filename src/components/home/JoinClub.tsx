import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, ChevronRight, Diamond, Crown, Award, Shield, Star } from 'lucide-react';
import { Button } from '../ui/button';

const benefits = [
  "Priority access to exclusive startup events and demos",
  "Advanced analytics and market intelligence reports",
  "Dedicated startup success manager and concierge",
  "Premium placement in the marketplace and search results",
  "Zero commission for the first 6 months on all transactions",
  "Access to the VenturesRoom private investor network"
];

export function JoinClub() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse position into rotation values
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);
  const cardBrightness = useTransform(y, [-300, 300], [1.2, 0.8]);
  
  // Animation controls for the floating elements
  const floatingControls = useAnimation();

  // Handle mouse movement for 3D rotation effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Update motion values
    x.set(mouseX);
    y.set(mouseY);
    
    // Update state for lighting effects
    setMousePosition({ x: mouseX, y: mouseY });
  };

  // Animation for floating elements
  useEffect(() => {
    floatingControls.start({
      y: [0, -15, 0],
      transition: {
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity
      }
    });
  }, [floatingControls]);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Premium background with animated gradient */}
      <div className="absolute inset-0 bg-background">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(193, 241, 126, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(138, 79, 255, 0.15) 0%, transparent 40%)
            `
          }}
        />
        
        {/* Improved grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(214, 221, 230, 0.4)" strokeWidth="0.5" />
                <circle cx="0" cy="0" r="1" fill="rgba(193, 241, 126, 0.6)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#premium-grid)" />
          </svg>
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                scale: Math.random() * 0.8 + 0.2
              }}
              animate={{
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                background: index % 3 === 0 ? "#c1f17e" : index % 3 === 1 ? "#8A4FFF" : "#d6dde6"
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left column - Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="text-primary uppercase tracking-wider font-semibold text-sm">Exclusive Membership</span>
              </div>
              
              <h2 className="text-4xl font-bold">
                <span className="text-white">Ventures</span>
                <span className="text-primary">Club</span>
                <span className="text-white"> Elite</span>
              </h2>
              
              <p className="text-lg text-foreground/80 max-w-xl">
                Elevate your startup journey with our premium membership designed for founders who demand excellence. Gain exclusive benefits, dedicated support, and privileged access to our ecosystem.
              </p>
            </motion.div>
            
            {/* Benefits list */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4"
            >
              <Button 
                className="relative group overflow-hidden px-8 py-6 text-base"
                style={{ 
                  background: "linear-gradient(90deg, rgba(193, 241, 126, 0.9) 0%, rgba(167, 238, 67, 0.9) 100%)",
                  color: "#080f17"
                }}
              >
                <motion.span
                  className="absolute inset-0 w-full h-full bg-white"
                  initial={{ x: "-100%", opacity: 0.3 }}
                  whileHover={{ x: "100%", opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 font-semibold flex items-center">
                  Apply for Membership
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <p className="text-foreground/60 mt-4 text-sm">
                Limited membership slots available. Application subject to review.
              </p>
            </motion.div>
          </div>
          
          {/* Right column - Premium card */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                rotateX: isHovered ? rotateX : 0,
                rotateY: isHovered ? rotateY : 0,
                filter: `brightness(${isHovered ? cardBrightness : 1})`,
                transformStyle: "preserve-3d",
                perspective: 1000
              }}
              className="relative w-full max-w-md h-[280px] rounded-2xl shadow-2xl cursor-pointer transition-all duration-200"
            >
              {/* Card background */}
              <div 
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(10, 10, 10, 0.98) 100%)",
                  boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Reflective gradient overlay */}
                <motion.div 
                  className="absolute inset-0"
                  style={{ 
                    background: isHovered 
                      ? `radial-gradient(circle at ${50 + (mousePosition.x / 10)}% ${50 + (mousePosition.y / 10)}%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)` 
                      : "none",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease"
                  }}
                />
                
                {/* Animated orbiting elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div 
                    className="absolute w-32 h-32 rounded-full"
                    style={{ 
                      border: "1px solid rgba(193, 241, 126, 0.3)",
                      top: "50%", 
                      left: "50%", 
                      x: "-50%", 
                      y: "-50%",
                      opacity: 0.6
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <motion.div 
                    className="absolute w-48 h-48 rounded-full"
                    style={{ 
                      border: "1px solid rgba(193, 241, 126, 0.2)",
                      top: "50%", 
                      left: "50%", 
                      x: "-50%", 
                      y: "-50%",
                      opacity: 0.4
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <motion.div 
                    className="absolute w-4 h-4 rounded-full bg-primary"
                    style={{ 
                      top: "50%", 
                      left: "50%", 
                      x: "-50%", 
                      y: "-50%",
                      marginLeft: "16px",
                      marginTop: "-60px",
                    }}
                    animate={{ 
                      rotate: 360,
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                  
                  <motion.div 
                    className="absolute w-3 h-3 rounded-full bg-tertiary"
                    style={{ 
                      top: "50%", 
                      left: "50%", 
                      x: "-50%", 
                      y: "-50%",
                      marginLeft: "-60px",
                      marginTop: "20px",
                    }}
                    animate={{ 
                      rotate: -360,
                      opacity: [0.8, 0.5, 0.8]
                    }}
                    transition={{ 
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                </div>
              </div>
              
              {/* Card content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between transform preserve-3d" style={{ transformStyle: "preserve-3d" }}>
                {/* Card header */}
                <div className="flex justify-between items-start">
                  <div className="transform" style={{ transform: "translateZ(20px)" }}>
                    <div className="text-primary font-bold tracking-wider text-sm mb-1">VENTURESROOM</div>
                    <div className="flex items-center">
                      <span className="text-white font-bold text-xl tracking-widest mr-1.5">ELITE</span>
                      <motion.div
                        animate={floatingControls}
                        style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
                      >
                        <Diamond className="h-5 w-5 text-primary" fill="#c1f17e" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <motion.div
                    style={{ transform: "translateZ(30px)" }}
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="relative h-12 w-12">
                      <div className="absolute inset-0 rounded-full bg-primary/10 backdrop-blur-sm" />
                      <div className="absolute inset-1 rounded-full bg-primary/20" />
                      <Crown className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                    </div>
                  </motion.div>
                </div>
                
                {/* Card chip */}
                <div className="flex items-center gap-2 transform" style={{ transform: "translateZ(20px)" }}>
                  <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#c1f17e] to-[#8A4FFF]/50 opacity-70" />
                  <div className="text-white/80 font-light">Founding Member</div>
                </div>
                
                {/* Card footer */}
                <div className="flex justify-between items-end transform" style={{ transform: "translateZ(20px)" }}>
                  <div>
                    <div className="text-white/50 text-xs mb-1">MEMBER SINCE</div>
                    <div className="text-white font-medium">2025</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-chart-3 opacity-70" />
                    <div className="w-5 h-5 rounded-full bg-chart-4 opacity-70" />
                    <div className="w-5 h-5 rounded-full bg-primary opacity-70" />
                  </div>
                </div>
              </div>
              
              {/* Holographic effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-20"
                style={{ 
                  background: "linear-gradient(135deg, transparent 20%, rgba(255, 255, 255, 0.1) 50%, transparent 80%)",
                  backgroundSize: "200% 200%",
                  backgroundPosition: isHovered 
                    ? `${50 + (mousePosition.x / 5)}% ${50 + (mousePosition.y / 5)}%` 
                    : "50% 50%",
                  transition: "background-position 0.1s ease"
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}