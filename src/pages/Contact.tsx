import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Handle form submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitStatus('success');
    } catch (error) {
        console.log(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="py-20 px-4 bg-background"
      aria-labelledby="contact-title"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 
            id="contact-title"
            className="text-3xl font-bold text-text-primary"
          >
            {t('contact.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('contact.description')}
          </p>
        </motion.div>

        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label 
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t('contact.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-border
                   bg-surface text-text-primary
                   focus:ring-2 focus:ring-primary focus:border-primary
                   placeholder-text-secondary"
              aria-required="true"
            />
          </div>

          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t('contact.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-border
                   bg-surface text-text-primary
                   focus:ring-2 focus:ring-primary focus:border-primary
                   placeholder-text-secondary"
              aria-required="true"
            />
          </div>

          <div>
            <label 
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t('contact.message')}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       transition-colors duration-200 resize-y"
              aria-required="true"
            />
          </div>

          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
<button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-8 py-3 
                bg-gradient-to-r from-blue-600 to-blue-700
                dark:from-blue-500 dark:to-blue-600
                hover:from-blue-700 hover:to-blue-800
                dark:hover:from-blue-600 dark:hover:to-blue-700
                text-white font-semibold rounded-lg
                shadow-lg hover:shadow-xl
                transform transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-blue-600/50
                focus:outline-none
                relative overflow-hidden
                ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{t('contact.submitting')}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{t('contact.submit')}</span>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              )}
            </button>
          </motion.div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-green-600 dark:text-green-400 mt-4"
              role="alert"
            >
              {t('contact.successMessage')}
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-600 dark:text-red-400 mt-4"
              role="alert"
            >
              {t('contact.errorMessage')}
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;