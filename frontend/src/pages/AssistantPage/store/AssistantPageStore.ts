import assistantStore from '@entities/assistant';
import { AssistantApi } from '@entities/assistant/model';
import { action, computed, makeObservable, observable } from 'mobx';

type PrivateFields = '_assistantId' | '_assistant' | '_isEditing'

class AssistantPageStore {
  private _assistantId: string | number | null = null;
  private _assistant: AssistantApi = {
    id: -1,
    name: '',
    description: '',
    context: '',
  };
  private _isEditing: boolean = false;

  constructor() {
    makeObservable<AssistantPageStore, PrivateFields>(this, {
      _assistantId: observable,
      _assistant: observable,
      _isEditing: observable,
    });
  }

  @computed get assistantId(): string | number | null {
    return this._assistantId;
  }

  @computed get name(): string {
    return this._assistant?.name;
  }

  @computed get description(): string {
    return this._assistant?.description;
  }

  @computed get context(): string {
    return this._assistant?.context;
  }

  @computed get isEditing(): boolean {
    return this._isEditing;
  }

  @action
  setAssistantId(assistantId: string | null): void {
    this._assistantId = assistantId;
  }

  @action
  setName(name: string): void {
    this._assistant.name = name;
  }

  @action
  setDescription(description: string): void {
    this._assistant.description = description;
  }

  @action
  setContext(context: string): void {
    this._assistant.context = context;
  }

  @action setIsEditing(isEditing: boolean): void {
    this._isEditing = isEditing;
  }

  @action
  assistantClear(): void {
    this._assistant = {
      id: -1,
      name: '',
      description: '',
      context: '',
    };
  }

  @action
  async getAssistant(): Promise<void> {
    await assistantStore.getAssistant(this._assistantId);
    if (assistantStore.network.isError) return;
    this._assistant = assistantStore.assistant;
  }

  @action
  async createOrUpdateAssistant(): Promise<void> {
    if (this._assistantId == 'new') {
      await assistantStore.createAssistant(this._assistant);
      if (assistantStore.network.isError) return;
      this._assistantId = assistantStore.assistant.id;
    } else {
      await assistantStore.updateAssistant(this._assistantId, this._assistant);
    }
  }
}

export default AssistantPageStore;