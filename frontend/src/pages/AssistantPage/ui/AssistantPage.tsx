import assistantStore from '@entities/assistant';
import { AppRouteUrls } from '@shared/config/router';
import { splitTextByEmptyLines } from '@shared/lib/string';
import Button, { ButtonTheme } from '@shared/ui/Button';
import Input from '@shared/ui/Input';
import Text from '@shared/ui/Text';
import Textarea from '@shared/ui/Textarea';
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
        <div>
          <div className={cls.AssistantPage__block}>
            <Text view='p-16'>Имя:</Text>
            <Input
              className={cls['AssistantPage__block-input']}
              value={assistantPageStore.name}
              onChange={(value) => assistantPageStore.setName(value)}
              placeholder='Введите имя ассистента'
            />
          </div>

          <div className={cls.AssistantPage__block}>
            <Text view='p-16'>Описание:</Text>
            <Textarea
              className={cls['AssistantPage__block-input']}
              value={assistantPageStore.description}
              onChange={(value) => assistantPageStore.setDescription(value)}
              placeholder='Введите описание ассистента'
            />
          </div>

          <div className={cls.AssistantPage__block}>
            <Text view='p-16'>Контекст:</Text>
            <Textarea
              className={cls['AssistantPage__block-input']}
              innerClassName={cls['AssistantPage__block-context']}
              value={assistantPageStore.context}
              onChange={(value) => assistantPageStore.setContext(value)}
              placeholder='Введите контекст ассистента'
            />
          </div>

          <div className={cls.AssistantPage__action}>
            <Button onClick={handleSaveClick}>Сохранить</Button>
            {id !== 'new' && <Button theme={ButtonTheme.CLEAR} onClick={handleCancelClick}>Отмена</Button>}
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
