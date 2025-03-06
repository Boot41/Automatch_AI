import React from 'react';
import { FaFacebook, FaWhatsapp, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MessageSquare } from "lucide-react";

const Footer = () => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 relative border-t border-gray-700">
      <div className="max-w-7xl mx-auto p-10 flex justify-between">
        <div className="flex flex-col items-center md:items-start text-center md:text-left pl-5">
          <MessageSquare className="h-10 w-10 text-indigo-400 animate-spin-slow" />
          <p className="text-md text-gray-400 mt-2">
            Your Personal AI Product Matcher
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-indigo-400 transition duration-300">
              <Link onClick={handleClick} to="/chatbot">Chat</Link>
            </li>
            <li className="hover:text-indigo-400 transition duration-300">
              <Link onClick={handleClick} to="/about">About</Link>
            </li>
            <li className="hover:text-indigo-400 transition duration-300">
              <Link onClick={handleClick} to="/contact">Contact Us</Link>
            </li>
            <li className="hover:text-indigo-400 transition duration-300">
              <Link onClick={handleClick} to="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Connect With Us</h3>
          <div className="flex gap-6 justify-center md:justify-start">
            <Link to="#" className="text-blue-600 hover:text-blue-800 transition duration-300">
              <FaFacebook className="text-3xl" />
            </Link>
            <Link to="#" className="text-green-600 hover:text-green-800 transition duration-300">
              <FaWhatsapp className="text-3xl" />
            </Link>
            <Link to="#" className="text-blue-700 hover:text-blue-900 transition duration-300">
              <FaLinkedin className="text-3xl" />
            </Link>
            <Link to="#" className="text-pink-600 hover:text-pink-800 transition duration-300">
              <FaInstagram className="text-3xl" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Part with Half Visible Text */}
      <div className="relative w-full bg-gray-900 overflow-hidden h-[150px]">
        <h1 className="text-[200px] text-gray-500 leading-none text-center absolute w-full bottom-[-80px]">
          AutoMatch AI
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
