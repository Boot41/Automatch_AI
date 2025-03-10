import React from "react";
import { motion } from "framer-motion";

const PricingCard = () => {
  return (
    <section className="bg-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-bold text-indigo-400 mb-4">
          Automatch AI Pricing Plans
        </h2>
        <p className="text-gray-400 text-lg mb-12">
          Choose the best plan to get product recommendations and find nearby dealers tailored to your needs.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-w-6xl mx-auto">
        {[ 
          {
            title: "Basic",
            price: "Free",
            features: ["Product Recommendations", "Top 3 Nearby Dealers", "Basic Customer Support"],
            highlight: false,
          },
          {
            title: "Pro",
            price: "$49/mo",
            features: ["Advanced Product Recommendations", "Top 10 Nearby Dealers", "Priority Customer Support", "Real-time Dealer Availability"],
            highlight: true,
          },
          {
            title: "Enterprise",
            price: "Custom",
            features: ["Bulk Product Recommendations", "Unlimited Nearby Dealers", "Dedicated Account Manager", "API Integration", "24/7 Premium Support"],
            highlight: false,
          }
        ].map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-10 rounded-3xl border ${plan.highlight ? "border-indigo-500 shadow-2xl bg-gray-900" : "border-gray-700 bg-gray-800"} text-center transition-all relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent rounded-3xl"></div>
            <h3 className="text-3xl font-semibold text-white relative">{plan.title}</h3>
            <p className="text-5xl font-extrabold text-indigo-400 my-4 relative">{plan.price}</p>
            <ul className="space-y-3 text-gray-300 text-lg mb-6 relative">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  ✅ {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PricingCard;