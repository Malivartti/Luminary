import CheckIcon from '@shared/assets/icons/check2.svg';
import CopyIcon from '@shared/assets/icons/clipboard.svg';
import { formatDDMMYYYYHHMM } from '@shared/lib/date';
import Text from '@shared/ui/Text';
import { FC, useCallback, useState } from 'react';

import cls from './Message.module.scss';

type Props = {
  text: string;
  role: 'user' | 'assistant'
  sendedAt: Date;
  cost?: number;
  model?: string
}

const Message: FC<Props> = ({ text, sendedAt, cost, model }) => {
  const [isCopyed, setIsCopyed] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(text);
    setIsCopyed(true);
    setTimeout(() => setIsCopyed(false), 1500);
  }, [text]);

  return (
    <div className={cls.Message} >
      <Text className={cls.Message__text} view='p-16'>{text}</Text>
      <div className={cls.Message__footer}>
        <button
          className={cls.Message__copy} 
          type='button'
          onClick={handleClick}
        >
          {
            isCopyed
              ? <CheckIcon />
              : <CopyIcon />
          }
        </button>
        <div className={cls.Message__meta}>
          <Text view="p-14" color="secondary">Доставлено: {formatDDMMYYYYHHMM(sendedAt)}</Text>
          {model && <Text view="p-14" color="secondary">Модель: {model}</Text>}
          {cost && <Text view="p-14" color="secondary">Стоимость: {cost}</Text>}
        </div>
      </div>
    </div>
  );
};

export default Message;
