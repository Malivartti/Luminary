import aiStore from '@entities/ai';
import { AIModelAPI } from '@entities/ai/model';
import AnthropicLogoIcon from '@shared/assets/icons/anthropic-logo.svg';
import DeepseekLogoIcon from '@shared/assets/icons/deepseek-logo.svg';
import GoogleGeminiLogoIcon from '@shared/assets/icons/google-gemini-logo.svg';
import OpenAILogoIcon from '@shared/assets/icons/openai-logo.svg';
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

interface AIModelCardProps {
  model: AIModelAPI;
}

const getLogo = (modelName: string) => {
  if (modelName.toLowerCase().includes('claude')) return AnthropicLogoIcon;
  if (modelName.toLowerCase().includes('deepseek')) return DeepseekLogoIcon;
  if (modelName.toLowerCase().includes('gemini')) return GoogleGeminiLogoIcon;
  if (modelName.toLowerCase().includes('gpt')) return OpenAILogoIcon;
  return null;
};

const AIModelCard: FC<AIModelCardProps> = ({ model }) => {
  const Logo = getLogo(model.name);
  return (
    <div className={cls.AIModelCard}>
      <div className={cls.CardHeader}>
        <Logo className={cls.Logo} />
        {/* <h3 className={cls.ModelName}>{model.name}</h3> */}
      </div>
      <p className={cls.Description}>{model.description || 'Описание отсутствует'}</p>
    </div>
  );
};

const AIModelsPage: FC<Props> = observer(({ className }) => {
  useEffect(() => {
    aiStore.getAIModels();
  }, []);

  const AIModelsList = (models: AIModelAPI[]): { [key: string]: ReactNode; }[] => {
    return models.map(model => ({ 
      name: model.name,
      context: formatNumberWithSpaces(model.context),
      input_price: model.input_price.toFixed(4),
      output_price: model.output_price.toFixed(4),
    }));
  };

  return (
    <div className={cn(cls.AIModelsPage, {}, [className])}>
      <Table columns={columns} data={AIModelsList(aiStore.AIModels)} />
      <div className={cls.CardsContainer}>
        {aiStore.AIModels.map(model => (
          <AIModelCard key={model.name} model={model} />
        ))}
      </div>
    </div>
  );
});

export default AIModelsPage;