import userStore from '@entities/user';
import { AppRouteUrls } from '@shared/config/router';
import { useTrackMetaAndToast } from '@shared/hooks/useTrackMetaAndToast';
import Button, { ButtonTheme } from '@shared/ui/Button';
import Input from '@shared/ui/Input';
import Text from '@shared/ui/Text';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginPageStore from '../store/LoginPageStore';
import cls from './LoginPage.module.scss';

const LoginPage = observer(() => {
  const loginPageStore = useLocalObservable(() => new LoginPageStore());
  const navigate = useNavigate();

  const onSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    await loginPageStore.login();

    if (!userStore.network.isSuccess) return;

    navigate(AppRouteUrls.root);
  }, [loginPageStore, navigate]);

  const toRegister = useCallback(() => {
    navigate(AppRouteUrls.register.create());
  }, [navigate]);

  useTrackMetaAndToast({ network: userStore.network });

  return (
    <div className={cls.LoginPage}>
      <form className={cls.LoginPage__form} onSubmit={onSubmit} noValidate>
        <Text 
          className={cls.LoginPage__title}
          tag='h1' 
          view='title'
        >
          Вход
        </Text>
        <Input 
          className={cls.LoginPage__input}
          type="text" 
          value={loginPageStore.username} 
          onChange={loginPageStore.setUsername}
          error={loginPageStore.usernameError}
          placeholder='Имя'
        />
        <Input
          className={cls.LoginPage__input}
          type='password' 
          value={loginPageStore.password} 
          onChange={loginPageStore.setPassword} 
          error={loginPageStore.passwordError}
          placeholder='Пароль'
        />
        <Button
          className={cls['LoginPage__sign-up']}
          theme={ButtonTheme.CLEAR}
          onClick={toRegister}
          type='button'
        >
          Зарегистрироваться
        </Button>
        <Button
          className={cls.LoginPage__btn}
          type='submit'
          loading={userStore.network.isLoading}
        >
          Войти
        </Button>
      </form>
    </div>
  );
});

export default LoginPage;
