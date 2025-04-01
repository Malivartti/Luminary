import { useContext } from 'react';

import { LOCAL_STORAGE_KEY_THEME, Theme, ThemeContext } from './ThemeContext';

export const useTheme = (): {
  theme: Theme | undefined,
  toggleTheme: () => void
} => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, newTheme);
    if (setTheme) {
      setTheme(newTheme);
    }
  };

  return { theme, toggleTheme };
};

export default useTheme;
