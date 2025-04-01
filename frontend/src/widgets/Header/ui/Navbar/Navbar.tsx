import { Role } from '@entities/user';
import envPageStore from '@pages/EnvPage/store';
import { AppRoutes } from '@shared/config/router';
import { validateUrlId } from '@shared/lib/validate';
import Text from '@shared/ui/Text';
import AccessComponent from '@widgets/AccessComponent/AccessComponent';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';

import cls from './Navbar.module.scss';

const Navbar = observer(() => {
  const { pathname } = useLocation();
  const currentHref = '/' + pathname.split('/').at(-1);
  return (
    <div className={cls.Navbar}>
      <AccessComponent roles={[Role.DEMO]}>
        <Link to={AppRoutes.ENVS} className={cls.Navbar__link}>
          <Text view='p-18' color={currentHref === AppRoutes.ENVS ? 'accent' : 'primary'}>Окружения</Text>
        </Link>

        {validateUrlId(pathname) && (
          <Text view='p-18' className={cn(cls.Navbar__link, cls.Navbar__link_env)} color='accent'>{envPageStore.envTitle}</Text>
        )}

        <Link to={AppRoutes.ASSISTANTS} className={cls.Navbar__link}>
          <Text view='p-18' color={currentHref === AppRoutes.ASSISTANTS ? 'accent' : 'primary'}>Ассистенты</Text>
        </Link>

        <Link to={AppRoutes.AI_MODELS} className={cls.Navbar__link}>
          <Text view='p-18' color={currentHref === AppRoutes.AI_MODELS ? 'accent' : 'primary'}>Модели</Text>
        </Link>
        <Link to={AppRoutes.HISTORY} className={cls.Navbar__link}>
          <Text view='p-18' color={currentHref === AppRoutes.HISTORY ? 'accent' : 'primary'}>История</Text>
        </Link>
      </AccessComponent>
    </div>
  );
});

export default Navbar;
