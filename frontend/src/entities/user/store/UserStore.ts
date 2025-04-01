import NetworkStore from '@entities/network';
import axios, { AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import { endpoints } from '../api';
import { AuthUserApi, normalizeUser, UserApi,UserApiReqLogin, UserApiReqRegister, UserApiReqUpdate } from '../model';

type PrivateFields = '_token' | '_user' ;

class UserStore {
  private _token: string = '';
  private _user: UserApi | null = null;
  readonly network = new NetworkStore();

  constructor() {
    makeObservable<UserStore, PrivateFields>(this, {
      _token: observable,
      _user: observable,
      token: computed,
      user: computed,
      isLogin: computed,
      setToken: action,
      setUser: action,
      addRublesUsed: action,
      getUser: action,
      registerUser: action,
      updateUser: action,
      loginUser: action,
      logoutUser: action,
    });

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      this.setToken(storedToken);
      this.setUser(normalizeUser(JSON.parse(storedUser)));
    }
  }

  get user(): UserApi | null {
    return this._user;
  }

  get token(): string {
    return this._token;
  }

  get isLogin(): boolean {
    return this._user !== null;
  }

  setToken(token: string | null): void {
    this._token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  setUser(user: UserApi | null) {
    this._user = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  addRublesUsed(rubles: number): void {
    this._user.rubles_used += rubles;
  }


  async getUser(): Promise<void> {
    this.network.loading();
    const url = endpoints.user();

    try {
      const res: AxiosResponse<UserApi> = await axios.get(url, {
        headers: {
          Authorization: `Token ${this._token}`,
        },
      });
      runInAction(() => {
        this.setUser(normalizeUser(res.data));
        this.network.success();
      });
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this.network.error();
      });
    }
  }

  async registerUser(data: UserApiReqRegister): Promise<void> {
    this.network.loading();
    const url = endpoints.register();
    try {
      const res: AxiosResponse<AuthUserApi> = await axios.post(url, data);
      runInAction(() => {
        this.setToken(res.data.token);
        this.setUser(normalizeUser(res.data.user));
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось зарегестрироваться');
      });
      console.log(e);
    }
  }

  async updateUser(data: UserApiReqUpdate): Promise<void> {

  }

  async loginUser(data: UserApiReqLogin): Promise<void> {
    this.network.loading();
    const url = endpoints.auth();
    try {
      const res: AxiosResponse<AuthUserApi> = await axios.post(url, data);
      runInAction(() => {
        this.setToken(res.data.token);
        this.setUser(normalizeUser(res.data.user));
        this.network.success();
      });
    } catch (e) {
      runInAction(() => {
        this.network.error('Не удалось войти');
      });
      console.log(e);
    }
  }

  async logoutUser(): Promise<void> {
    this.setToken(null);
    this.setUser(null);
  }
}

export default UserStore;
