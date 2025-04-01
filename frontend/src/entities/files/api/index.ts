import { API_ENTRY_POINT } from '@shared/config/api';


export const endpoints = {
  get: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/list-files/`,
  getOne: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/read-file/`,
  load: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/load-file/`,
  update: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/update-file/`,
  delete: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/remove-file/`,
};
