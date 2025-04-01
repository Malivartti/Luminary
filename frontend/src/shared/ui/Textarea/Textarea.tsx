import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';

import Text from '../Text';
import cls from './Textarea.module.scss';

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  afterSlot?: React.ReactNode;
  className?: string;
  error?: string;
  maxLength?: number;
};

const Textarea: React.FC<TextareaProps> = ({
  afterSlot,
  className,
  value,
  onChange,
  error,
  maxLength,
  ...props
}) => {
  const [innerValue, setInnerValue ] = React.useState<string>(value);

  const onChangeValue = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!maxLength || (e.target.value.length <= maxLength)) {
      setInnerValue(e.target.value);
      onChange(e.target.value);
    }
  }, [maxLength, onChange]);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className={classNames(cls.Textarea__wrapper, className)}>
      <textarea
        className={classNames(cls.Textarea, { [cls.Textarea_icon]: afterSlot, [cls.Textarea_error]: error })}
        value={innerValue || value}
        onChange={onChangeValue}
        {...props}
      />
      <span className={cls.Textarea__icon}>{afterSlot}</span>
      {error && <Text tag='div' view='p-14' className={cls.Textarea__error}>{error}</Text>}
    </div>
  );};

export default Textarea;
