import Loader from '@shared/ui/Loader';
import Text from '@shared/ui/Text';
import classNames from 'classnames';
import React from 'react';

import cls from './Button.module.scss';
import { ButtonTheme } from './ButtonTheme';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: React.ReactNode;
  theme?: ButtonTheme;
  design?: 'danger'
};

const Button: React.FC<ButtonProps> = ({
  loading,
  className,
  children,
  theme,
  design,
  ...props
}) => (
  <button 
    className={classNames(cls.Button, className, { [cls.Button_loading]: loading }, cls[`Button_${theme}`], cls[`Button_${design}`])}
    disabled={loading} 
    {...props}
  >
    {loading && <Loader size='s' className={cls.Button__loader}/>}
    <Text tag='span' view='button'>
      {children}
    </Text>
  </button>
);

export default Button;
