import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(
    localStorage.getItem("inkspire-theme") || getSystemTheme()
  );

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("inkspire-theme", theme);
  }, [theme]);

  // Listen for system changes (if user hasn't manually overridden)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (!localStorage.getItem("inkspire-theme")) {
        setTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const resetToSystem = () => {
    localStorage.removeItem("inkspire-theme");
    setTheme(getSystemTheme());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, resetToSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);