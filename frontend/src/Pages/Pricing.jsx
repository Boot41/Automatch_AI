import React, { useRef } from "react";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import PricingCard from "../Components/PricingCard";
import { ArrowDown } from "lucide-react";
import Footer from "../Components/Footer";

const pricingPlans = [
  {
    title: "Basic Plan",
    price: "$0/mo",
    features: ["AI Product Recommendations", "Basic Dealer Search", "Email Support"],
    delay: 0.2,
  },
  {
    title: "Pro Plan",
    price: "$49/mo",
    features: ["Advanced AI Recommendations", "Location-Based Dealer Search", "Priority Support", "AI Chatbot Assistance"],
    delay: 0.4,
  },
  {
    title: "Enterprise Plan",
    price: "Custom Pricing",
    features: ["Personalized AI Chatbot", "Instant Dealer Connectivity", "24/7 Premium Support", "Custom Integrations"],
    delay: 0.6,
  },
];

const Pricing = () => {
  const pricingRef = useRef(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center p-10 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-0 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute bottom-10 right-0 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-600 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full filter blur-3xl opacity-50 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full filter blur-3xl opacity-50 animate-bounce"></div>
        </div>

        {/* Landing Page Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-8 mb-20 z-10"
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in">
            Automatch AI - Smart Pricing Plans
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
            Choose a plan tailored to your needs and enjoy seamless AI-powered product recommendations.
          </p>
          <ArrowDown 
            className="text-center items-center mx-auto rounded-full bg-white text-black w-10 h-10 p-2 animate-bounce cursor-pointer" 
            onClick={scrollToPricing} 
          />
        </motion.div>
      </div>

      <motion.div
        ref={pricingRef}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <PricingCard />
        <Footer/>
      </motion.div>
    </>
  );
};

export default Pricing;