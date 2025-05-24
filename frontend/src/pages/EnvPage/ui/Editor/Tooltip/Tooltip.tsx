import envPageStore from '@pages/EnvPage/store';
import Button, { ButtonTheme } from '@shared/ui/Button';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, FC, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import PromptInput from '../../PromptInput';
import cls from './Tooltip.module.scss';

interface Props {
    className?: string;
    isShow: boolean;
    setIsShow: (isShow: boolean) => void;
    x: number;
    y: number;
    handlePaste: () => void;
}

const Tooltip: FC<Props> = observer(({ className, isShow, x, y, handlePaste }) => {
  const [formInput, setFormInput] = useState('');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: y, left: x });
  const [isPinned, setIsPinned] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastPropsPosition = useRef({ x, y });

  const constrainPosition = (newLeft: number, newTop: number) => {
    if (!tooltipRef.current) return { left: newLeft, top: newTop };

    const tooltipWidth = tooltipRef.current.offsetWidth;
    const tooltipHeight = tooltipRef.current.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 15;
    const navbarHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 63;

    newLeft = Math.max(margin, Math.min(newLeft, windowWidth - tooltipWidth - margin));
    newTop = Math.max(margin + navbarHeight, Math.min(newTop, windowHeight - tooltipHeight - margin));

    return { left: newLeft, top: newTop };
  };

  useEffect(() => {
    lastPropsPosition.current = { x, y };
  }, [x, y]);

  useEffect(() => {
    if (!isShow || !tooltipRef.current || isPinned) return;

    const handlePosition = () => {
      if (!tooltipRef.current) return;

      const constrained = constrainPosition(x, y);
      setPosition(constrained);
    };

    handlePosition();
  }, [isShow, x, y]);

  useEffect(() => {
    if (!isShow || !tooltipRef.current) return;

    const handleResize = () => {
      if (!tooltipRef.current) return;

      const constrained = constrainPosition(position.left, position.top);
      setPosition(constrained);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isShow, position.left, position.top]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!tooltipRef.current) return;

    // Проверяем, что клик не произошел на кнопке pin
    if ((e.target as HTMLElement).closest(`.${cls.Tooltip__pin}`)) return;

    setIsDragging(true);
    const rect = tooltipRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!tooltipRef.current) return;

    if ((e.target as HTMLElement).closest(`.${cls.Tooltip__pin}`)) return;

    setIsDragging(true);
    const rect = tooltipRef.current.getBoundingClientRect();
    const touch = e.changedTouches[0];
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDragging || !tooltipRef.current) return;

    const newLeft = e.clientX - dragOffset.current.x;
    const newTop = e.clientY - dragOffset.current.y;
    const constrained = constrainPosition(newLeft, newTop);
    setPosition(constrained);
  };

  const handleTouchMove = (e: globalThis.TouchEvent) => {
    if (!isDragging || !tooltipRef.current) return;

    const touch = e.changedTouches[0];
    const newLeft = touch.clientX - dragOffset.current.x;
    const newTop = touch.clientY - dragOffset.current.y;
    const constrained = constrainPosition(newLeft, newTop);
    setPosition(constrained);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as EventListener);
      document.addEventListener('mouseup', handleMouseUp as EventListener);
      document.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
      document.addEventListener('touchend', handleTouchEnd as EventListener);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as EventListener);
      document.removeEventListener('mouseup', handleMouseUp as EventListener);
      document.removeEventListener('touchmove', handleTouchMove as EventListener);
      document.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isShow || !tooltipRef.current || !envPageStore.tooltipResponse) return;

    const timeoutId = setTimeout(() => {
      if (!tooltipRef.current) return;
    
      const constrained = constrainPosition(position.left, position.top);
      setPosition(constrained);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [envPageStore.tooltipResponse, isShow, position.left, position.top]);

  const handlePinToggle = () => {
    setIsPinned((prev) => !prev);
  };

  const handleGen = (e?: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (envPageStore.selectedText) {
      envPageStore.sendTooltipPromt(`${formInput} для текста: ${envPageStore.selectedText}`);
    } else {
      envPageStore.sendTooltipPromt(formInput);
    }

    setFormInput('');
  };

  const handleStilistic = (e: ChangeEvent<HTMLSelectElement>) => {
    envPageStore.sendTooltipPromt(`Перепиши данный текст в стилистике ${e.target.value}: ${envPageStore.selectedText}`);
  };

  const handleRewrite = (e: ChangeEvent<HTMLSelectElement>) => {
    envPageStore.sendTooltipPromt(`Перепиши данный текст более ${e.target.value}: ${envPageStore.selectedText}`);
  };

  const handleRegen = () => {
    envPageStore.sendTooltipPromt('Перегенерируй тот же запрос.');
  };

  return (
    <div
      className={cn(cls.Tooltip, {}, [className])}
      style={{ top: position.top, left: position.left, display: isShow ? 'block' : 'none' }}
      ref={tooltipRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className={cls.Tooltip__header}>
        <span>AI</span>
        <button
          className={cn(cls.Tooltip__pin, { [cls.Tooltip__pin_active]: isPinned })}
          onClick={handlePinToggle}
          title={isPinned ? 'Unpin' : 'Pin'}
        >
          {isPinned ? '📍' : '📌'}
        </button>
      </div>
      <div style={{ display: envPageStore.selectedTextRange?.length ? 'block' : 'none' }}>
        <select onChange={handleStilistic} defaultValue=''>
          <option value='' disabled>Стилистика</option>
          <option>Формальная</option>
          <option>Разговорная</option>
          <option>Научная</option>
          <option>Деловая</option>
          <option>Художественная</option>
          <option>Публицистическая</option>
          <option>Дружеская</option>
          <option>Академическая</option>
          <option>Техническая</option>
          <option>Креативная</option>
        </select>
        <select onChange={handleRewrite} defaultValue=''>
          <option value='' disabled>Переписать</option>
          <option>Кратко</option>
          <option>Подробно</option>
          <option>Просто</option>
          <option>Структурированно</option>
          <option>С примерами</option>
          <option>Без воды</option>
          <option>Пошагово</option>
          <option>С акцентами</option>
          <option>Логично</option>
        </select>
      </div>
      <form className={cls.Tooltip__form} onSubmit={handleGen}>
        <PromptInput onSubmit={handleGen} value={formInput} onChange={(val) => setFormInput(val)}/>
      </form>
      {envPageStore.tooltipResponse && (
        <div>
          <div className={cls.Tooltip__response}>{envPageStore.tooltipResponse}</div>
          <div className={cls.Tooltip__buttons}>
            <Button onClick={handlePaste}>Вставить</Button>
            <Button theme={ButtonTheme.CLEAR} onClick={handleRegen}>Перегенерировать</Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Tooltip;
