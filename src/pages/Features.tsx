import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '📱',
      title: 'features.digital.title',
      description: 'features.digital.description',
    },
    {
      icon: '📊',
      title: 'features.analytics.title',
      description: 'features.analytics.description',
    },
    {
      icon: '🔔',
      title: 'features.notifications.title',
      description: 'features.notifications.description',
    },
    {
      icon: '📝',
      title: 'features.reports.title',
      description: 'features.reports.description',
    }
  ];

  return (
    <section className="py-20 px-4 bg-surface text-text-primary" aria-labelledby="features-title">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          id="features-title"
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {t('features.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-background border border-border rounded-xl p-6 shadow-lg
                   hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              role="article"
            >
              <div className="text-4xl mb-4" role="img" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-text-primary">
                {t(feature.title)}
              </h3>
              <p className="text-text-secondary">
                {t(feature.description)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;