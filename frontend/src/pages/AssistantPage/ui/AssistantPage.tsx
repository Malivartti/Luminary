import assistantStore from '@entities/assistant';
import { AppRouteUrls } from '@shared/config/router';
import { splitTextByEmptyLines } from '@shared/lib/string';
import Button, { ButtonTheme } from '@shared/ui/Button';
import Text from '@shared/ui/Text';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import assistantPageStore from '../store';
import cls from './AssistantPage.module.scss';

interface Props {
    className?: string;
}

const AssistantPage: FC<Props> = observer(({ className }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    assistantPageStore.setAssistantId(id);
    if (id == 'new') return;
    assistantPageStore.getAssistant();
  }, [id, assistantPageStore.isEditing]);


  const handleEditClick = () => {
    assistantPageStore.setIsEditing(true);
  };

  const handleSaveClick = async () => {
    await assistantPageStore.createOrUpdateAssistant();
    if (assistantStore.network.isError) return;
    assistantPageStore.setIsEditing(false); // Выходим из режима редактирования после сохранения
    if (id == 'new') {
      navigate(AppRouteUrls.assistant.create(assistantPageStore.assistantId));
    }
  };

  const handleCancelClick = () => {
    assistantPageStore.setIsEditing(false); //Выходим из режима редактирования
    assistantStore.getAssistant(id); // Сбрасываем изменения
  };

  return (
    <div className={cn(cls.AssistantPage, {}, [className])}>
      {assistantPageStore.isEditing ? (
        // Режим редактирования
        <div>
          <Text view='p-16'>Имя:</Text>
          <input
            type="text"
            value={assistantPageStore.name}
            onChange={(e) => {
              assistantPageStore.setName(e.target.value);
            }}
          />

          <Text view='p-16'>Описание:</Text>
          <textarea
            value={assistantPageStore.description}
            onChange={(e) => {
              assistantPageStore.setDescription(e.target.value);
            }}
          />

          <Text view='p-16'>Контекст:</Text>
          <textarea
            className={cls['AssistantPage__edit-context']}
            value={assistantPageStore.context}
            onChange={(e) => {
              assistantPageStore.setContext(e.target.value);
            }}
          />
          <div className={cls.AssistantPage__action}>
            <Button onClick={handleSaveClick}>Сохранить</Button>
            {id !== 'new' && <Button theme={ButtonTheme.OUTLINE} onClick={handleCancelClick}>Отмена</Button>}
          </div>
        </div>
      ) : (
        <div>
          <div className={cls.AssistantPage__head}>
            <Text tag='h2' view='p-32'>{assistantPageStore.name}</Text>
            <Button onClick={handleEditClick}>Редактировать</Button>
          </div>
          <p className={cls.AssistantPage__content}>{assistantPageStore.description}</p>
          <div className={cls.AssistantPage__content}>
            { splitTextByEmptyLines(assistantPageStore.context).map((prg, key) => (
              <p key={key}>
                { prg.split('\n').map((line, key2) => (
                  <div key={key2}>{ line }</div>
                )) }
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default AssistantPage;
