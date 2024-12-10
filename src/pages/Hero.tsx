import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    }
  const { t } = useTranslation();

  const AcademicIcon = () => (
    <svg 
      className="inline-block w-20 h-20 mr-4 text-gray-900 dark:text-white"
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20v-6" />
    </svg>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            <AcademicIcon />
          <motion.h1 
            className="text-xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
              
            {t('hero.title')}
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button 
              onClick={handleGetStarted} 
              className="group relative inline-flex items-center justify-center
                px-8 py-3 
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                dark:hover:from-indigo-700 dark:hover:via-purple-700 dark:hover:to-pink-700
                text-white font-semibold
                rounded-full
                transform transition-all duration-300
                shadow-lg hover:shadow-xl
                hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                dark:focus:ring-offset-gray-900"
            >
              <span className="relative flex items-center space-x-2">
                {t('hero.getStarted')}
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 rounded-full bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;