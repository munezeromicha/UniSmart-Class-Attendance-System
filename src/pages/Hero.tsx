import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-20, 0, -20],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Animation for connecting lines
  const connectingLines = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Floating Icons System Demonstration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Academic Process Flow */}
        <motion.div
          className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
          {...floatingAnimation}
        >
          <AcademicProcessIcon />
        </motion.div>

        {/* User Interaction Flow */}
        <motion.div
          className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2"
          {...floatingAnimation}
          transition={{ delay: 0.5 }}
        >
          <UserInteractionIcon />
        </motion.div>

        {/* Digital Learning Flow */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2"
          {...floatingAnimation}
          transition={{ delay: 1 }}
        >
          <DigitalLearningIcon />
        </motion.div>

        {/* Mobile Access Flow */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"
          {...floatingAnimation}
          transition={{ delay: 1.5 }}
        >
          <MobileAccessIcon />
        </motion.div>

        {/* Connecting Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <motion.path
            d="M25% 25% L75% 25% L75% 75% L25% 75% Z"
            stroke="rgba(147, 51, 234, 0.2)"
            strokeWidth="2"
            fill="none"
            {...connectingLines}
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <AcademicIcon />
          </motion.div>

          <motion.h1
            className="text-xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {t("hero.description")}
          </motion.p>

          <motion.button
            onClick={() => navigate("/login")}
            className="group relative inline-flex items-center justify-center
                            px-8 py-3 
                            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                            text-white font-semibold rounded-full
                            transform transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="relative flex items-center space-x-2">
              {t("hero.getStarted")}
              <motion.svg
                className="w-5 h-5 ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </motion.svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
      {/* </HoverToRead> */}
    </section>
  );
};

// Add these icon components at the bottom of the file, before the export
const AcademicProcessIcon = () => (
  <svg
    className="w-12 h-12 text-purple-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 3L1 9l11 6l9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);

// Add similar components for other missing icons:
const UserInteractionIcon = () => (
  <svg
    className="w-12 h-12 text-blue-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const DigitalLearningIcon = () => (
  <svg
    className="w-12 h-12 text-green-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
  </svg>
);

const MobileAccessIcon = () => (
  <svg
    className="w-12 h-12 text-red-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
  </svg>
);

const AcademicIcon = () => (
  <svg
    className="w-16 h-16 text-indigo-600 mx-auto"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
  </svg>
);

export default Hero;
