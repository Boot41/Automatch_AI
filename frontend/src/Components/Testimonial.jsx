import React from 'react'
import {
    ThumbsUp
  } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-16 bg-gray-900 shadow-sm ">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-400 mb-4">
            What Our Users Say
          </h2>
          <p className="text-[16px] md:text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what people are saying about
            AutoMatch AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-2 md:px-1">
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <ThumbsUp key={i} className="h-5 w-5 mr-1" />
              ))}
            </div>
            <p className="text-gray-400 mb-6">
              "I was overwhelmed with all the smartphone options out there.
              AutoMatch AI helped me find exactly what I needed in minutes!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold text-indigo-400">Ketan Jain</h4>
                <p className="text-gray-300 text-sm">Smartphone Buyer</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <ThumbsUp key={i} className="h-5 w-5 mr-1" />
              ))}
            </div>
            <p className="text-gray-400 mb-6">
              "The dealer matching feature saved me hours of driving around.
              Found my dream car at a dealership just 10 minutes away! with automatch ai."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold text-indigo-400">Karan</h4>
                <p className="text-gray-300 text-sm">Car Buyer</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <ThumbsUp key={i} className="h-5 w-5 mr-1" />
              ))}
            </div>
            <p className="text-gray-400 mb-6">
              "The AI understood exactly what I was looking for in a laptop. The
              recommendations were spot-on and I found the perfect one."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold text-indigo-400">Nitin</h4>
                <p className="text-gray-300 text-sm">Electronics Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Testimonial