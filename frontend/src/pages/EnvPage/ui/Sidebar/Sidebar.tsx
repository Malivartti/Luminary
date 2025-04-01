import envPageStore from '@pages/EnvPage/store';
import ChatIcon from '@shared/assets/icons/chat-square-text.svg';
import FilesIcon from '@shared/assets/icons/files.svg';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import Chat from '../Chat';
import Files from '../Files';
import cls from './Sidebar.module.scss';

const Sidebar = observer(() => {
  const handleFilesClick = useCallback(() => {
    envPageStore.setIsShowFiles(true);
  }, []);

  const handleChatClick = useCallback(() => {
    envPageStore.setIsShowChat(true);
  }, []);

  return (
    <div className={cls.Sidebar}>
      <div className={cls.Sidebar__btns}>
        <button 
          className={
            cn(cls.Sidebar__btn,
              { [cls.Sidebar__btn_active]: envPageStore.isShowFiles }
            )}
          type='button'
          onClick={handleFilesClick}
        >
          <FilesIcon />
        </button>
        <button 
          className={
            cn(cls.Sidebar__btn,
              { [cls.Sidebar__btn_active]: envPageStore.isShowChat }
            )}
          type='button'
          onClick={handleChatClick}
        >
          <ChatIcon />
        </button>
      </div>
      
      <div className={cn(
        cls.Sidebar__tabs,
        { [cls.Sidebar__tabs_hide]: !envPageStore.isActiveTab }
      )}>
        {envPageStore.isShowFiles && <Files />}
        {envPageStore.isShowChat && <Chat />}
      </div>
    </div>
  );
});

export default Sidebar;