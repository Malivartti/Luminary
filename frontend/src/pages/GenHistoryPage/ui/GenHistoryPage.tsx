import aiStore from '@entities/ai';
import { HistoryApi } from '@entities/ai/model';
import { formatDDMMYYYYHHMM } from '@shared/lib/date';
import Table from '@shared/ui/Table/Table';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';

import cls from './GenHistoryPage.module.scss';

const columns =[
  {
    key: 'created_at',
    header: 'Время',
  },
  {
    key: 'environment',
    header: 'Окружение',
  },
  {
    key: 'ai_model',
    header: 'Модель',
  },
  {
    key: 'input_tokens',
    header: 'Входные токены',
  },
  {
    key: 'output_tokens',
    header: 'Выходные токены',
  },
  {
    key: 'cost',
    header: 'Стоимость',
  }
];

interface Props {
    className?: string;
}

const GenHistoryPage: FC<Props> = observer(({ className }) => {

  useEffect(() => {
    aiStore.getHistory();
  }, []);

  const GenHistoryList = (models: HistoryApi[]): { [key: string]: ReactNode; }[] => {
    return models.map(model => ({ 
      environment: model.environment.name,
      ai_model: model.ai_model.name,
      input_tokens: model.input_tokens,
      output_tokens: model.output_tokens,
      cost: model.cost.toFixed(4),
      created_at: formatDDMMYYYYHHMM(model.created_at),
    }));
  };
    
  return (
    <div className={cn(cls.GenHistoryPage, {}, [className])}>
      <Table columns={columns} data={GenHistoryList(aiStore.history)} />
    </div>
  );
});

export default GenHistoryPage;
