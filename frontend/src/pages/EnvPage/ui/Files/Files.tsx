import aiStore from '@entities/ai';
import envPageStore from '@pages/EnvPage/store';
import LoadIcon from '@shared/assets/icons/import.svg';
import Button, { ButtonTheme } from '@shared/ui/Button';
import Input from '@shared/ui/Input';
import Text from '@shared/ui/Text';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, FormEvent, useCallback, useRef, useState } from 'react';

import FileItem from './FileItem';
import cls from './Files.module.scss';

type Props = {
  className?: string
}

const Files: FC<Props> = observer(({ className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = useCallback(() => {
    inputRef.current.click();
  }, []);

  const handleInput = useCallback(async (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    await envPageStore.loadFile(target.files);
    inputRef.current.value = '';
  }, []);

  const handleCommitFiles = () => {
    aiStore.commitFiles(envPageStore.envId);
  };

  const handleClearContext = () => {
    aiStore.clearContext(envPageStore.envId);
  };

  const [isCreate, setIsCreate] = useState(false);
  const [filename, setFilename] = useState('');

  const handleCreateFile = (e: FormEvent) => {
    e.preventDefault();
    if (!filename) {
      setIsCreate(false);
    };
    
    const validate = filename.split('.');
    if (!(validate.length == 2 && ['txt', 'rtf', 'md'].includes(validate[1]))) return; 

    envPageStore.createFile(filename);
    setIsCreate(false);
    setFilename('');
  };

  return (
    <div className={cn(cls.Files, className)}>
      <input
        type="file"
        accept='.txt,.rtf,.md'
        style={{ display: 'none' }}
        onChange={handleInput}
        multiple
        ref={inputRef}
      />

      <div className={cls.Files__btns}>
        {/* <Button type='button' theme={ButtonTheme.CLEAR}>
          <DownloadIon /> Скачать
        </Button> */}
        <Button type='button' theme={ButtonTheme.CLEAR} onClick={() => setIsCreate(true)}> 
          Создать
        </Button>
        <Button type='button' theme={ButtonTheme.CLEAR} onClick={handleLoadClick}> 
          <LoadIcon /> Загрузить
        </Button>
      </div>
      <div className={cls.Files__list}>
        {envPageStore.files?.map(file => (
          <FileItem key={file.name} file={file} />
        ))}
        {isCreate && (
          <div className={cls.Files__add}>
            <form className={cls.Files__form} onSubmit={handleCreateFile}>
              <Input className={cls.Files__input} value={filename} onChange={setFilename} />
              <Button type='submit'>Ок</Button>
            </form>
            <Text view='p-14'>Поддерживаются форматы .txt,.rtf,.md</Text>
          </div>
        )}
      </div>
      <Button className={cls.Files__btn} loading={aiStore.networkCommitFiles.isLoading} onClick={handleCommitFiles}>Добавить файлы и начать диалог</Button>
      <Button onClick={handleClearContext} loading={aiStore.networkClearContext.isLoading}>Очистить историю диалога</Button>
    </div>
  );
});

export default Files;
