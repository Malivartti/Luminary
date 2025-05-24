import aiStore from '@entities/ai';
import envPageStore from '@pages/EnvPage/store';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useEffect, useRef } from 'react';

import PromptInput from '../PromptInput';
import cls from './Chat.module.scss';
import Message from './Message';

const Chat = observer(() => {
  const chatWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
    }
  }, [aiStore.context]);

  const handleSubmit = useCallback((e?: FormEvent) => {
    if (e) e.preventDefault();
    envPageStore.sendPromptInChat();
  }, []);

  return (
    <div className={cls.Chat}>
      <div className={cls.Chat__wrapper} ref={chatWrapperRef}>
        <div className={cls.Chat__messages}>
          {aiStore.context.map(item => (
            <Message 
              key={item.created_at.toString()}
              text={item.content}
              role={item.role}
              sendedAt={item.created_at}
              model={item.model}
              cost={item.cost}
            />
          ))}
        </div>
      </div>

      <form className={cls.Chat__form} onSubmit={handleSubmit}>
        <PromptInput 
          value={envPageStore.prompt}
          onChange={envPageStore.setPrompt}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
});

export default Chat;