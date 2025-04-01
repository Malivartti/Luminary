import envsStore from '@entities/envs';
import { useTrackMetaAndToast } from '@shared/hooks/useTrackMetaAndToast';
import { useEffect } from 'react';

import EnvList from './EnvList';
import EnvModal from './EnvModal';
import cls from './EnvsPage.module.scss';

const EnvsPage = () => {
  useEffect(() => {
    envsStore.getEnvs();
  }, []);  

  useTrackMetaAndToast({ network: envsStore.network });

  return (
    <div className={cls.EnvsPage}>
      <EnvModal />
      <EnvList />
    </div>
  );
};

export default EnvsPage;
