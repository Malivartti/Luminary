import NetworkStore from '../store';

export enum Meta {
  initial = 'initial',
  loading = 'loading',
  error = 'error',
  success = 'success',
}

export type NFile = {
  name: string;
  size: number;
  content?: string;
  network?: NetworkStore;
}