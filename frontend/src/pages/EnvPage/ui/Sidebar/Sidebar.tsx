import envPageStore from '@pages/EnvPage/store';
import ChatIcon from '@shared/assets/icons/chat-square-text.svg';
import FilesIcon from '@shared/assets/icons/files.svg';
import EditorIcon from '@shared/assets/icons/pencil-square.svg';
import Text from '@shared/ui/Text';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import Chat from '../Chat';
import Editor from '../Editor';
import Files from '../Files';
import cls from './Sidebar.module.scss';

const Sidebar = observer(() => {
  const handleFilesClick = useCallback(() => {
    envPageStore.setIsShowFiles(true);
  }, []);

  const handleChatClick = useCallback(() => {
    envPageStore.setIsShowChat(true);
  }, []);

  const handleEditorClick = useCallback(() => {
    envPageStore.setIsShowEditor(true);
  }, []);

  const showEditorTab = envPageStore.isMobile && envPageStore.selectedFile;

  return (
    <div className={cls.Sidebar}>
      <div
        className={cn(cls.Sidebar__tabs, {
          [cls.Sidebar__tabs_hide]: !envPageStore.isActiveTab,
        })}
      >
        {envPageStore.isShowFiles && <Files />}
        {envPageStore.isShowChat && <Chat />}
        {envPageStore.isShowEditor && <Editor />}
      </div>

      <div className={cls.Sidebar__btns}>
        <button
          className={cn(cls.Sidebar__btn, {
            [cls.Sidebar__btn_active]: envPageStore.isShowFiles,
          })}
          type="button"
          onClick={handleFilesClick}
        >
          <FilesIcon />
          <Text tag='span' view='p-16'>Файлы</Text>
        </button>
        <button
          className={cn(cls.Sidebar__btn, {
            [cls.Sidebar__btn_active]: envPageStore.isShowChat,
          })}
          type="button"
          onClick={handleChatClick}
        >
          <ChatIcon />
          <Text tag='span' view='p-16'>Чат</Text>
        </button>
        {showEditorTab && (
          <button
            className={cn(cls.Sidebar__btn, {
              [cls.Sidebar__btn_active]: envPageStore.isShowEditor,
            })}
            type="button"
            onClick={handleEditorClick}
          >
            <EditorIcon />
            <Text tag='span' view='p-16'>Редактор</Text>
          </button>
        )}
      </div>
    </div>
  );
});

export default Sidebar;
