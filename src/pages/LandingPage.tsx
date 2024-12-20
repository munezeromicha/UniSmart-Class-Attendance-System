import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import AccessibilityMenu from './AccessibilityMenu';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import Contact from './Contact';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  return (
    <div 
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-background-dark text-white' : 'bg-background-light text-gray-800'
      } transition-colors duration-200`}
      role="main"
      aria-label={t('landingPage.mainContent')}
    >
      <AccessibilityMenu
        onScreenReaderToggle={setIsScreenReaderEnabled}
        onThemeToggle={toggleTheme}
        ariaLabel={t('accessibility.menuLabel')}
      />
      
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Contact />
      <Footer />

      {isScreenReaderEnabled && (
        <div className="sr-only" role="alert">
          {t('accessibility.screenReaderEnabled')}
        </div>
      )}
    </div>
  );
};

export default LandingPage;