import React from 'react';
import { FaFacebook, FaWhatsapp, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MessageSquare } from "lucide-react";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-10 py-10 flex flex-col md:flex-row justify-between items-start">
        {/* Logo Section on the Left */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/4 pb-6 md:pb-0">
          <div className="flex items-center gap-3">
            <Link to={"/"} className='flex items-start gap-2' onClick={handleClick}>
            <MessageSquare className="h-10 w-10 text-indigo-400 animate-spin-slow" />
            <h2 className="text-2xl font-semibold text-indigo-400">AutoMatch AI</h2>
            </Link>
          </div>
          <p className="text-md text-gray-400 mt-2">Your Personal AI Product Matcher</p>
        </div>

        {/* Empty Space in the Middle */}
        <div className="hidden md:block w-1/4"></div>

        {/* Links, Auth, and Socials on the Right */}
        <div className="flex flex-wrap justify-between w-full md:w-2/4 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-indigo-400 transition duration-300">
                <Link onClick={handleClick} to="/">Home</Link>
              </li>
              <li className="hover:text-indigo-400 transition duration-300">
                <Link onClick={handleClick} to="/chat">Chat</Link>
              </li>
              <li className="hover:text-indigo-400 transition duration-300">
                <Link onClick={handleClick} to="/about">About</Link>
              </li>
              <li className="hover:text-indigo-400 transition duration-300">
                <Link onClick={handleClick} to="/pricing">Pricing</Link>
              </li>
            </ul>
          </div>

          {/* Auth Section */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Auth</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-indigo-400 transition duration-300">
                <Link onClick={handleClick} to="/signin">Sign In</Link>
              </li>
              <li className="hover:text-indigo-400 transition duration-300">
                <Link onClick={handleClick} to="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Connect With Us</h3>
            <div className="flex gap-6">
              <Link onClick={handleClick} to="/" className="text-blue-600 hover:text-blue-800 transition duration-300">
                <FaFacebook className="text-3xl" />
              </Link>
              <Link onClick={handleClick} to="/" className="text-green-600 hover:text-green-800 transition duration-300">
                <FaWhatsapp className="text-3xl" />
              </Link>
              <Link onClick={handleClick} to="/" className="text-blue-700 hover:text-blue-900 transition duration-300">
                <FaLinkedin className="text-3xl" />
              </Link>
              <Link onClick={handleClick} to="/" className="text-pink-600 hover:text-pink-800 transition duration-300">
                <FaInstagram className="text-3xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Part with Half Visible Text */}
      <div className="relative w-full bg-gray-900 overflow-hidden h-[30px] md:h-[150px] flex items-end">
        <h1 className="text-[60px] md:text-[200px] text-gray-500 leading-none text-center w-full mb-[-25px] md:mb-[-80px]">
          AutoMatch AI
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
