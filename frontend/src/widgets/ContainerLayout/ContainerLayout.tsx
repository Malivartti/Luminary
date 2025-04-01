import classNames from 'classnames';
import { FC, ReactNode } from 'react';

import cls from './ContainerLayout.module.scss';

type ContainerLayoutProps = {
  className?: string;
  children?: ReactNode
}

const ContainerLayout: FC<ContainerLayoutProps> = ({
  className,
  children,
}) => {
  return (
    <div className={classNames(cls.ContainerLayout, className)}>
      {children}
    </div>
  );
};

export default ContainerLayout;
