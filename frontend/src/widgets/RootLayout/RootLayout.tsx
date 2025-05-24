import { useActualTheme } from '@app/providers/ThemeProvider';
import userStore from '@entities/user';
import { FC, ReactNode, useLayoutEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import ContainerLayout from '../ContainerLayout';
import Header from '../Header';

type RootLayoutProps = {
  children?: ReactNode
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const actualTheme = useActualTheme();

  useLayoutEffect(() => {
    if (userStore.isLogin) {
      userStore.getUser();
    }
  }, []);

  useLayoutEffect(() => {
    document.body.className = `app ${actualTheme}`;
  }, [actualTheme]);

  return (
    <>
      <Header />
      <ContainerLayout>
        <ToastContainer />
        {children}
      </ContainerLayout>
    </>
  );
};

export default RootLayout;
