
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Building, Users } from 'lucide-react';

// Card animation variants
const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
    },
  }),
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
    },
  }),
  hover: {
    y: -10,
    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
    transition: {
      duration: 0.3,
    },
  },
};

// Featured cards data
const cards = [
  {
    title: "For Startups",
    description: "Create your storefront, showcase products, offer services, and connect with support structures for growth opportunities.",
    icon: <Zap size={24} />,
    bgGradient: "linear-gradient(135deg, rgba(193, 241, 126, 0.15) 0%, rgba(193, 241, 126, 0.3) 100%)",
    textColor: "#c1f17e",
  },
  {
    title: "For Support Structures",
    description: "Accelerators, VCs, and incubators can register, promote supported startups, and earn commissions on their sales.",
    icon: <Building size={24} />,
    bgGradient: "linear-gradient(135deg, rgba(138, 79, 255, 0.15) 0%, rgba(138, 79, 255, 0.3) 100%)",
    textColor: "#8A4FFF",
  },
  {
    title: "For Clients",
    description: "Discover innovative startups, browse solutions, and purchase products or services with confidence.",
    icon: <Users size={24} />,
    bgGradient: "linear-gradient(135deg, rgba(0, 102, 255, 0.15) 0%, rgba(0, 102, 255, 0.3) 100%)",
    textColor: "#0066FF",
  },
];

export function FeaturedCards() {
  return (
    <div className="w-full py-20 px-4 relative overflow-hidden">
      {/* Section title */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold mb-4 text-white">
          <span className="text-primary">Tailored</span> For Everyone
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          VenturesRoom offers specialized features for each user type in the startup ecosystem
        </p>
      </motion.div>
      
      {/* Cards grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-2xl overflow-hidden relative group"
            style={{ perspective: "1000px" }}
          >
            {/* Card content */}
            <div 
              className="p-8 h-full flex flex-col justify-between relative z-10"
              style={{ 
                background: card.bgGradient,
                minHeight: "320px"
              }}
            >
              {/* Top section */}
              <div>
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {React.cloneElement(card.icon, { color: card.textColor })}
                </div>
                
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{ color: card.textColor }}
                >
                  {card.title}
                </h3>
                
                <p 
                  className="mb-6"
                  style={{ color: `${card.textColor}CC` }}
                >
                  {card.description}
                </p>
              </div>
              
              {/* Bottom section */}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center"
              >
                <span 
                  className="font-semibold mr-2"
                  style={{ color: card.textColor }}
                >
                  Learn more
                </span>
                <ArrowRight size={16} color={card.textColor} />
              </motion.div>
            </div>
            
            {/* Geometric decoration */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 opacity-20 transform rotate-45 translate-x-10 -translate-y-10 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"
              style={{ 
                background: "linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.3) 100%)",
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%"
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
