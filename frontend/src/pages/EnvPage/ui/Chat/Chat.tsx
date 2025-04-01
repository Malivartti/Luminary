import aiStore from '@entities/ai';
import envPageStore from '@pages/EnvPage/store';
import SendIcon from '@shared/assets/icons/send.svg';
import Input from '@shared/ui/Input';
import Loader from '@shared/ui/Loader';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useEffect, useRef } from 'react';

import cls from './Chat.module.scss';
import Message from './Message';

const Chat = observer(() => {
  const chatWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight; // Scroll to bottom on message update
    }
  }, [aiStore.context]);


  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    envPageStore.sendPromptInChat();
  }, []);

  return (
    <div className={cls.Chat}>
      <div className={cls.Chat__wrapper} ref={chatWrapperRef}>
        <div className={cls.Chat__messages}>
          {/* {Array.from(Array(3).keys()).map((key) => <Message key={key} text="hahd hfhf hfh " sendedAt={new Date()}/>)} */}
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
        <Input
          className={cls.Chat__input}
          value={envPageStore.prompt}
          onChange={envPageStore.setPrompt}
          afterSlot={<button className={cls['Chat__send-btn']}>
            {aiStore.networkSendPrompt.isLoading 
              ? <Loader size='s'/> 
              :<SendIcon className={cls['Chat__send-icon']}/>
            }
          </button>}
        />
      </form>
    </div>
  );
});

export default Chat;
