import { action, computed, makeObservable, observable } from 'mobx';

type PrivateFields = '_isOpenModal'

class AssistantsPageStore {
  private _isOpenModal: boolean = false;

  constructor() {
    makeObservable<AssistantsPageStore, PrivateFields>(this, {
      _isOpenModal: observable,
    });
  }

  @computed get isOpenModal() {
    return this._isOpenModal;
  }

  @action.bound
  setIsOpenModal(isOpenModal: boolean) {
    this._isOpenModal = isOpenModal;
  }

  @action.bound
  openModal(): void {
    this.setIsOpenModal(true);
  }
}

export default AssistantsPageStore;