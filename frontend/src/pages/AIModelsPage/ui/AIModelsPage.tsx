import aiStore from '@entities/ai';
import { AIModelAPI } from '@entities/ai/model';
import { formatNumberWithSpaces } from '@shared/lib/format';
import Table from '@shared/ui/Table/Table';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';

import cls from './AIModelsPage.module.scss';

const columns = [
  {
    key: 'name',
    header: 'Название',
  },
  // {
  //   key: 'description',
  //   header: 'Описание',
  // },
  {
    key: 'context',
    header: 'Размер контекста',
  },
  {
    key: 'input_price',
    header: 'Руб за 1000 токенов входных данных',
  },
  {
    key: 'output_price',
    header: 'Руб за 1000 токенов генерации модели',
  }
];

interface Props {
    className?: string;
}

const AIModelsPage: FC<Props> = observer(({ className }) => {
  useEffect(() => {
    aiStore.getAIModels();
  }, []);

  const AIModelsList = (models: AIModelAPI[]): { [key: string]: ReactNode; }[] => {
    return models.map(model => ({ 
      name: model.name,
      description: model.description,
      context: formatNumberWithSpaces(model.context),
      input_price: model.input_price.toFixed(4),
      output_price: model.output_price.toFixed(4),
    }));
  };

  return (
    <div className={cn(cls.AIModelsPage, {}, [className])}>
      <Table columns={columns} data={AIModelsList(aiStore.AIModels)} />
    </div>
  );
});

export default AIModelsPage;
