import aiStore from '@entities/ai';
import assistantStore from '@entities/assistant';
import envsStore from '@entities/envs';
import envsPageStore from '@pages/EnvsPage/store';
import CloseIcon from '@shared/assets/icons/close.svg';
import Button from '@shared/ui/Button';
import Input from '@shared/ui/Input';
import { Select } from '@shared/ui/Select/Select';
import Text from '@shared/ui/Text';
import Modal from '@widgets/Modal';
import { observer } from 'mobx-react-lite';
import { FormEvent, useCallback, useEffect } from 'react';

import cls from './EnvModal.module.scss';

const EnvModal = observer(() => {

  useEffect(() => {
    aiStore.getAIModels();
    assistantStore.getAssistants();
  }, []);


  const handleSubmit = useCallback(async(e: FormEvent) => {
    e.preventDefault();
    await envsPageStore.saveEnv();
    if (envsStore.network.isError) return; 
    envsStore.getEnvs();
  }, []);

  const handleDelete = useCallback(async(e: FormEvent) => {
    e.preventDefault();
    await envsPageStore.deleteEnv();
    if (envsStore.network.isError) return; 
    envsStore.getEnvs();
  }, []);

  const handleClose = useCallback(() => {
    envsPageStore.setIsOpenModal(false);
  }, []);

  const getModalTitle = () => {
    switch (envsPageStore.modalType) {
    case 'create':
      return 'Создание окружения';
    case 'update':
      return 'Редактирование окружения';
    case 'delete':
      return 'Удаление окружения';
    }
  };

  const getModalBody = () => {
    switch (envsPageStore.modalType) {
    case 'create':
    case 'update':
      return <form
        className={cls.EnvModal__form}
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          className={cls.EnvModal__input}
          type="text" 
          value={envsPageStore.title} 
          onChange={envsPageStore.setTitle}
          error={envsPageStore.titleError}
          placeholder='Заголовок'
        />
        <Input
          className={cls.EnvModal__input}
          type="text" 
          value={envsPageStore.description} 
          onChange={envsPageStore.setDescription}
          placeholder='Описание'
        />
        <Select
          className={cls.EnvModal__select}
          options={assistantStore.assistants?.map(assistant => ({ value: assistant.id, label: assistant.name })) || []}
          value={envsPageStore.assistantId ? { value: envsPageStore.assistantId, label: assistantStore.assistants?.find(a => a.id === envsPageStore.assistantId)?.name || '' } : null}
          onChange={(value) => envsPageStore.setAssistantId(Number(value?.value) || null)}
          placeholder="Выберите ассистента"
        />
        <Select
          className={cls.EnvModal__select}
          options={aiStore.AIModels?.map(model => ({ value: model.id, label: model.name })) || []}
          value={envsPageStore.AIModelId ? { value: envsPageStore.AIModelId, label: aiStore.AIModels?.find(m => m.id === envsPageStore.AIModelId)?.name || '' } : null}
          onChange={(value) => envsPageStore.setAIModelId(Number(value?.value) || null)}
          placeholder="Выберите модель ИИ"
        />

      </form>;
    case 'delete':
      return <div>
        <Text view="p-18"> Вы уверены, что хотите удалить окружение "{envsPageStore.title}"?</Text>
      </div>;
    }
  };

  const getModalBtn = () => {
    switch (envsPageStore.modalType) {
    case 'create':
    case 'update':
      return <Button
        className={cls.EnvModal__btn}
        type='button'
        loading={envsStore.network.isLoading}
        onClick={handleSubmit}
      >
        Сохранить
      </Button>;
    case 'delete':
      return <Button
        className={cls.EnvModal__btn}
        type='button'
        design='danger'
        loading={envsStore.network.isLoading}
        onClick={handleDelete}
      >
        Удалить
      </Button>;
    }
  };

  return (
    <Modal
      isShow={envsPageStore.isOpenModal}
      setIsShow={envsPageStore.setIsOpenModal}
    >
      <div className={cls.EnvModal__header}>
        <Text view="p-20">{getModalTitle()}</Text>
        <button type="button" onClick={handleClose}>
          <CloseIcon className={cls.EnvModal__close}/>
        </button>
      </div>
      <div className={cls.EnvModal__body}>
        {getModalBody()}
      </div>
      {getModalBtn()}
    </Modal>
  );
});

export default EnvModal;
