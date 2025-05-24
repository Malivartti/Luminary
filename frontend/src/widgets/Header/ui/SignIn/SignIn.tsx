import userStore from '@entities/user';
import BalanceIcon from '@shared/assets/icons/cash-stack.svg';
import { AppRoutes, AppRouteUrls } from '@shared/config/router';
import { truncateString } from '@shared/lib/string';
import Text from '@shared/ui/Text';
import Popup from '@widgets/Popup';
import { observer } from 'mobx-react-lite';
import { FC, useCallback, useEffect,useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import cls from './SignIn.module.scss';
import Button, { ButtonTheme } from '@shared/ui/Button';

interface SignInProps {
    className?: string;
}

const SignIn: FC<SignInProps> = observer(({ className }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentHref = '/' + pathname.split('/').at(-1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const isAuth = currentHref == AppRoutes.LOGIN || currentHref == AppRoutes.REGISTER;

  const onSignOut = useCallback(() => {
    userStore.logoutUser();
    navigate(AppRouteUrls.root);
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatBalance = (balance: number) => {
    return isMobile ? balance.toFixed(2) : balance.toFixed(4);
  };

  
  return (
    <div className={className}>
      {
        userStore.isLogin
          ? (
            <div className={cls.SignIn__user}>
              <Popup button={
                <Text tag='div' view='p-16'>
                  {truncateString(userStore.user?.username || '', 10)}
                </Text>
              }>
                <Button theme={ButtonTheme.CLEAR} className={cls.SignIn__btn} type='button' onClick={onSignOut}>
                  Выйти
                </Button>
              </Popup>
              <div className={cls.SignIn__money}>
                {isMobile ? (
                  <div className={cls.SignIn__link}>
                    <BalanceIcon className={cls.SignIn__icon} />
                    {formatBalance(Math.max(userStore.user.role.rubles_limit - userStore.user.rubles_used, 0))}₽
                  </div>
                ) : (
                  <>
                    Баланс: {formatBalance(Math.max(userStore.user.role.rubles_limit - userStore.user.rubles_used, 0))}₽
                  </>
                )}
              </div>
            </div>
          )
          : !isAuth && (
            (currentHref != AppRoutes.LOGIN && currentHref != AppRoutes.REGISTER ) &&
            <Link to={AppRouteUrls.login.create()}>
              <Text tag='div' view='p-16'>
                Войти
              </Text>
            </Link>
          )
      }
    </div>
  );
});

export default SignIn;
