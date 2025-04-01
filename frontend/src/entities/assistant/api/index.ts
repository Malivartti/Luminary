import { API_ENTRY_POINT } from '@shared/config/api';

export const endpoints = {
  get: () => `${API_ENTRY_POINT}/api/v1/assistants/`,
  getOne: (id: string | number) => `${API_ENTRY_POINT}/api/v1/assistants/${id}/`,
  create: () => `${API_ENTRY_POINT}/api/v1/assistants/`,
  update: (id: string | number) => `${API_ENTRY_POINT}/api/v1/assistants/${id}/`,
  delete: (id: string | number) => `${API_ENTRY_POINT}/api/v1/assistants/${id}/`,
};