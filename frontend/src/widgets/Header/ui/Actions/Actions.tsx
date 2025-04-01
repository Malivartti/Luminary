
import ThemeSwitcher from '@widgets/ThemeSwitcher';

import SignIn from '../SignIn';
import cls from './Actions.module.scss';

const Actions = () => {
  return (
    <div className={cls.Actions}>
      <ThemeSwitcher className={cls.Actions__item} />
      <SignIn className={cls.Actions__item} />
    </div>
  );
};

export default Actions;
