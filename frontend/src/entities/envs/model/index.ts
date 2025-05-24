export interface EnvApi {
  id: number;
  name: string;
  description: string;
  ai_model: number;
  assistant: number
  created_at: string;
  edited_at: string;
}

export interface EnvModel {
  id: number;
  title: string;
  description: string;
  ai_model: number;
  assistant: number
  createdAt: Date,
  updatedAt: Date;
}

export interface EnvApiReqCreate {
  name: string;
  description: string;
  ai_model: number,
  assistant: number,
}

export interface EnvApiReqUpdate {
  name?: string;
  description?: string;
  ai_model?: number;
  assistant?: number
}

export const normalizeEnv = (raw: EnvApi): EnvModel => ({
  ...raw,
  title: raw.name,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.edited_at),
});

export const normalizeEnvs = (raw: EnvApi[]): EnvModel[] => (
  raw.map(normalizeEnv).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
);
