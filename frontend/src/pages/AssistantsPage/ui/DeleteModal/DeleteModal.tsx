import assistantStore from '@entities/assistant';
import assistantsPageStore from '@pages/AssistantsPage/store';
import Button from '@shared/ui/Button';
import Modal from '@widgets/Modal';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import cls from './DeleteModal.module.scss';

interface Props {
    className?: string;
}

const DeleteModal: FC<Props> = observer(({ className }) => {
  const onDelete = async () => {
    await assistantStore.deleteAssistant(assistantStore.assistant.id);
    if (assistantStore.network.isError) return;
    assistantsPageStore.setIsOpenModal(false);
    assistantStore.getAssistants();
  };

  const onPass = () => {
    assistantsPageStore.setIsOpenModal(false);
  };

  return (
    <Modal
      isShow={assistantsPageStore.isOpenModal}
      setIsShow={assistantsPageStore.setIsOpenModal}
    >
      <div>Вы уверены, что хотите удалить ассистента "{assistantStore.assistant?.name}"?</div>
      <div className={cls.DeleteModal__action}>
        <button className={cls.DeleteModal__btn} type='button' onClick={onPass}>Отмена</button>
        <Button onClick={onDelete} loading={assistantStore.network.isLoading}>Удалить</Button>
      </div>
    </Modal>
  );
});

export default DeleteModal;
