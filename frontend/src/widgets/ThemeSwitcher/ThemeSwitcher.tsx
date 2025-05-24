import { Theme, useTheme } from '@app/providers/ThemeProvider';
import ArrowIcon from '@shared/assets/icons/arrow-down.svg';
import AutoIcon from '@shared/assets/icons/circle-half.svg';
import MoonIcon from '@shared/assets/icons/moon.svg';
import SunIcon from '@shared/assets/icons/sun.svg';
import Popup from '@widgets/Popup';
import classNames from 'classnames';
import React, { FC } from 'react';

import cls from './ThemeSwitcher.module.scss';

type ThemeSwitcherProps = {
  className?: string
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: Theme.LIGHT, label: 'Светлая', icon: SunIcon },
    { value: Theme.DARK, label: 'Темная', icon: MoonIcon },
    { value: Theme.SYSTEM, label: 'Авто', icon: AutoIcon }
  ];

  const currentTheme = themeOptions.find(option => option.value === theme);
  const CurrentIcon = currentTheme?.icon || AutoIcon;

  const handleSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
  };

  const triggerButton = (
    <div className={cls.ThemeSwitcher__trigger}>
      <CurrentIcon className={cls.ThemeSwitcher__icon} />
      <ArrowIcon className={cls.ThemeSwitcher__arrow} />
    </div>
  );

  return (
    <Popup
      button={triggerButton}
      width={140}
    >
      <div className={cls.ThemeSwitcher__dropdown}>
        <ul className={cls.ThemeSwitcher__list}>
          {themeOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <li key={option.value} className={cls.ThemeSwitcher__item}>
                <button
                  className={classNames(
                    cls.ThemeSwitcher__option,
                    { [cls.ThemeSwitcher__option_active]: theme === option.value }
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <OptionIcon className={cls.ThemeSwitcher__optionIcon} />
                  <span className={cls.ThemeSwitcher__label}>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Popup>
  );
};

export default ThemeSwitcher;
