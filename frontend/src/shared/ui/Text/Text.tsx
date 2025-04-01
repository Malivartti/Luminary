import classNames from 'classnames';
import React from 'react';

import cls from './Text.module.scss';

export type TextProps = {
    className?: string;
    view?: 'title' | 'button' | 'p-32' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
    weight?: 'normal' | 'medium' | 'bold';
    children: React.ReactNode;
    color?: 'primary' | 'secondary' | 'accent';
    maxLines?: number;
};

const Text: React.FC<TextProps> = ({
  className,
  view = 'p-14',
  tag: Tag = 'div',
  weight,
  children,
  color,
  maxLines,
}) => {
  return (
    <Tag
      className={classNames(
        cls.Text,[className,
          cls[`Text_view-${view}`],
          cls[`Text_weight-${weight}`],
          cls[`Text_color-${color}`]]
      )} 
      style={{
        'overflow': 'hidden',
        'display': '-webkit-box',
        'WebkitBoxOrient': 'vertical',
        'WebkitLineClamp': maxLines,
        'lineClamp': maxLines,
      }}
    >
      {children}
    </Tag>
  );};

export default Text;
