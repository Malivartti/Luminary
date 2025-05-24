import { AppRoutes } from '@shared/config/router';
import ContainerLayout from '@widgets/ContainerLayout';
import ThemeSwitcher from '@widgets/ThemeSwitcher';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import cls from './Header.module.scss';
import Logo from './Logo';
import Navbar from './Navbar';
import SignIn from './SignIn';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [withTransition, setWithTransition] = useState(false);
  const isFirstRender = useRef(true);
  const { pathname } = useLocation();
  const currentHref = '/' + pathname.split('/').at(-1);
  const isAuth = currentHref == AppRoutes.LOGIN || currentHref == AppRoutes.REGISTER;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      setWithTransition(true);
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setWithTransition(false);
      setIsOpen(false);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isOpen) setWithTransition(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    setWithTransition(true);
  };

  return (
    <div className={cls.Header}>
      <ContainerLayout className={cls.Header__container}>
        <Logo />
        <div className={cls.Header__desktop}>
          <div className={cls.Header__navWrapper}>
            <Navbar onLinkClick={() => setIsOpen(false)} />
          </div>
          <div className={cls.Header__rightSection}>
            <SignIn />
            <ThemeSwitcher />
          </div>
        </div>
        {!isAuth && (
          <>
            <div className={cls.Header__mobile}>
              <SignIn />
              <button
                className={`${cls.burger} ${isOpen ? cls.open : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
            <nav
              className={[
                cls.Header__nav,
                isOpen ? cls.open : '',
                withTransition ? cls.withTransition : ''
              ].join(' ')}
            >
              <div className={cls.Header__navContent}>
                <Navbar onLinkClick={() => setIsOpen(false)} />
                <div className={cls.Header__themeWrapper}>
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>
          </>
        )}
      </ContainerLayout>
    </div>
  );
};

export default Header;
