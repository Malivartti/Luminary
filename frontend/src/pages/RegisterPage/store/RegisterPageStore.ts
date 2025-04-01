import userStore, { UserApiReqRegister } from '@entities/user';
import { onlyLatinLettersAndNumbers } from '@shared/lib/validate';
import { action, computed, makeObservable, observable } from 'mobx';

type PrivateField = '_username' | '_usernameError' | '_password' 
                  | '_passwordError' | '_passwordRepeat' | '_passwordRepeatError'

class RegisterPageStore {
  private _username: string = '';
  private _usernameError: string = '';
  private _password: string = '';
  private _passwordError: string = '';
  private _passwordRepeat: string = '';
  private _passwordRepeatError: string = '';

  constructor() {
    makeObservable<RegisterPageStore, PrivateField>(this, {
      _username: observable,
      _usernameError: observable,
      _password: observable,
      _passwordError: observable,
      _passwordRepeat: observable,
      _passwordRepeatError: observable,
      username: computed,
      usernameError: computed,
      password: computed,
      passwordError: computed,
      passwordRepeat: computed,
      passwordRepeatError: computed,
      setUsername: action.bound,
      setPassword: action.bound,
      setPasswordRepeat: action.bound,
      validateName: action,
      validatePassword: action,
      validatePasswordRepeat: action,
      isValid: action,
      register: action,
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

  get passwordRepeat(): string {
    return this._passwordRepeat;
  }

  get passwordRepeatError(): string {
    return this._passwordRepeatError;
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

  setPasswordRepeat(passwordRepeat: string): void {
    if (this._passwordRepeatError) {
      this._passwordRepeatError = '';
    }
    this._passwordRepeat = passwordRepeat;
  }

  validateName(): boolean {
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

  validatePasswordRepeat(): boolean {
    if (!this._passwordRepeat.trim()) {
      this._passwordRepeatError = 'Введите пароль повторно';
      return;
    }
    if (this._passwordRepeat !== this._password) {
      this._passwordRepeatError = 'Пароли не совпадают';
      return;
    }
    return true;
  }

  isValid(): boolean {
    const isNameValide = this.validateName();
    const isPasswordValid = this.validatePassword();
    const isPasswordRepeatValid = this.validatePasswordRepeat();

    return isNameValide && isPasswordValid && isPasswordRepeatValid;
  }

  async register(): Promise<void> {
    if (!this.isValid()) return;

    const data: UserApiReqRegister = {
      username: this._username,
      password: this._password,
      confirm_password: this._passwordRepeat,
    };

    await userStore.registerUser(data);
  }
}

export default RegisterPageStore;
