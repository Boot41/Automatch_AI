import React from 'react';
import { motion } from 'framer-motion';
import { Car, Smartphone, Cpu } from "lucide-react";

const CategoriesSection = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }} 
          className="text-5xl font-bold text-indigo-400 mb-4">
          Product Categories
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.3 }} 
          className="text-xl text-gray-400 max-w-3xl mx-auto">
          We offer recommendations across multiple product categories to suit your needs.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[{
          icon: Car,
          title: "Cars",
          description: "Find your perfect vehicle based on make, brand, model, features, price range, and more.",
          link: "Explore Cars →"
        }, {
          icon: Smartphone,
          title: "Smartphones",
          description: "Discover the ideal smartphone with the right specs, features, and price point for you.",
          link: "Explore Smartphones →"
        }, {
          icon: Cpu,
          title: "Electronics",
          description: "Find laptops, TVs, cameras, and other electronics that match your requirements perfectly.",
          link: "Explore Electronics →"
        }].map((category, index) => (
          <motion.div 
            key={index} 
            variants={cardVariants} 
            initial="hidden" 
            whileInView="visible" 
            whileHover="hover" 
            viewport={{ once: true }}
            className="bg-gray-800 p-8 rounded-xl shadow-md text-start cursor-pointer border border-[#292929] transition-all">
            <category.icon className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">{category.title}</h3>
            <p className="text-gray-400 mb-4">{category.description}</p>
            <a href="#" className="text-indigo-400 font-medium hover:text-indigo-400 transition-colors">{category.link}</a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;