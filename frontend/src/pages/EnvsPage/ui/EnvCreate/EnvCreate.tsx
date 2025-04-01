

import envsPageStore from '@pages/EnvsPage/store';
import Text from '@shared/ui/Text';
import { observer } from 'mobx-react-lite';
import { MouseEvent, useCallback } from 'react';

import cls from './EnvCreate.module.scss';

const EnvCreate = observer(() => {

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    envsPageStore.openModal();
  }, []);

  return (
    <button className={cls.EnvCreate} type='button' onClick={handleClick}>
      <Text tag='div' view='p-20'>
        Создать
      </Text>
    </button>
  );
});

export default EnvCreate;
