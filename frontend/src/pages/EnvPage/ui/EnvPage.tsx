import aiStore from '@entities/ai';
import filesStore from '@entities/files';
import { useTrackMetaAndToast } from '@shared/hooks/useTrackMetaAndToast';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import envPageStore from '../store';
import Editor from './Editor';
import cls from './EnvPage.module.scss';
import Sidebar from './Sidebar';

const EnvPage = observer(() => {
  const { id } = useParams();

  useEffect(() => {
    const checkMobile = () => {
      envPageStore.setIsMobile(window.innerWidth <= 970);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    envPageStore.defaultEnv();
    envPageStore.setEnvId(id);
    envPageStore.getEnv();
    envPageStore.getFiles();
    aiStore.getContext(id);
    aiStore.getAIModels();
  }, [id]);

  useTrackMetaAndToast({ network: filesStore.network });
  useTrackMetaAndToast({ network: aiStore.network });

  return (
    <div className={cls.EnvPage}>
      <div className={cls.EnvPage__main}>
        {!envPageStore.isMobile && <Sidebar />}
        {!envPageStore.isMobile && envPageStore.selectedFile && (
          <Editor className={cls.EnvPage__editor} />
        )}
        {envPageStore.isMobile && <Sidebar />}
      </div>
    </div>
  );
});

export default EnvPage;
