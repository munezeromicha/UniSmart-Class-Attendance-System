import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
    UserPlusIcon, 
    QrCodeIcon, 
    ChartBarIcon 
  } from '@heroicons/react/24/outline';
const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: 'howItWorks.step1.title',
      description: 'howItWorks.step1.description',
      icon: (
        <UserPlusIcon className="w-full h-full text-primary-light dark:text-primary-dark" />
      )
    },
    {
      number: 2,
      title: 'howItWorks.step2.title',
      description: 'howItWorks.step2.description',
      icon: (
        <QrCodeIcon className="w-full h-full text-primary-light dark:text-primary-dark" />
      )
    },
    {
      number: 3,
      title: 'howItWorks.step3.title',
      description: 'howItWorks.step3.description',
      icon: (
        <ChartBarIcon className="w-full h-full text-primary-light dark:text-primary-dark" />
      )
    }
  ];

  return (
    // 3. Added background color and min-height to make section visible
    <section className="py-20 px-4 min-h-screen bg-white dark:bg-gray-900" aria-labelledby="how-it-works-title">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          id="how-it-works-title"
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }} // 4. Added viewport option
        >
          {t('howItWorks.title')}
        </motion.h2>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} // 4. Added viewport option
              transition={{ duration: 0.8 }}
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-xl font-bold"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {t(step.title)}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t(step.description)}
                </p>
              </div>
              
              <motion.div 
                className="flex-1 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square relative w-full max-w-md mx-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100 dark:to-gray-700 rounded-xl opacity-50" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;