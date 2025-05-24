import { useContext } from 'react';

import { LOCAL_STORAGE_KEY_THEME, Theme, ThemeContext } from './ThemeContext';

export const useTheme = (): {
  theme: Theme | undefined,
  setTheme: (theme: Theme) => void
} => {
  const { theme, setTheme } = useContext(ThemeContext);

  const setNewTheme = (newTheme: Theme) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, newTheme);
    if (setTheme) {
      setTheme(newTheme);
    }
  };

  return { theme, setTheme: setNewTheme };
};

export default useTheme;
