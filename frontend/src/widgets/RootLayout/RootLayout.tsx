import { useTheme } from '@app/providers/ThemeProvider';
import userStore from '@entities/user';
import classNames from 'classnames';
import { FC, ReactNode, useLayoutEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import ContainerLayout from '../ContainerLayout';
import Header from '../Header';

type RootLayoutProps = {
  children?: ReactNode
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    if (userStore.isLogin) {
      userStore.getUser();
    }
  }, []);

  return (
    <div className={classNames('app', theme)}>
      <Header />
      <ContainerLayout>
        <ToastContainer />
        {children}
      </ContainerLayout>
    </div>
  );
};

export default RootLayout;
