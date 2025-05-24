import aiStore from '@entities/ai';
import envsStore from '@entities/envs';
import filesStore from '@entities/files';
import NetworkStore from '@entities/network';
import { NFile } from '@entities/network/model';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { Range } from 'react-quill';

type PrivateFields = '_envId' | '_envTitle' | '_sheet' | '_prompt' | '_envAIModel'
                    | '_selectedFile' | '_selectedTextRange' | '_selectedText' | '_isShowEditor'
                    | '_files' | '_isShowFiles' | '_isShowChat' | '_isShowTooltip' | '_isOpenFile'
                    | '_enableTooltip' | '_tooltipResponse' | '_isMobile';

class EnvPageStore {
  private _envId: string | null = null;
  private _envTitle: string = '';
  private _envAIModel: number | null = null;
  private _sheet: string = '';
  private _prompt: string = '';
  private _selectedFile: string = '';
  private _files: NFile[] = [];
  private _isShowFiles: boolean = true;
  private _isShowChat: boolean = false;
  private _isShowTooltip: boolean = false;
  private _isShowEditor: boolean = false;
  private _isOpenFile: boolean = false;
  private _selectedText: string = '';
  private _selectedTextRange: Range = null;
  private _enableTooltip: boolean = true;
  private _tooltipResponse: string = '';
  private _isMobile: boolean = false;

  constructor() {
    makeObservable<EnvPageStore, PrivateFields>(this, {
      _envId: observable,
      _envTitle: observable,
      _envAIModel: observable,
      _sheet: observable,
      _enableTooltip: observable,
      _tooltipResponse: observable,
      _prompt: observable,
      _selectedTextRange: observable,
      _selectedFile: observable,
      _selectedText: observable,
      _files: observable,
      _isShowFiles: observable,
      _isShowChat: observable,
      _isShowTooltip: observable,
      _isShowEditor: observable,
      _isOpenFile: observable,
      _isMobile: observable,

      isOpenFile: computed,
      envId: computed,
      envAIModel: computed,
      selectedTextRange: computed,
      tooltipResponse: computed,
      envTitle: computed,
      sheet: computed,
      selectedText: computed,
      prompt: computed,
      selectedFile: computed,
      files: computed,
      isShowFiles: computed,
      isShowChat: computed,
      isShowEditor: computed,
      isActiveTab: computed,
      isShowTooltip: computed,
      isMobile: computed,

      setIsOpenFile: action,
      setSelectedTextRange: action,
      setTooltipResponse: action,
      createFile: action,
      setSelectedText: action,
      setEnvId: action,
      setEnvTitle: action,
      toggleEnableTooltip: action.bound,
      setSheet: action.bound,
      setPrompt: action.bound,
      setSelectedFile: action,
      setEnableTooltip: action,
      addLocalFile: action,
      deleteLocalFile: action,
      closeTabs: action,
      defaultEnv: action,
      setIsShowFiles: action,
      setIsShowChat: action,
      setIsShowTooltip: action,
      setIsShowEditor: action,
      sendPrompt: action,
      sendPromptInChat: action,
      loadFile: action,
      readFile: action,
      deleteFile: action,
      getFiles: action,
      generate: action,
      getEnv: action,
      sendTooltipPromt: action,
      setIsMobile: action,
      ensureMobileTabOpen: action,
      editEnvAIModel: action,
    });
  }

  get isMobile(): boolean {
    return this._isMobile;
  }

  get isOpenFile(): boolean {
    return this._isOpenFile;
  }

  get tooltipResponse(): string {
    return this._tooltipResponse;
  }

  get envId(): string {
    return this._envId;
  }

  get envAIModel(): number | null {
    return this._envAIModel;
  }

  get selectedText(): string {
    return this._selectedText;
  }

  get selectedTextRange(): Range {
    return this._selectedTextRange;
  }

  get envTitle(): string {
    return this._envTitle;
  }

  get enableTooltip(): boolean {
    return this._enableTooltip;
  }

  get sheet(): string {
    return this._sheet;
  }

  get prompt(): string {
    return this._prompt;
  }

  get selectedFile(): string {
    return this._selectedFile;
  }

  get files(): NFile[] {
    return this._files;
  }

  get isShowFiles(): boolean {
    return this._isShowFiles;
  }

  get isShowChat(): boolean {
    return this._isShowChat;
  }

  get isShowTooltip(): boolean {
    return this._isShowTooltip && this.enableTooltip;
  }

  get isShowEditor(): boolean {
    return this._isShowEditor;
  }

  get isActiveTab(): boolean {
    return this._isShowFiles || this._isShowChat || this._isShowEditor;
  }

  setSelectedText(text: string): void {
    this._selectedText = text;
  }

  setIsOpenFile(isOpenFile: boolean): void {
    this._isOpenFile = isOpenFile;
  }

  setTooltipResponse(response: string): void {
    this._tooltipResponse = response;
  }

  setEnvId(envId: string): void {
    this._envId = envId;
  }

  toggleEnableTooltip(): void {
    this._enableTooltip = !this._enableTooltip;
    if (this._isShowTooltip) {
      this._isShowTooltip = false;
    }
  }

  setEnvTitle(envTitle: string): void {
    this._envTitle = envTitle;
  }

  setSheet(sheet: string): void {
    this._sheet = sheet;
  }

  setEnableTooltip(isEnable: boolean): void {
    this._enableTooltip = isEnable;
  }

  defaultEnv(): void {
    this._selectedFile = '';
    this._isOpenFile = false;
    this._sheet = '';
    this._tooltipResponse = '';
    this._isShowTooltip = false;
    this._isShowChat = false;
    this._isShowEditor = false;
    this._isShowFiles = true;
  }

  setPrompt(prompt: string): void {
    this._prompt = prompt;
  }

  setSelectedTextRange(selectedTextRange: Range): void {
    this._selectedTextRange = selectedTextRange;
  }

  setIsShowTooltip(isShowTooltip: boolean): void {
    this._isShowTooltip = isShowTooltip;
  }

  addLocalFile(file: NFile): void {
    if (this._files.find(f => f.name === file.name)) return;
    this._files = [...this._files, file];
  }

  deleteLocalFile(name: string): void {
    this._files = this._files.filter(item => item.name !== name);
  }

  closeTabs() {
    this._isShowChat = false;
    this._isShowFiles = false;
    this._isShowEditor = false;
  }

  setIsShowFiles(isShowFiles: boolean): void {
    if (this._isMobile) {
      if (isShowFiles) {
        this.closeTabs();
        this._isShowFiles = true;
      }
      return;
    }
    
    if (isShowFiles === this._isShowFiles) {
      this._isShowFiles = false;
      return;
    }
    this.closeTabs();
    this._isShowFiles = isShowFiles;
  }

  setIsShowChat(isShowChat: boolean): void {
    if (this._isMobile) {
      if (isShowChat) {
        this.closeTabs();
        this._isShowChat = true;
      }
      return;
    }
    
    if (isShowChat === this._isShowChat) {
      this._isShowChat = false;
      return;
    }
    this.closeTabs();
    this._isShowChat = isShowChat;
  }

  setIsShowEditor(isShowEditor: boolean): void {
    if (this._isMobile) {
      if (isShowEditor && this._selectedFile) {
        this.closeTabs();
        this._isShowEditor = true;
      } else if (!isShowEditor) {
        this._isShowEditor = false;
      }
      return;
    }
  
    if (isShowEditor === this._isShowEditor) {
      this._isShowEditor = false;
      return;
    }
    this._isShowEditor = isShowEditor;
  }

  setSelectedFile(selectedFile: string): void {
    this._selectedFile = selectedFile;
    
    if (this._isMobile && selectedFile) {
      this.setIsShowEditor(true);
    }
  }


  setIsMobile(isMobile: boolean): void {
    this._isMobile = isMobile;
    if (isMobile) {
      this.ensureMobileTabOpen();
    }
  }

  ensureMobileTabOpen(): void {
    if (!this._isMobile) return;
    
    if (!this._isShowFiles && !this._isShowChat && !this._isShowEditor) {
      this._isShowFiles = true;
    }
  }

  async createFile(filename: string): Promise<void> {
    const blob = new Blob([''], { type: 'text/plain' });
    const file = new File([blob], filename, {
      type: 'text/plain',
      lastModified: Date.now(),
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const fileList = dataTransfer.files;
    
    await this.loadFile(fileList);
  }

  async saveFile(): Promise<void> {
    if (!this.selectedFile) {
      const filename = 'Новый файл ' + Date.now() + '.md';
      await this.createFile(filename);
      this._selectedFile = filename;

    }

    const blob = new Blob([this._sheet], { type: 'text/plain' });
    const file = new File([blob], this.selectedFile, {
      type: 'text/plain',
      lastModified: Date.now(),
    });

    this._files.find(f => f.name === this.selectedFile).content = this._sheet;
    await filesStore.updateFile(this._envId, { file });
  }

  async sendPrompt(): Promise<void> {
    await aiStore.prompt(this._envId, {
      prompt: this._prompt,
    });
  }

  async sendTooltipPromt(prompt: string): Promise<void> {
    this._tooltipResponse = '';
    
    await aiStore.prompt(this._envId, {
      prompt,
    });
    if (aiStore.networkSendPrompt.isError) return;
    this._tooltipResponse = aiStore.response;
  }

  async sendPromptInChat(): Promise<void> {
    await this.sendPrompt();
    if (aiStore.network.isError) return;
    this.setPrompt('');
    await aiStore.getContext(this._envId);
  }

  async loadFile(files: FileList): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      const network = new NetworkStore();

      const localFile = {
        name: files[i].name,
        size: files[i].size,
        content: '',
        network,
      };

      filesStore.loadFile(this._envId, { file: files[i] }, network);
      
      const fileContent = await new Promise<string | ArrayBuffer | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result || null);
        reader.onerror = () => resolve(null);
        reader.readAsText(files[i]);
      });

      localFile.content = fileContent as string || '';

      this.addLocalFile(localFile);
    };
  }

  async readFile(filename: string): Promise<void> {
    const localFile = this._files.find(file => file.name === filename);
    if (!localFile?.content) {
      await filesStore.getFile(this._envId, filename);
      if (filesStore.network.isError) return;
      runInAction(() => {
        localFile.content = filesStore.file.file;
        this._sheet = filesStore.file.file;
        this._isOpenFile = true;
      });
    } else {
      runInAction(() => {
        this._sheet = localFile.content;
        this._isOpenFile = true;
      });
    }
  }

  async deleteFile(filename: string): Promise<void> {
    await filesStore.deleteFile(this._envId, filename);
    if (filesStore.network.isError) return;
    this.deleteLocalFile(filename);
    if (filename === this.selectedFile) {
      this._sheet = '';
    }
  }

  async getFiles(): Promise<void> {
    this._files = [];
    await filesStore.getFiles(this._envId);
    if (filesStore.network.isError) return;
    filesStore.files.forEach(metaFile => {
      const network = new NetworkStore();
      this.addLocalFile({
        name: metaFile.name,
        size: metaFile.size,
        network,
      });
    });
  }

  async generate(): Promise<void> {
    aiStore.generate(this._envId, { prompt: '' });
  }

  async getEnv(): Promise<void> {
    await envsStore.getEnv(this._envId);
    if (envsStore.network.isError) return;
    this._envTitle = envsStore.env.title;
    this._envAIModel = envsStore.env.ai_model;
  }

  async editEnvAIModel(aiModel: number): Promise<void> {
    await envsStore.updateEnv(this._envId, {
      name: envsStore.env.title,
      assistant: envsStore.env.assistant,
      ai_model: aiModel,
    });
    if (envsStore.network.isError) return;
    runInAction(() => {
      this._envAIModel = aiModel;
    });
  }
}

export default EnvPageStore;
