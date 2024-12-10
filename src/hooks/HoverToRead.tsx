import React from 'react';
import { useTextToSpeech } from './useTextToSpeech';

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

  const handleMouseEnter = () => {
    const textToRead = text || (typeof children === 'string' ? children : '');
    if (textToRead) {
      speak(textToRead);
    }
  };

  const handleMouseLeave = () => {
    cancel();
  };

  return (
    <span
      className={`hover-to-read ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="text"
      aria-label={text || (typeof children === 'string' ? children : '')}
    >
      {children}
    </span>
  );
};