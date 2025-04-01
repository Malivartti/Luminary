import NetworkStore from '@entities/network';
import userStore from '@entities/user';
import axios, { AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { endpoints } from '../api';
import { EnvApi, EnvApiReqCreate, EnvApiReqUpdate, EnvModel, normalizeEnv, normalizeEnvs } from '../model';

type PrivateFields = '_envs' | '_env';

class EnvsStore {
  private _env: EnvModel | null = null;
  private _envs: EnvModel[] | null = [];
  readonly network = new NetworkStore();

  constructor() {
    makeObservable<EnvsStore, PrivateFields>(this, {
      _envs: observable,
      _env: observable,
      envs: computed,
      env: computed,
      getEnvs: action,
      getEnv: action,
      createEnv: action,
      updateEnv: action,
      deleteEnv: action,
    });
  }

  get envs(): EnvModel[] {
    return this._envs;
  }

  get env(): EnvModel {
    return this._env;
  }

  async getEnv(id: string | number) {
    this.network.loading();
    this._env = null;
    const url = endpoints.getOne(id);

    try {
      const res: AxiosResponse<EnvApi> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._env = normalizeEnv(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось получить окружение');
      });
      console.log(e);
    }
  }

  async getEnvs() {
    this.network.loading();
    this._envs = null;
    const url = endpoints.get();
    
    try {
      const res: AxiosResponse<EnvApi[]> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._envs = normalizeEnvs(res.data);
        console.log(res.data)
        this.network.success();
      });
    } catch(e) {
      runInAction(() => {
        this.network.error('Не удалось получить окружения');
      });
      console.log(e);
    }
  }

  async createEnv(data: EnvApiReqCreate) {
    this.network.loading();
    this._env = null;
    const url = endpoints.create();
    try {
      await axios.post(url, data, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      this.network.success('Окружение создано');
    } catch(e) {
      runInAction(() => {
        this.network.error('Не удалось создать окружение');
      });
      console.log(e);
    }
  }

  async updateEnv(id: string | number, data: EnvApiReqUpdate) {
    this.network.loading();
    this._env = null;
    const url = endpoints.update(id);

    try {
      await axios.put(url, data, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      this.network.success('Окружение успешно изменено');
    } catch(e) {
      runInAction(() => {
        this.network.error('Не удалось обновить окружение');
      });
      console.log(e);
    }
  }

  async deleteEnv(id: string | number) {
    this.network.loading();
    this._env = null;
    const url = endpoints.delete(id);

    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.network.success('Окружение успешно удалено');
      });
    } catch(e) {
      runInAction(() => {
        this.network.error('Не удалось удалить окружение');
      });
      console.log(e);
    }
  }
}

export default EnvsStore;
