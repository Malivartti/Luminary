


import userStore, { Role } from '@entities/user';
import AIModelsPage from '@pages/AIModelsPage/ui/AIModelsPage';
import AssistantPage from '@pages/AssistantPage';
import AssistantsPage from '@pages/AssistantsPage';
import EnvPage from '@pages/EnvPage';
import EnvsPage from '@pages/EnvsPage';
import GenHistoryPage from '@pages/GenHistoryPage/ui/GenHistoryPage';
import LoginPage from '@pages/LoginPage';
import NotFoundPage from '@pages/NotFoundPage';
import ProfilePage from '@pages/ProfilePage';
import RegisterPage from '@pages/RegisterPage';
import { useMemo } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';

export enum AppRoutes {
  MAIN = '/',
  ENVS = '/envs',
  ENV = '/envs/:id',
  LOGIN = '/login',
  REGISTER = '/register',
  PROFILE = '/profile',
  ASSISTANTS = '/assistants',
  ASSISTANT = '/assistants/:id',
  AI_MODELS = '/ai-models',
  HISTORY = '/history',
  NOT_FOUND = '*'
}

type TAppRoutePages = RouteProps & {
  roles: Role[]
}

export const AppRoutePages: TAppRoutePages[] = [
  {
    path: AppRoutes.MAIN,
    element: <Navigate to={AppRoutes.LOGIN} replace={true} />,
    roles: [Role.GUEST],
  },
  {
    path: AppRoutes.MAIN,
    element: <Navigate to={AppRoutes.ENVS} replace={true} />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.ENVS,
    element: <EnvsPage />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.ENV,
    element: <EnvPage />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.LOGIN,
    element: <LoginPage />,
    roles: [Role.GUEST],
  },
  {
    path: AppRoutes.REGISTER,
    element: <RegisterPage />,
    roles: [Role.GUEST],
  },
  {
    path: AppRoutes.PROFILE,
    element: <ProfilePage />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.ASSISTANTS,
    element: <AssistantsPage />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.ASSISTANT,
    element: <AssistantPage />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.AI_MODELS,
    element: <AIModelsPage />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.HISTORY,
    element: <GenHistoryPage />,
    roles: [Role.DEMO],
  },
  {
    path: AppRoutes.NOT_FOUND,
    element: <NotFoundPage />,
    roles: [],
  }
];

export const AppRouteUrls = {
  root: AppRoutes.MAIN,
  envs: {
    mask: AppRoutes.ENVS,
    create: () => AppRoutes.ENVS,
  },
  env: {
    mask: AppRoutes.ENV,
    create: (id: string | number) => `${AppRoutes.ENVS}/${id}`,
  },
  login: {
    mask: AppRoutes.LOGIN,
    create: () => AppRoutes.LOGIN,
  },
  register: {
    mask: AppRoutes.REGISTER,
    create: () => AppRoutes.REGISTER,
  },
  profile: {
    mask: AppRoutes.PROFILE,
    create: () => AppRoutes.PROFILE,
  },
  assistants: {
    mask: AppRoutes.ASSISTANTS,
    create: () => AppRoutes.ASSISTANTS,
  },
  assistant: {
    mask: AppRoutes.ASSISTANT,
    create: (id: string | number) => `${AppRoutes.ASSISTANTS}/${id}`,
  },
  'ai-model': {
    mask: AppRoutes.AI_MODELS,
    create: () => AppRoutes.AI_MODELS,
  },
  'history': {
    mask: AppRoutes.HISTORY,
    create: () => AppRoutes.HISTORY,
  },
  notFound: {
    mask: AppRoutes.NOT_FOUND,
    create: () => AppRoutes.NOT_FOUND,
  },
};

export const useAccessPages = (pages: TAppRoutePages[]) => {
  const userRole = userStore.user?.role.name ?? Role.GUEST;

  return useMemo(() => pages.map((page) => {
    if (page.path === AppRoutes.NOT_FOUND) {
      return page;
    }
    
    if (page.roles.includes(userRole)) {
      return page;
    }
  }).filter(Boolean),
  [userRole, pages]
  );
};