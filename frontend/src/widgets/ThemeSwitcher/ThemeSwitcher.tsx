import { Theme, useTheme } from '@app/providers/ThemeProvider';
import MoonIcon from '@shared/assets/icons/moon.svg';
import SunIcon from '@shared/assets/icons/sun.svg';
import classNames from 'classnames';
import { FC } from 'react';

import cls from './ThemeSwitcher.module.scss';

type ThemeSwitcherProps = {
  className?: string
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={classNames(cls.ThemeSwitcher, className)}
      onClick={toggleTheme}
    >
      {
        theme === Theme.LIGHT
          ? <SunIcon className={cls.ThemeSwitcher__icon}/>
          : <MoonIcon className={cls.ThemeSwitcher__icon}/>
      }
    </button>
  );
};

export default ThemeSwitcher;
