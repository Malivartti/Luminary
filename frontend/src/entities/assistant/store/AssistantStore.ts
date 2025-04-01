import NetworkStore from '@entities/network';
import userStore from '@entities/user';
import axios, { AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { endpoints } from '../api';
import { AssistantApi, AssistantApiReqCreate, AssistantApiReqUpdate } from '../model';

type PrivateFields = '_assistants' | '_assistant'

class AssistantStore {
  private _assistants: AssistantApi[] = [];
  private _assistant: AssistantApi | null = null;
  readonly network = new NetworkStore();

  constructor() {
    makeObservable<AssistantStore, PrivateFields>(this, {
      _assistants: observable,
      _assistant: observable,
    });
  }

  @computed get assistants() {
    return this._assistants;
  }

  @computed get assistant() {
    return this._assistant;
  }

  @action
  setAssistants(assistants: AssistantApi[]) {
    this._assistants = assistants;
  } 

  @action
  setAssistant(assistant: AssistantApi | null) {
    this._assistant = assistant;
  }

  @action
  async getAssistants(): Promise<void> {
    this.network.loading();
    const url = endpoints.get();

    try {
      const res: AxiosResponse<AssistantApi[]> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.setAssistants(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось получить ассистентов');
      });
      console.log(e);
    }
  }


  @action
  async getAssistant(id: string | number): Promise<void> {
    this.network.loading();
    const url = endpoints.getOne(id);

    try {
      const res: AxiosResponse<AssistantApi> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.setAssistant(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось получить ассистентов');
      });
      console.log(e);
    }
  }

  @action
  async createAssistant(data: AssistantApiReqCreate): Promise<void> {
    this.network.loading();
    const url = endpoints.create();

    try {
      const res: AxiosResponse<AssistantApi> = await axios.post(url, data, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.setAssistant(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось создать ассистента');
      });
      console.log(e);
    }
  }

  @action
  async updateAssistant(id : string | number, data: AssistantApiReqUpdate): Promise<void> {
    this.network.loading();
    const url = endpoints.update(id);

    try {
      const res: AxiosResponse<AssistantApi> = await axios.put(url, data, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.setAssistant(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось обновить ассистента');
      });
      console.log(e);
    }
  }

  @action
  async deleteAssistant(id : string | number): Promise<void> {
    this.network.loading();
    const url = endpoints.update(id);

    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось удалить ассистента');
      });
      console.log(e);
    }
  }
}

export default AssistantStore;
