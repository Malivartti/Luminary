import ContainerLayout from '@widgets/ContainerLayout';

import Actions from './Actions';
import cls from './Header.module.scss';
import Logo from './Logo';
import Navbar from './Navbar';

const Header = () => {
  return (
    <div className={cls.Header}>
      <ContainerLayout className={cls.Header__container}>
        <Logo />
        <Navbar />
        <Actions />
      </ContainerLayout>
    </div>
  );
};

export default Header;