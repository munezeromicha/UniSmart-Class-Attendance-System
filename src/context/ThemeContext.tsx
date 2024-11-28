import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    if (theme === "dark") {
      document.body.style.backgroundColor = "#000000";
      document.body.style.color = "#FFFFFF";
    } else {
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.style.color = "#000000";
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
