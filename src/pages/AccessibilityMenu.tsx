import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../config/config';

interface AccessibilityMenuProps {
  onScreenReaderToggle: Dispatch<SetStateAction<boolean>>;
  onThemeToggle: () => void;
  ariaLabel: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

export default function AccessibilityMenu({ onScreenReaderToggle, onThemeToggle, ariaLabel }: AccessibilityMenuProps) {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis);

    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionInstance.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    if (command.includes('login')) {
      speak('Navigating to login page');
      window.location.href = '/login';
    } else if (command.includes('register')) {
      speak('Navigating to registration page');
      window.location.href = '/register';
    } else if (command.includes('dark mode')) {
      speak('Switching to dark mode');
      onThemeToggle();
    } else if (command.includes('read page')) {
      readPageContent();
    }
  };

  const speak = (text: string) => {
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const readPageContent = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      speak(mainContent.textContent || '');
    }
  };

  const toggleVoiceControl = () => {
    if (isListening) {
      recognition?.stop();
      speak('Voice control deactivated');
    } else {
      recognition?.start();
      speak('Voice control activated. You can say commands like "login", "register", "dark mode", or "read page"');
    }
    setIsListening(!isListening);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div 
      role="complementary" 
      aria-label={ariaLabel}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 shadow-lg backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={t('accessibility.toggleMenu')}
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div
          className={`${
            isMobileMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ease-in-out`}
        >
          <button
            onClick={toggleVoiceControl}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors w-full md:w-auto
              ${isListening 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            aria-label={t('accessibility.toggleVoiceControl')}
          >
            <span role="img" aria-hidden="true" className="text-xl">🎤</span>
            <span className="text-sm font-medium">
              {isListening ? t('accessibility.active') : t('accessibility.voice')}
            </span>
          </button>

          <button
            onClick={() => onScreenReaderToggle(prev => !prev)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full md:w-auto"
            aria-label={t('accessibility.toggleScreenReader')}
          >
            <span role="img" aria-hidden="true" className="text-xl">👁️</span>
            <span className="text-sm font-medium">{t('accessibility.reader')}</span>
          </button>

          <button
            onClick={onThemeToggle}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full md:w-auto"
            aria-label={t('accessibility.toggleTheme')}
          >
            <span role="img" aria-hidden="true" className="text-xl">🌓</span>
            <span className="text-sm font-medium">{t('accessibility.theme')}</span>
          </button>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span role="img" aria-hidden="true" className="text-xl">📝</span>
            <div className="flex gap-1">
              {['14px', '16px', '18px'].map((size, index) => (
                <button
                  key={size}
                  onClick={() => document.documentElement.style.fontSize = size}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  aria-label={t(`accessibility.fontSize${index + 1}`)}
                >
                  <span className="text-sm font-medium">
                    A{index === 0 ? '-' : index === 1 ? '' : '+'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span role="img" aria-hidden="true" className="text-xl">🌍</span>
            <select
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language}
              aria-label={t('accessibility.language')}
              className="text-sm font-medium bg-transparent border-none focus:ring-0
                       cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2 w-full md:w-auto"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="rw">Kinyarwanda</option>
            </select>
          </div>

          <button
            onClick={readPageContent}
            className="flex items-center gap-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            aria-label={t('accessibility.readPage')}
          >
            <span role="img" aria-hidden="true" className="text-xl">📢</span>
            <span className="text-sm font-medium">{t('accessibility.read')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}