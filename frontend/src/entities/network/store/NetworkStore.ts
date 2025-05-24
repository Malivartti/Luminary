import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { Meta } from '../model';

type PrivateFields = '_meta' | '_message';

class NetworkStore {
  private _meta: Meta = Meta.initial;
  private _message: string = '';

  constructor() {
    makeObservable<NetworkStore, PrivateFields>(this, {
      _meta: observable,
      _message: observable,
      isLoading: computed,
      isSuccess: computed,
      isError: computed,
      message: computed,
      loading: action,
      success: action,
      error: action,
      clear: action,
    });
  }

  get isLoading(): boolean {
    return this._meta === Meta.loading;
  }

  get isSuccess(): boolean {
    return this._meta === Meta.success;
  }

  get isError(): boolean {
    return this._meta === Meta.error;
  }

  get message(): string {
    return this._message;
  }

  loading(): void {
    this._message = '';
    this._meta = Meta.loading;
  }

  success(message: string = ''): void {
    runInAction(() => {
      this._message = message;
      this._meta = Meta.success;
    });
    setTimeout(() => this.clear());
  }

  error(message: string = ''): void {
    runInAction(() => {
      this._message = message;
      this._meta = Meta.error;
    });
    setTimeout(() => this.clear());
  }

  clear(): void {
    this._meta = Meta.initial;
    this._message = '';
  }
}

export default NetworkStore;
