import React, { createContext, useContext, useState } from 'react';

interface HoverToReadContextType {
  isEnabled: boolean;
  toggleHoverToRead: () => void;
}

const HoverToReadContext = createContext<HoverToReadContextType | undefined>(undefined);

export const HoverToReadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleHoverToRead = () => {
    setIsEnabled(prev => !prev);
  };

  return (
    <HoverToReadContext.Provider value={{ isEnabled, toggleHoverToRead }}>
      {children}
    </HoverToReadContext.Provider>
  );
};

export const useHoverToRead = () => {
  const context = useContext(HoverToReadContext);
  if (context === undefined) {
    throw new Error('useHoverToRead must be used within a HoverToReadProvider');
  }
  return context;
};