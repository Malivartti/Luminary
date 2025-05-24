import aiStore from '@entities/ai';
import envPageStore from '@pages/EnvPage/store';
import BrainIcon from '@shared/assets/icons/brain.svg';
import Text from '@shared/ui/Text';
import Popup from '@widgets/Popup';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import cls from './AIModelSelector.module.scss';

const AIModelSelector = observer(() => {
  const handleModelSelect = useCallback(async (modelId: number) => {
    await envPageStore.editEnvAIModel(modelId);
  }, []);

  return (
    <Popup
      button={
        <div className={cls.AIModelSelector__button}>
          <BrainIcon className={cls.AIModelSelector__icon} />
        </div>
      }
      width={250}
      position='top'
    >
      <div className={cls.AIModelSelector__list}>
        {aiStore.AIModels.map(model => (
          <button
            key={model.id}
            type="button"
            className={`${cls.AIModelSelector__item} ${
              model.id === envPageStore.envAIModel ? cls.AIModelSelector__item_active : ''
            }`}
            onClick={() => handleModelSelect(model.id)}
          >
            <Text tag='span' view='p-16'>{model.name}</Text>
          </button>
        ))}
      </div>
    </Popup>
  );
});

export default AIModelSelector;
