import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserCircleIcon } from '@heroicons/react/24/solid';
const Testimonials: React.FC = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: 'testimonials.1.name',
      role: 'testimonials.1.role',
      content: 'testimonials.1.content',
      bgColor: 'bg-blue-500'
    },
    {
        name: 'testimonials.2.name',
        role: 'testimonials.2.role',
        content: 'testimonials.2.content',
         bgColor: 'bg-blue-500'
      },
      {
        name: 'testimonials.3.name',
        role: 'testimonials.3.role',
        content: 'testimonials.3.content',
         bgColor: 'bg-blue-500'
      },
    // Add more testimonials...
  ];

  return (
    <section className="py-20 px-4 bg-surface" aria-labelledby="testimonials-title">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          id="testimonials-title"
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {t('testimonials.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-background border border-border rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="flex items-center gap-4 mb-6">
              <motion.div 
                  className={`relative w-16 h-16 rounded-full ${testimonial.bgColor} flex items-center justify-center shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <UserCircleIcon className="w-14 h-14 text-white absolute" />
                  {/* Optional: Add a decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-white dark:border-gray-800 opacity-20" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {t(testimonial.name)}
                  </h3>
                  <p className="text-text-secondary">
                    {t(testimonial.role)}
                  </p>
                </div>
              </div>
              <blockquote className="text-text-secondary italic">
                "{t(testimonial.content)}"
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;