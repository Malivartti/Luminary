import LoaderIcon from '@shared/assets/icons/loader.svg';
import classNames from 'classnames';
import React from 'react';

import cls from './Loader.module.scss';

export type LoaderProps = {
    size?: 's' | 'm' | 'l';
    className?: string;
};

const sizeToPixles = {
  s: 24,
  m: 48,
  l: 60,
};

const Loader: React.FC<LoaderProps> = ({
  className,
  size = 'l',
  ...props
}) => (
  <LoaderIcon
    className={classNames(cls.Loader, className)}
    width={sizeToPixles[size]}
    height={sizeToPixles[size]}
    {...props}
  />
);

export default Loader;
