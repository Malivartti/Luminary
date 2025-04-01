export interface FileApi {
  filename: string
  size: number
  updatedAt: number
}

export interface MetaFileApi {
  filename: string;
  size: number;
  updatedAt: number;
}

export interface FileModel {
  filename: string
  file?: string
}

export interface MetaFileModel {
  name: string;
  size: number;
  updatedAt: number;
}

export interface FileApiReq {
  filename: string
}

export interface FileApiReqLoad {
  file: File
}

export interface FileApiReqUpdate {
  file: File
}

export const normalizeMetaFile = (raw: MetaFileApi): MetaFileModel => ({
  name: raw.filename,
  ...raw,
});

export const normalizeFiles = (raw: MetaFileApi[]): MetaFileModel[] => (
  raw.map(normalizeMetaFile)
);
