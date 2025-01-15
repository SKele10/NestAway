import { createContext, useEffect, useState } from "react";
import { changeTheme } from "../utils/helper";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [searchVisible, setSearchVisible] = useState(true);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    theme === "light" ? changeTheme("dark") : changeTheme("light");
  };

  const toggleSearchVisible = (value) => {
    setSearchVisible(value);
  };
  useEffect(() => {
    changeTheme(theme);
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        searchVisible,
        toggleSearchVisible,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeContext;
