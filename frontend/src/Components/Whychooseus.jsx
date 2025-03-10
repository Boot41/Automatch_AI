import React from 'react'
 import { motion } from 'framer-motion'
 
 const Whychooseus = () => {
   return (
    <>
   <div className="mx-auto text-center space-y-16 z-10 bg-gray-900 pb-10">
     <div className='max-w-6xl mx-auto'>
     <motion.h2 
         initial={{ opacity: 0, y: -50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1 }}
         className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-400 pb-10">
         Why Choose AutoMatch AI?
       </motion.h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
         {[
           { title: 'AI-Powered Recommendations', text: 'Tailored product suggestions based on user preferences.' },
           { title: 'Seamless Connectivity', text: 'Directly connect with nearby dealers in real-time.' },
           { title: '24/7 Support', text: 'Round-the-clock support to assist all your queries.' }
         ].map((item, index) => (
           <motion.div 
             key={index}
             whileHover={{ scale: 1.05 }}
             transition={{ duration: 0.3 }}
             className="p-10 rounded-xl bg-gray-800 shadow-xl transform hover:shadow-2xl cursor-pointer"
           >
             <h3 className="text-3xl font-semibold text-white mb-4">{item.title}</h3>
             <p className="text-gray-300 leading-relaxed">{item.text}</p>
           </motion.div>
         ))}
     </div>
       
       </div>
     </div>
    </>
   )
 }
 
 export default Whychooseus