import aiStore from '@entities/ai';
import envPageStore from '@pages/EnvPage/store';
import Loader from '@shared/ui/Loader';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, FC, FormEvent, useEffect, useRef,useState } from 'react';

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

  useEffect(() => {
    if (!isShow) return;

    const handlePosition = () => {
      if (!tooltipRef.current) return;

      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newLeft = x;
      let newTop = y;

      // Проверка на выход за левый край экрана
      if (x < 0) {
        newLeft = 0;
      }

      // Проверка на выход за правый край экрана
      if (x + tooltipWidth > windowWidth) {
        newLeft = windowWidth - tooltipWidth;
      }

      // Проверка на выход за верхний край экрана
      if (y < 0) {
        newTop = 0;
      }

      // Проверка на выход за нижний край экрана
      if (y + tooltipHeight > windowHeight) {
        newTop = windowHeight - tooltipHeight;
      }

      setPosition({ top: newTop, left: newLeft });
    };

    handlePosition();
    window.addEventListener('resize', handlePosition);

    return () => {
      window.removeEventListener('resize', handlePosition);
    };

  }, [isShow, x, y]);


  const handleGen = (e: FormEvent<HTMLFormElement>) => {
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
    >
      <div style={{ display: envPageStore.selectedTextRange?.length ? 'block' : 'none' }}>
        <select onChange={handleStilistic}>
          <option selected disabled>Стилистика</option>
          <option>Формальная</option>
          <option>Разговорная</option>
          <option>Научная</option>
        </select>
        <select onChange={handleRewrite}>
          <option selected disabled>Переписать</option>
          <option>Кратко</option>
          <option>Подробно</option>
          <option>Просто</option>
        </select>
      </div>
      <form className={cls.Tooltip__form} onSubmit={handleGen}>
        <input placeholder='Запрос' value={formInput} onChange={(e) => setFormInput(e.target.value)} />
        <button type='submit' className={cls.Tooltip__gen}>Сгенерировать {aiStore.networkSendPrompt.isLoading && <Loader size='s' />}</button>
      </form>
      {envPageStore.tooltipResponse && (
        <div>
          <div className={cls.Tooltip__response}> {envPageStore.tooltipResponse}</div>
          <div className={cls.Tooltip__buttons}>
            <button onClick={handlePaste}>Вставить</button>
            <button onClick={handleRegen}>Перегенерировать</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Tooltip;