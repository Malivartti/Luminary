import { API_ENTRY_POINT } from '@shared/config/api';

export const endpoints = {
  register: () => `${API_ENTRY_POINT}/register/`,
  auth: () => `${API_ENTRY_POINT}/auth/`,
  user: () => `${API_ENTRY_POINT}/api/v1/users/me/`,
};