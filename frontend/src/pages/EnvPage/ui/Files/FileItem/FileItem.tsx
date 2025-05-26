import { NFile } from '@entities/network/model';
import envPageStore from '@pages/EnvPage/store';
import ErrorIcon from '@shared/assets/icons/error.svg';
import FileIcon from '@shared/assets/icons/file.svg';
import DeleteIcon from '@shared/assets/icons/trash.svg';
import Loader from '@shared/ui/Loader';
import Text from '@shared/ui/Text';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, MouseEvent, useCallback } from 'react';

import cls from './FileItem.module.scss';

type Props = {
  file: NFile
}

const FileItem: FC<Props> = observer(({ file }) => {
  const handleClick = useCallback(async () => {
    await envPageStore.readFile(file.name);
    envPageStore.setSelectedFile(file.name);
  }, [file]);

  const handleDelete = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    envPageStore.deleteFile(file.name);
  }, [file]);

  const isSelected = () => {
    return file.name === envPageStore.selectedFile;
  };

  return (
    <button className={cn(cls.FileItem, { [cls.FileItem_selected]: isSelected() })} onClick={handleClick}>
      <div className={cls.FileItem__head}>
        {file.network.isLoading && <Loader className={cls['FileItem__status-icon']} size='s' />}
        {(!file.network.isLoading && !file.network.isError) && <FileIcon className={cls['FileItem__status-icon']} />}
        {file.network.isError && <ErrorIcon className={cn(cls['FileItem__status-icon'], cls['FileItem__status-icon_error'])} />}
        <Text view='p-14' className={cls.FileItem__name}>{file.name}</Text>
      </div>
      <div className={cls.FileItem__actions}>
        <button className={cls.FileItem__action} type='button' onClick={handleDelete}>
          <DeleteIcon className={cls.FileItem__icon} />
        </button>
      </div>
    </button>
  );
});

export default FileItem;
