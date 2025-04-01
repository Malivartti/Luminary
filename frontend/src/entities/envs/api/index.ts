import { API_ENTRY_POINT } from '@shared/config/api';

export const endpoints = {
  get: () => `${API_ENTRY_POINT}/api/v1/environments/`,
  getOne: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/`,
  create: () => `${API_ENTRY_POINT}/api/v1/environments/`,
  update: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/`,
  delete: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/`,
};