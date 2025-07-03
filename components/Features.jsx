// components/Features.jsx
"use client";
import { Code2, Wand2, Share2 } from "lucide-react";
import { motion } from "framer-motion"; // <-- ADDED THIS MISSING IMPORT

const Features = () => {
  const features = [
    {
      icon: <Code2 className="h-8 w-8 text-indigo-500" />,
      title: "Showcase Your Stack",
      description:
        "Visually represent your favorite programming languages, frameworks, and developer tools with our interactive components.",
    },
    {
      icon: <Wand2 className="h-8 w-8 text-purple-500" />,
      title: "Display Your Kit",
      description:
        "From your streaming setup to your gaming rig, show off the hardware and software that powers your creativity.",
    },
    {
      icon: <Share2 className="h-8 w-8 text-emerald-500" />,
      title: "Unify Your Presence",
      description:
        "Consolidate all your social platforms, projects, and content into one beautiful, shareable link.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 px-4 bg-white dark:bg-[#111115]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Everything You Are, in One Simple Link
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            LinkGraph provides the tools you need to build a comprehensive
            digital portfolio that grows with you.
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-gray-100 dark:bg-gray-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
