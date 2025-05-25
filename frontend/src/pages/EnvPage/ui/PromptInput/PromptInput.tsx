// PromptInput.tsx
import aiStore from '@entities/ai';
import SendIcon from '@shared/assets/icons/send.svg';
import Loader from '@shared/ui/Loader';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

import AIModelSelector from '../AIModelSelector';
import cls from './PromptInput.module.scss';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const PromptInput = observer(({ value, onChange, onSubmit }: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className={cls.PromptInput}>
      <textarea
        ref={textareaRef}
        className={cls.PromptInput__textarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Введите сообщение..."
        rows={1}
      />
      <div className={cls.PromptInput__footer}>
        <AIModelSelector />
        <button 
          className={cls.PromptInput__sendBtn} 
          onClick={onSubmit} 
          type="button"
        >
          {aiStore.networkSendPrompt.isLoading 
            ? <Loader size="s" /> 
            : <SendIcon className={cls.PromptInput__sendIcon} />
          }
        </button>
      </div>
    </div>
  );
});

export default PromptInput;