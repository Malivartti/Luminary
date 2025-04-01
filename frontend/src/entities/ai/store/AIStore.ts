import NetworkStore from '@entities/network';
import userStore from '@entities/user';
import myToast from '@shared/ui/myToast';
import axios, { AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { endpoints } from '../api';
import { AIModelAPI, ContextApi, ContextModel, HistoryApi, normalizeAIModels, normalizeContext, normalizeHistory, PromptApi, PromptApiReq } from '../model';

type PrivateFields = '_context' | '_response' | '_AIModels' | '_history';

class AIStore {
  private _context: ContextModel[] | null = null;
  private _response: string = '';
  private _AIModels: AIModelAPI[] = [];
  private _history: HistoryApi[] = [];
  readonly network = new NetworkStore();
  readonly networkSendPrompt = new NetworkStore();
  readonly networkCommitFiles = new NetworkStore();
  readonly networkClearContext = new NetworkStore();


  constructor() {
    makeObservable<AIStore, PrivateFields>(this, {
      _context: observable,
      _response: observable,
      _AIModels: observable,
      _history: observable,
      context: computed,
      AIModels: computed,
      response: computed,
      history: computed,
      getContext: action,
      generate: action,
      prompt: action,
      getAIModels: action,
      clearContext: action,
      commitFiles: action,
      getHistory: action,
    });
  }

  get context(): ContextModel[] {
    return this._context;
  }

  get response() {
    return this._response;
  }

  get AIModels(): AIModelAPI[] {
    return this._AIModels;
  }

  get history(): HistoryApi[] {
    return this._history;
  }

  async generate(id: string | number, data: PromptApiReq) {
    this.network.loading();
    const url = endpoints.generate(id);

    try {
      const res: AxiosResponse<PromptApi> = await axios.post(url, data, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._response = res.data.response;
        userStore.addRublesUsed(res.data.cost);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось сгенерировать');
      });
      console.log(e);
    }
  }

  async prompt(id: string | number, data: PromptApiReq) {
    this.network.loading();
    this.networkSendPrompt.loading();
    const url = endpoints.prompt(id);

    try {
      const res: AxiosResponse<PromptApi> = await axios.post(url, data, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._response = res.data.response;
        userStore.addRublesUsed(res.data.cost);

        if (res.data.response === 'Баланс исчерпан') {
          myToast('Баланс исчерпан', 'error');
        }
        this.network.success();
        this.networkSendPrompt.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось сгенерировать');
        this.networkSendPrompt.error();
      });
      console.log(e);
    }
  }

  async getContext(id: string | number) {
    this.network.loading();
    const url = endpoints.getContext(id);

    try {
      const res: AxiosResponse<ContextApi[]> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._context = normalizeContext(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось получить контекст');
      });
      console.log(e);
    }
  }

  async getAIModels(): Promise<void> {
    this.network.loading();
    const url = endpoints.getAIModels();

    try {
      const res: AxiosResponse<AIModelAPI[]> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._AIModels = normalizeAIModels(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось получить модели');
      });
      console.log(e);
    }
  }

  async clearContext(id: number | string): Promise<void> {
    this.network.loading();
    this.networkClearContext.loading();
    const url = endpoints.clearContext(id);

    try {
      await axios.delete(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.networkClearContext.success();
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.networkClearContext.error();
        this.network.error('Не удалось очистить историю диалога');
      });
      console.log(e);
    }
  }

  async commitFiles(id: number | string): Promise<void> {
    this.network.loading();
    this.networkCommitFiles.loading();
    const url = endpoints.commitFiles(id);

    try {
      await axios.post(url, {}, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.networkCommitFiles.success();
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.networkCommitFiles.error();
        this.network.error('Не удалось добавить файлы');
      });
      console.log(e);
    }
  }

  async getHistory(): Promise<void> {
    this.network.loading();
    const url = endpoints.history();

    try {
      const res: AxiosResponse<HistoryApi[]> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });

      runInAction(() => {
        this._history = normalizeHistory(res.data);
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось получить историю');
      });
      console.log(e);
    }
  }
}

export default AIStore;
