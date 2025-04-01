import assistantStore from '@entities/assistant';
import { AssistantApi } from '@entities/assistant/model';
import assistantPageStore from '@pages/AssistantPage/store';
import DeleteIcon from '@shared/assets/icons/trash.svg';
import { AppRouteUrls } from '@shared/config/router';
import Button from '@shared/ui/Button';
import Table from '@shared/ui/Table/Table';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, MouseEvent, ReactNode, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import assistantsPageStore from '../store';
import cls from './AssistantsPage.module.scss';
import DeleteModal from './DeleteModal';

interface Props {
    className?: string;
}

const columns = [
  {
    key: 'name',
    header: 'Имя',
  },
  {
    key: 'description',
    header: 'Описание',
  },
  {
    key: 'action',
    header: 'Действия',
  }
];

const AssistantsPage: FC<Props> = observer(({ className }) => {
  const navigate = useNavigate();

  useEffect(() => {
    assistantStore.getAssistants();
  }, []);

  const onUpdate = useCallback((assistant: AssistantApi) => {
    assistantStore.setAssistant(assistant);
    assistantPageStore.setIsEditing(false);
    navigate(AppRouteUrls.assistant.create(assistant.id));
  }, [navigate]);

  const onDelete = useCallback((e: MouseEvent<HTMLButtonElement>, assistant: AssistantApi) => {
    e.stopPropagation();
    assistantStore.setAssistant(assistant);
    assistantsPageStore.openModal();
  }, []);

  const onCreate = useCallback(() => {
    assistantPageStore.setIsEditing(true); // Переключаем в режим редактирования
    assistantPageStore.assistantClear();
    navigate(AppRouteUrls.assistant.create('new')); // Используем строку 'new' как ID
  }, [navigate]);


  const AssistantList = (assistants: AssistantApi[]): { [key: string]: ReactNode; }[] => {
    return assistants.map(assistant => ({ 
      name: assistant.name,
      description: assistant.description,
      action: (
        <div className={cls.AssistantsPage__action}>
          <Button type='button' onClick={() => onUpdate(assistant)}>Подробнее</Button>
          <button className={cls.AssistantsPage__delete} type='button' onClick={(e) => onDelete(e, assistant)}><DeleteIcon /></button>
        </div>
      ),
    }));
  };

  return (
    <div className={cn(cls.AssistantsPage, {}, [className])}>
      <DeleteModal />
      <button type="button" onClick={onCreate}>
        Создать
      </button>

      <Table columns={columns} data={AssistantList(assistantStore.assistants)} />
    </div>
  );
});

export default AssistantsPage;
