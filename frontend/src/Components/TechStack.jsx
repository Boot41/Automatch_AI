import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiTailwindcss, SiExpress, SiTypescript, SiOpenai, SiAxios, SiFramer, SiPostgresql, SiPrisma, SiNeovim } from "react-icons/si";
import { TbApi } from "react-icons/tb"; // SerpAPI Icon Alternative

const techStack = [
  { name: "React", icon: <FaReact className="text-blue-400" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-teal-400" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
  { name: "Express.js", icon: <SiExpress className="text-gray-400" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-600" /> },
  { name: "Generative AI", icon: <SiOpenai className="text-purple-500" /> },
  { name: "Axios", icon: <SiAxios className="text-yellow-500" /> },
  { name: "Framer Motion", icon: <SiFramer className="text-pink-400" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="text-blue-500" /> },
  { name: "NeonDB", icon: <SiNeovim className="text-green-400" /> },
  { name: "Prisma", icon: <SiPrisma className="text-indigo-400" /> },
  { name: "SerpAPI", icon: <TbApi className="text-red-500" /> },
];

const TechStack = () => {
  return (
    <div className="py-20 bg-gray-900 text-white flex flex-col items-center">
      <h2 className="text-5xl font-extrabold mb-12 text-indigo-400 tracking-wide">
        Tech Stack We Use
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10">
        {techStack.map((tech, index) => (
          <motion.div
            key={index}
            className="bg-gray-800/50 border border-gray-700 backdrop-blur-xl rounded-2xl p-8 w-64 h-40 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-6xl">{tech.icon}</div>
            <p className="mt-4 text-xl font-semibold text-gray-300">{tech.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
