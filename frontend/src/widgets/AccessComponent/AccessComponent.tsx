import userStore, { Role } from '@entities/user';
import { observer } from 'mobx-react-lite';
import { FC, ReactNode } from 'react';

type AccessComponentProps = {
  roles: Role[];
  children: ReactNode;
}

const AccessComponent: FC<AccessComponentProps> = observer(({ roles, children }) => {
  const userRole = userStore.user?.role.name ?? Role.GUEST;

  if (roles.includes(userRole)) {
    return children;
  }
});

export default AccessComponent;
