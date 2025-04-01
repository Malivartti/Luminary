import { EnvModel } from '@entities/envs/model';
import envsPageStore from '@pages/EnvsPage/store';
import UpdateIcon from '@shared/assets/icons/pencil.svg';
import DeleteIcon from '@shared/assets/icons/trash.svg';
import { formatDDMMYYYYHHMM } from '@shared/lib/date';
import Text from '@shared/ui/Text';
import { observer } from 'mobx-react-lite';
import { FC, MouseEvent, useCallback } from 'react';

import cls from './EnvCard.module.scss';

type Props = {
  env: EnvModel
}

const EnvCard: FC<Props> = observer(({ env }) => {
  const handleUpdate = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    envsPageStore.setEnv(env);
    envsPageStore.openModal('update');
  }, [env]);

  const handleDelete = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    envsPageStore.setEnvId(env.id);
    envsPageStore.setTitle(env.title);
    envsPageStore.openModal('delete');
  }, [env]);

  return (
    <div className={cls.EnvCard}>
      <Text tag='div' view='p-20' color='primary' maxLines={1} className={cls.EnvCard__title}>
        {env.title}
      </Text>
      <Text tag='div' view='p-16' color='secondary' maxLines={4} className={cls.EnvCard__description}>
        {env.description}
      </Text>
      <div className={cls.EnvCard__meta}>
        <div className={cls.EnvCard__actions}>
          <button className={cls.EnvCard__action} type='button' onClick={handleUpdate}>
            <UpdateIcon />
          </button>
          <button className={cls.EnvCard__action} type='button' onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>
        <Text tag='div' view='p-14' color='secondary' className={cls.EnvCard__date}> 
          {formatDDMMYYYYHHMM(env.updatedAt)}
        </Text>
      </div>
    </div>
  );
});

export default EnvCard;