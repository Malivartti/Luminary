import classNames from 'classnames';
import React, { useCallback, useEffect } from 'react';

import Text from '../Text';
import cls from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  afterSlot?: React.ReactNode;
  className?: string;
  error?: string;
  maxLength?: number;
};

const Input: React.FC<InputProps> = ({
  afterSlot,
  className,
  value,
  onChange,
  error,
  maxLength,
  ...props
}) => {
  const [innerValue, setInnerValue ] = React.useState<string>(value);

  const onChangeValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!maxLength || (e.target.value.length <= maxLength)) {
      setInnerValue(e.target.value);
      onChange(e.target.value);
    }
  }, [maxLength, onChange]);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className={classNames(cls.Input__wrapper, className)}>
      <input
        className={classNames(cls.Input, { [cls.Input_icon]: afterSlot, [cls.Input_error]: error })}
        type="text"
        value={innerValue || value}
        onChange={onChangeValue}
        {...props}
      />
      <span className={cls.Input__icon}>{afterSlot}</span>
      {error && <Text tag='div' view='p-14' className={cls.Input__error}>{error}</Text>}
    </div>
  );};

export default Input;
