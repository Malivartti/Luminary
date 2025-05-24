import assistantStore from '@entities/assistant';
import { AssistantApi } from '@entities/assistant/model';
import assistantPageStore from '@pages/AssistantPage/store';
import DeleteIcon from '@shared/assets/icons/trash.svg';
import { AppRouteUrls } from '@shared/config/router';
import Button, { ButtonTheme } from '@shared/ui/Button';
import Table from '@shared/ui/Table/Table';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, MouseEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import assistantsPageStore from '../store';
import AssistantList from './AssistantList';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);

  useEffect(() => {
    assistantStore.getAssistants();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 770);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    assistantPageStore.setIsEditing(true);
    assistantPageStore.assistantClear();
    navigate(AppRouteUrls.assistant.create('new'));
  }, [navigate]);

  const transformData = (assistants: AssistantApi[]): { [key: string]: ReactNode; }[] => {
    return assistants.map(assistant => ({ 
      name: assistant.name,
      description: assistant.description,
      action: (
        <div className={cls.AssistantsPage__action}>
          <Button type='button' onClick={() => onUpdate(assistant)}>Подробнее</Button>
          <Button theme={ButtonTheme.DANGER} type='button' onClick={(e) => onDelete(e, assistant)}><DeleteIcon /></Button>
        </div>
      ),
    }));
  };

  const tableData = transformData(assistantStore.assistants);

  return (
    <div className={cn(cls.AssistantsPage, {}, [className])}>
      <DeleteModal />
      <Button className={cls.AssistantsPage__create} type="button" onClick={onCreate}>
        Создать
      </Button>

      {isMobile ? (
        <AssistantList columns={columns} data={tableData} />
      ) : (
        <Table columns={columns} data={tableData} />
      )}
    </div>
  );
});

export default AssistantsPage;
