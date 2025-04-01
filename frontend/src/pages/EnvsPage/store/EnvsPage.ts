import envsStore from '@entities/envs';
import { EnvApiReqCreate, EnvModel } from '@entities/envs/model';
import { action, computed, makeObservable, observable } from 'mobx';

type PrivateFields = '_envId' | '_title' | '_titleError' | '_description' | '_modalType' | '_isOpenModal' | '_assistantId' | '_AIModelId'
type TModalType = 'create' | 'update' | 'delete';

class EnvsPageStore {
  private _envId: number | null = null;
  private _title: string = '';
  private _titleError: string = '';
  private _description: string = '';
  private _assistantId: number | null = null;
  private _AIModelId: number | null = null;
  private _modalType: TModalType = 'create';
  private _isOpenModal: boolean = false;

  constructor() {
    makeObservable<EnvsPageStore, PrivateFields>(this, {
      _envId: observable,
      _title: observable,
      _titleError: observable,
      _description: observable,
      _assistantId: observable,
      _AIModelId: observable,
      _modalType: observable,
      _isOpenModal: observable,
      envId: computed,
      title: computed,
      titleError: computed,
      description: computed,
      assistantId: computed,
      AIModelId: computed,
      modalType: computed,
      isOpenModal: computed,
      setEnv: action,
      setEnvId: action,
      setTitle: action.bound,
      setDescription: action.bound,
      setAssistantId: action,
      setAIModelId: action,
      setModalType: action.bound,
      setIsOpenModal: action.bound,
      openModal: action,
      validateTitle: action,
      validate: action,
      saveEnv: action,
      deleteEnv: action,
    });
  }

  get envId(): number | null {
    return this._envId;
  }

  get title(): string {
    return this._title;
  }

  get titleError(): string {
    return this._titleError;
  }

  get description(): string {
    return this._description;
  }

  get assistantId(): number | null {
    return this._assistantId;
  }

  get AIModelId(): number | null {
    return this._AIModelId;
  }

  get modalType(): TModalType {
    return this._modalType;
  }

  get isOpenModal(): boolean {
    return this._isOpenModal;
  }

  setEnv(env: Omit<EnvModel, 'created_at' | 'edited_at'>): void {
    this._envId = env.id;
    this._title = env.title;
    this._description = env.description;
    this._AIModelId = env.ai_model;
    this._assistantId = env.assistant;
  }

  setEnvId(envId: number) {
    this._envId = envId;
  }

  setTitle(title: string): void {
    if (this._titleError) {
      this._titleError = '';
    }
    this._title = title;
  }

  setDescription(description: string): void {
    this._description = description;
  }

  setAssistantId(assistantId: number | null): void {
    this._assistantId = assistantId;
  }

  setAIModelId(AIModelId: number | null): void {
    this._AIModelId = AIModelId;
  }

  setModalType(modalType: TModalType): void {
    this._modalType = modalType;
  }

  setIsOpenModal(isOpenModal: boolean): void {
    this._isOpenModal = isOpenModal;
  }

  openModal(type: TModalType = 'create') {
    if (type === 'create') {
      this._title = '';
      this._description = '';
      this._AIModelId = null;
      this._assistantId = null;
      this._modalType = 'create';
    } else if (type === 'update') {
      this._modalType = 'update';
    } else if (type === 'delete') {
      this._modalType = 'delete';
    }
    this._isOpenModal = true;
  }

  validateTitle(): boolean {
    if (!this._title.trim()) {
      this._titleError = 'Введите заголовок';
      return;
    }
    return true;
  }

  validate(): boolean {
    const isValidTitle = this.validateTitle();

    return isValidTitle;
  }

  async saveEnv(): Promise<void> {
    if (!this.validate()) return;

    const data: EnvApiReqCreate = {
      name: this._title,
      description: this._description,
      ai_model: this._AIModelId,
      assistant: this._assistantId,
    };

    if (this._modalType === 'create') {
      await envsStore.createEnv(data);
    } else {
      await envsStore.updateEnv(this._envId, data);
    }

    if (envsStore.network.isError) return;
    this.setIsOpenModal(false);
  }

  async deleteEnv(): Promise<void> {
    await envsStore.deleteEnv(this._envId);
    if (envsStore.network.isError) return;
    this.setIsOpenModal(false);
  }
}

export default EnvsPageStore;