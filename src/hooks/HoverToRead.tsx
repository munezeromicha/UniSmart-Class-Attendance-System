import React from 'react';
import { useTextToSpeech } from './useTextToSpeech';
import { useHoverToRead } from '../context/HoverToReadContext';

interface HoverToReadProps {
  children: React.ReactNode;
  className?: string;
  text?: string;
}

export const HoverToRead: React.FC<HoverToReadProps> = ({ 
  children, 
  className = '', 
  text 
}) => {
  const { speak, cancel } = useTextToSpeech();
  const { isEnabled } = useHoverToRead();

  const handleMouseEnter = () => {
    if (!isEnabled) return;
    
    const textToRead = text || (typeof children === 'string' ? children : '');
    if (textToRead) {
      speak(textToRead);
    }
  };

  const handleMouseLeave = () => {
    if (!isEnabled) return;
    cancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!isEnabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      const textToRead = text || (typeof children === 'string' ? children : '');
      if (textToRead) {
        speak(textToRead);
      }
    }
  };

  return (
    <span
      className={`hover-to-read ${isEnabled ? 'hover-enabled' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={isEnabled ? 0 : -1}
      aria-label={text || (typeof children === 'string' ? children : '')}
    >
      {children}
    </span>
  );
};