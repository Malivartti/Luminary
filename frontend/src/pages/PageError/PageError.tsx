import Button from '@shared/ui/Button';
import Text from '@shared/ui/Text';
import { useCallback } from 'react';

import cls from './PageError.module.scss';

const PageError = () => {

  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className={cls.PageError}>
      <Text view='title' tag='h1'>Произошла непредвиденная ошибка</Text>
      <Button onClick={refreshPage}>Обновить страницу</Button>
    </div>
  );
};

export default PageError;
