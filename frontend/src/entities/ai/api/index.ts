import { API_ENTRY_POINT } from '@shared/config/api';

export const endpoints = {
  generate: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/generate/`,
  prompt: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/send-prompt/`,
  clearContext: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/clear-context/`,
  getContext: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/get-context/`,
  getAIModels: () => `${API_ENTRY_POINT}/api/v1/ai-models/`,
  commitFiles: (id: string | number) => `${API_ENTRY_POINT}/api/v1/environments/${id}/commit-files/`,
  history: () => `${API_ENTRY_POINT}/api/v1/history/`,
};
