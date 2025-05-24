import userStore from '@entities/user';
import { AppRouteUrls } from '@shared/config/router';
import { useTrackMetaAndToast } from '@shared/hooks/useTrackMetaAndToast';
import Button, { ButtonTheme } from '@shared/ui/Button';
import Input from '@shared/ui/Input';
import Text from '@shared/ui/Text';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import RegisterPageStore from '../store/RegisterPageStore';
import cls from './RegisterPage.module.scss';

const RegisterPage = observer(() => {
  const registerPageStore = useLocalObservable(() => new RegisterPageStore());
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    await registerPageStore.register();

    if (!userStore.network.isSuccess) return;
    navigate(AppRouteUrls.envs.create());
  }, [registerPageStore, navigate]);

  const toLogin = useCallback(() => {
    navigate(AppRouteUrls.login.create());
  }, [navigate]);

  useTrackMetaAndToast({ network: userStore.network });

  return (
    <div className={cls.RegisterPage}>
      <form className={cls.RegisterPage__form} onSubmit={onSubmit} noValidate>
        <Text
          className={cls.RegisterPage__title}
          tag='h1'
          view='title'
        >
          Регистрация
        </Text>
        <Input 
          className={cls.RegisterPage__input}
          type="text" 
          value={registerPageStore.username} 
          onChange={registerPageStore.setUsername}
          error={registerPageStore.usernameError}
          placeholder='Имя'
        />
        <Input 
          className={cls.RegisterPage__input}
          type='password' 
          value={registerPageStore.password} 
          onChange={registerPageStore.setPassword}
          error={registerPageStore.passwordError}
          placeholder='Пароль'
        />
        <Input 
          className={cls.RegisterPage__input}
          type='password' 
          value={registerPageStore.passwordRepeat} 
          onChange={registerPageStore.setPasswordRepeat}
          error={registerPageStore.passwordRepeatError}
          placeholder='Повторите пароль'
        />
        <Button
          className={cls['RegisterPage__sign-in']}
          theme={ButtonTheme.CLEAR}
          onClick={toLogin}
          type='button'
        >
          Войти
        </Button>
        <Button 
          className={cls.RegisterPage__btn}
          type='submit'
        >
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
});

export default RegisterPage;
