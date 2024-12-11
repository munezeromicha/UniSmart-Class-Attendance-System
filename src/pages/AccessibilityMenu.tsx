import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../config/config";
import ThemeToggle from './ThemeToggle';

interface AccessibilityMenuProps {
  onThemeToggle: () => void;
  ariaLabel: string;
}

export default function AccessibilityMenu({
  ariaLabel,
}: AccessibilityMenuProps) {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [speechSynthesis] = useState<SpeechSynthesis | null>(
    () => window.speechSynthesis || null
  );
  const [isReading, setIsReading] = useState(false);

  const readPageContent = () => {
    if (speechSynthesis) {
      try {
        setIsReading(true);
        speechSynthesis.cancel();

        const mainContent = document.querySelector("main") || document.body;
        const content = [
          "Welcome to our Academic Management System.",
          ...(mainContent
            ? Array.from(mainContent.querySelectorAll("h1, h2, h3, p, li"))
                .filter((element) => {
                  const style = window.getComputedStyle(element);
                  return style.display !== "none" && style.visibility !== "hidden";
                })
                .map((element) => element.textContent?.trim())
                .filter((text) => text && text.length > 0)
            : []),
          "This system helps manage academic activities and communication between students and staff.",
        ];

        const textToRead = content.join(". ").replace(/\.+/g, ".");

        if (textToRead.trim().length === 0) {
          throw new Error("No readable content found");
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = "en-US";

        utterance.onstart = () => {
          console.log("Started reading");
          setIsReading(true);
        };

        utterance.onend = () => {
          console.log("Finished reading");
          setIsReading(false);
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setIsReading(false);
          alert("There was an error reading the page. Please try again.");
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Error in readPageContent:", error);
        setIsReading(false);
        alert("There was an error reading the page. Please try again.");
      }
    } else {
      alert("Speech synthesis is not supported in your browser");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      role="complementary"
      aria-label={ariaLabel}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 shadow-lg backdrop-blur-sm h-16"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={t("accessibility.toggleMenu")}
          aria-expanded={isMobileMenuOpen ? true : false}
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
            isMobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 ease-in-out`}
        >
          {/* Font Size Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span role="img" aria-hidden="true" className="text-xl">
              📝
            </span>
            <div className="flex gap-1">
              {["14px", "16px", "18px"].map((size, index) => (
                <button
                  key={size}
                  onClick={() => (document.documentElement.style.fontSize = size)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  aria-label={t(`accessibility.fontSize${index + 1}`)}
                >
                  <span className="text-sm font-medium">
                    A{index === 0 ? "-" : index === 1 ? "" : "+"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span role="img" aria-hidden="true" className="text-xl">
              🌍
            </span>
            <select
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language}
              aria-label={t("accessibility.language")}
              className="text-sm font-medium bg-transparent border-none focus:ring-0
                       cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2 w-full md:w-auto"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="rw">Kinyarwanda</option>
            </select>
          </div>

          {/* Read Page Button */}
          <button
            onClick={readPageContent}
            className={`flex items-center gap-2 p-2 rounded-lg ${
              isReading
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white w-full md:w-auto`}
            aria-label={t("accessibility.readPage")}
            disabled={isReading}
          >
            <span role="img" aria-hidden="true" className="text-xl">
              {isReading ? "🔊" : "📢"}
            </span>
            <span className="text-sm font-medium">
              {isReading ? t("accessibility.reading") : t("accessibility.read")}
            </span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}