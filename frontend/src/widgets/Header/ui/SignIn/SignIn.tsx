import userStore from '@entities/user';
import { AppRouteUrls } from '@shared/config/router';
import Text from '@shared/ui/Text';
import Popup from '@widgets/Popup';
import { observer } from 'mobx-react-lite';
import { FC, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import cls from './SignIn.module.scss';

interface SignInProps {
    className?: string;
}

const SignIn: FC<SignInProps> = observer(({ className }) => {
  const navigate = useNavigate();

  const onSignOut = useCallback(() => {
    userStore.logoutUser();
    navigate(AppRouteUrls.root);
  }, [navigate]);
  
  return (
    <div className={className}>
      {
        userStore.isLogin
          ? (
            <div className={cls.SignIn__user}>
              <Popup button={<Text tag='div' view='p-18'>{userStore.user?.username}</Text>}>
                <Link to={AppRouteUrls.profile.create()}>
                  <Text tag='div' view='p-18'>Профиль</Text>
                </Link>
                <button className={cls.SignIn__btn} type='button' onClick={onSignOut}>
                  <Text tag='div' view='p-18' >Выйти</Text>
                </button>
              </Popup>
              <div className={cls.SignIn__money}>Баланс: { Math.max(userStore.user.role.rubles_limit - userStore.user.rubles_used, 0).toFixed(4) }</div>
            </div>
          )
          : (
            <Link to={AppRouteUrls.login.create()}>
              <Text tag='div' view='p-18'>
                Войти
              </Text>
            </Link>
          )
      }
    </div>
  );
});

export default SignIn;
