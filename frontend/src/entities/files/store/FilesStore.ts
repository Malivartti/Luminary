import NetworkStore from '@entities/network';
import userStore from '@entities/user';
import axios, { AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { endpoints } from '../api';
import { FileApi, FileApiReqLoad, FileApiReqUpdate, FileModel, MetaFileApi, MetaFileModel, normalizeFiles } from '../model';

type PrivateFields = '_files' | '_file'

class FilesStore {
  private _files: MetaFileModel[] | null = null;
  private _file: FileModel | null = null;
  readonly network = new NetworkStore();

  constructor() {
    makeObservable<FilesStore, PrivateFields>(this, {
      _files: observable,
      _file: observable,
      files: computed,
      file: computed,
      getFiles: action,
      getFile: action,
      loadFile: action,
      updateFile: action,
      deleteFile: action,
    });
  }

  get files(): MetaFileModel[] {
    return this._files;
  }

  get file(): FileModel {
    return this._file;
  }

  async getFiles(id: string | number) {
    this.network.loading();
    const url = endpoints.get(id);

    try {
      const res: AxiosResponse<MetaFileApi[]> = await axios.get(url, {
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._files = normalizeFiles(res.data);
        this.network.success();
      });
    } catch(e) {
      runInAction(() => {
        this.network.error('Не удалось получить файлы');
      });
      console.log(e);
    }
  }

  async getFile(id: string | number, filename: string) {
    this.network.loading();
    const url = endpoints.getOne(id);

    try {
      const res: AxiosResponse<FileApi> = await axios.get(url, {
        params: {
          filename,
        },
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this._file = res.data;
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось загрузить файл');
      });
      console.log(e);
    }
  }

  async loadFile(id: string | number, data: FileApiReqLoad, network: NetworkStore) {
    network.loading();
    const url = endpoints.load(id);
    
    try {
      await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        network.success();
      });
    } catch (e) {
      runInAction(() => {
        network.error('Не удалось выгрузить файл');
      });
      console.log(e);
    }
  }

  async deleteFile(id: string | number, filename: string) {
    const url = endpoints.delete(id);

    try {
      await axios.delete(url, {
        params: {
          filename,
        },
        headers: {
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось удалить файл');
      });
      console.log(e);
    }
  }

  async updateFile(id: number | string, data: FileApiReqUpdate): Promise<void> {
    this.network.loading();
    const url = endpoints.update(id);

    try {
      await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${userStore.token}`,
        },
      });
      runInAction(() => {
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось сохранить файл');
      });
      console.log(e);
    }
  }
}

export default FilesStore;
