import userStore, { UserApiReqLogin } from '@entities/user';
import { onlyLatinLettersAndNumbers } from '@shared/lib/validate';
import { action, computed, makeObservable, observable } from 'mobx';

type PrivateField = '_username' | '_usernameError' | '_password' | '_passwordError'

class LoginPageStore {
  private _username: string = '';
  private _usernameError: string = '';
  private _password: string = '';
  private _passwordError: string = '';

  constructor() {
    makeObservable<LoginPageStore, PrivateField>(this, {
      _username: observable,
      _usernameError: observable,
      _password: observable,
      _passwordError: observable,
      username: computed,
      usernameError: computed,
      password: computed,
      passwordError: computed,
      setUsername: action.bound,
      setPassword: action.bound,
      validateUsername: action,
      validatePassword: action,
      isValid: action,
      login: action,
    });
  }

  get username(): string {
    return this._username;
  }

  get usernameError(): string {
    return this._usernameError;
  }

  get password(): string {
    return this._password;
  }

  get passwordError(): string {
    return this._passwordError;
  }

  setUsername(username: string): void {
    if (this._usernameError) {
      this._usernameError = '';
    }
    this._username = username;
  }

  setPassword(password: string): void {
    if (this._passwordError) {
      this._passwordError = '';
    }
    this._password = password;
  }

  validateUsername(): boolean {
    if (!this._username.trim()) {
      this._usernameError = 'Введите имя';
      return;
    }
    return true;
  }

  validatePassword(): boolean {
    if (!this._password.trim()) {
      this._passwordError = 'Введите пароль';
      return;
    }
    if (!onlyLatinLettersAndNumbers(this._password.trim())) {
      this._passwordError = 'Пароль должен состоять только из латинских букв и цифр';
      return;
    }
    if (this._password.trim().length < 4) {
      this._passwordError = 'Пароль должен иметь минимум 4 символа';
      return;
    }
    return true;
  }

  isValid(): boolean {
    const isUsernameValid = this.validateUsername();
    const isPasswordValid = this.validatePassword();

    return isUsernameValid && isPasswordValid;
  } 

  async login(): Promise<void> {
    if (!this.isValid()) return;

    const data: UserApiReqLogin = {
      username: this._username,
      password: this._password,
    };

    await userStore.loginUser(data);
  }
}

export default LoginPageStore;
