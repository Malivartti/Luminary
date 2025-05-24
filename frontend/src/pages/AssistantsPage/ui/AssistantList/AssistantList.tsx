// AssistantList.tsx
import Text from '@shared/ui/Text';
import { default as cn } from 'classnames';
import { FC } from 'react';

import cls from './AssistantList.module.scss';
interface Column {
  key: string;
  header: string;
}

interface Props {
  className?: string;
  columns: Column[];
  data: { [key: string]: React.ReactNode }[];
}

const AssistantList: FC<Props> = ({ className, columns, data }) => {
  return (
    <div className={cn(cls.ListContainer, className)}>
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className={cls.ListItem}>
          {columns.map((column) => (
            <div key={column.key} className={cls.ListField}>
              <div className={cls.ListFieldLabel}>
                <Text view='p-18'>{column.header}</Text>
              </div>
              <div className={cls.ListFieldValue}>
                <Text view='p-16'>{row[column.key]}</Text>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AssistantList;
