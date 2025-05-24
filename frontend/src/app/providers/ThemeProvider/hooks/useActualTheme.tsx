import { useEffect, useState } from 'react';

import { getSystemTheme,Theme } from '../lib/ThemeContext';
import { useTheme } from '../lib/useTheme';

export const useActualTheme = () => {
  const { theme } = useTheme();
  const [actualTheme, setActualTheme] = useState<Theme>(() => {
    if (theme === Theme.SYSTEM) {
      return getSystemTheme();
    }
    return theme || Theme.LIGHT;
  });

  useEffect(() => {
    if (theme === Theme.SYSTEM) {
      const updateSystemTheme = () => {
        setActualTheme(getSystemTheme());
      };

      updateSystemTheme();

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateSystemTheme);

      return () => {
        mediaQuery.removeEventListener('change', updateSystemTheme);
      };
    } else {
      setActualTheme(theme || Theme.LIGHT);
    }
  }, [theme]);

  return actualTheme;
};
