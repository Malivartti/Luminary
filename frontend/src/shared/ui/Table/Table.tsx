import { default as cn } from 'classnames';
import { FC } from 'react';

import Text from '../Text';
import cls from './Table.module.scss';

interface Column {
  key: string;
  header: string;
}

interface Props {
  className?: string;
  columns: Column[];
  data: { [key: string]: React.ReactNode }[];
}

const Table: FC<Props> = ({ className, columns, data }) => {
  return (
    <table className={cn(cls.Table, {}, [className])}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}><Text view='p-18'>{column.header}</Text></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.key}><Text view='p-16'>{row[column.key]}</Text></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
