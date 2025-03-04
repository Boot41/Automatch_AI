import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Car,
  Smartphone,
  Cpu,
  MapPin,
  Search,
  ThumbsUp,
} from "lucide-react";
import HomeLandingPage from "../Home/HomeLandingPage";
import Features from "../Components/Features";
import CategoriesSection from "../Components/CategoriesSection";
import Testimonial from "../Components/Testimonial";
import Footer from "../Components/Footer";
// import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/chat");
  };

  return (
    <>

    <div className="w-full bg-gradient-to-b from-blue-50 to-blue-300">
      {/* Hero Section */}
      <HomeLandingPage/>

      {/* Features Section */}
      <Features/>

      {/* Categories Section */}
        <CategoriesSection/>

      {/* Testimonials Section */}
      <Testimonial/>
    </div>

    <Footer/>
    </>
  );
};

export default HomePage;