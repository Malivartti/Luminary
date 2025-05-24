import ArrowDownIcon from '@shared/assets/icons/arrow-down.svg';
import Input from '@shared/ui/Input';
import Text from '@shared/ui/Text';
import { default as cn } from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import cls from './Select.module.scss';

export interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Выберите...', className, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as HTMLElement)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleOptionClick = (e: React.MouseEvent, option: Option) => {
    e.stopPropagation();
    onChange(option);
    setIsOpen(false);
  };

  const displayValue = value ? value.label : '';

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current.querySelector(`.${cls.Select__options}`) as HTMLDivElement;
      if (dropdown) {
        const rect = dropdown.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.top - 15; // 15px от нижней границы
        dropdown.style.maxHeight = `${Math.max(spaceBelow, 100)}px`; // минимум 100px
      }
    }
  }, [isOpen]);

  return (
    <div className={cn(cls.Select, className)} ref={dropdownRef}>
      <Input
        className={cls.SelectInput}
        type="text"
        value={displayValue}
        placeholder={placeholder}
        readOnly
        onClick={() => !disabled && setIsOpen(!isOpen)}
        afterSlot={<ArrowDownIcon className={cn(cls.ArrowIcon, { [cls.ArrowIconOpen]: isOpen })} color="secondary" />}
        disabled={disabled}
        onChange={(value: string) => setFilter(value)}
      />

      {isOpen && (
        <div className={cls.Select__options}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                className={cn({ [cls.Select__option_selected]: value?.value === option.value }, cls.Select__option)}
                onClick={(e) => handleOptionClick(e, option)}
                type="button"
              >
                <Text view="p-16"color={value?.value === option.value ? 'accent' : 'primary'}>
                  {option.label}
                </Text>
              </button>
            ))
          ) : (
            <div className={cls.NoOptions}>
              <Text view="p-16" color="secondary">Нет результатов</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { Select };
