import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <footer 
      className={`${
        theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
      } py-12 transition-colors duration-200`}
      role="contentinfo"
      aria-label={t('footer.label')}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:underline">{t('footer.about')}</a></li>
              <li><a href="/careers" className="hover:underline">{t('footer.careers')}</a></li>
              <li><a href="/blog" className="hover:underline">{t('footer.blog')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li><a href="/docs" className="hover:underline">{t('footer.documentation')}</a></li>
              <li><a href="/support" className="hover:underline">{t('footer.support')}</a></li>
              <li><a href="/privacy" className="hover:underline">{t('footer.privacy')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.social')}</h3>
            <ul className="space-y-2">
              <li><a href="https://twitter.com" className="hover:underline">Twitter</a></li>
              <li><a href="https://linkedin.com" className="hover:underline">LinkedIn</a></li>
              <li><a href="https://github.com" className="hover:underline">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.contact')}</h3>
            <address className="not-italic">
              <p>contact@example.com</p>
              <p>123 Main Street</p>
              <p>City, Country</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Your Company. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;