import React from 'react'
import { motion } from 'framer-motion'

const PricingCard = () => {
  return (
    <section className="bg-gray-900 py-16">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-12">
          <h2 className="mb-4 text-5xl tracking-tight font-extrabold text-indigo-400">
            Automatch AI Pricing Plans
          </h2>
          <p className="mb-5 text-lg text-gray-400 font-medium">
            Choose the best plan to get product recommendations and find nearby dealers according to your requirements.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-3 sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-3xl border border-gray-200 shadow-lg text-center transition-all hover:shadow-xl"
          >
            <h3 className="mb-4 text-2xl font-semibold">Basic</h3>
            <p className="text-gray-600 mb-6">Ideal for individual users looking for product recommendations.</p>
            <div className="text-5xl font-extrabold text-primary-600 mb-6">Free</div>
            <ul className="space-y-4 text-left mb-8">
              <li>✔️ Product Recommendations</li>
              <li>✔️ Top 3 Nearby Dealers</li>
              <li>✔️ Basic Customer Support</li>
            </ul>
            <a href="#" className="text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5 text-center">
              Get Started
            </a>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-3xl border-2 border-primary-600 shadow-xl text-center transition-all hover:shadow-2xl"
          >
            <h3 className="mb-4 text-2xl font-semibold">Pro</h3>
            <p className="text-gray-600 mb-6">Perfect for users who need advanced recommendations and dealer information.</p>
            <div className="text-5xl font-extrabold text-primary-600 mb-6">$49<span className="text-lg">/month</span></div>
            <ul className="space-y-4 text-left mb-8">
              <li>✔️ Advanced Product Recommendations</li>
              <li>✔️ Top 10 Nearby Dealers</li>
              <li>✔️ Priority Customer Support</li>
              <li>✔️ Real-time Dealer Availability</li>
            </ul>
            <a href="#" className="text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5 text-center">
              Get Started
            </a>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-3xl border border-gray-200 shadow-lg text-center transition-all hover:shadow-xl"
          >
            <h3 className="mb-4 text-2xl font-semibold">Enterprise</h3>
            <p className="text-gray-600 mb-6">For businesses looking for bulk product matching and dealer network integration.</p>
            <div className="text-5xl font-extrabold text-primary-600 mb-6">Custom</div>
            <ul className="space-y-4 text-left mb-8">
              <li>✔️ Bulk Product Recommendations</li>
              <li>✔️ Unlimited Nearby Dealers</li>
              <li>✔️ Dedicated Account Manager</li>
              <li>✔️ API Integration</li>
              <li>✔️ 24/7 Premium Support</li>
            </ul>
            <a href="#" className="text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-sm px-5 py-2.5 text-center">
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PricingCard
