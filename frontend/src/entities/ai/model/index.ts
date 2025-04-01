type Role = 'user' | 'assistant'

export interface ContextApi {
  role: Role;
  content: string;
  created_at: Date
  model?: string
  cost?: number
}

export interface ContextModel {
  role: Role;
  content: string;
  created_at: Date
  model?: string
  cost?: number
}

export const normalizeContextItem = (raw: ContextApi): ContextModel => {
  const res: ContextModel = {
    role: raw.role,
    content: raw.content,
    created_at: new Date(raw.created_at),
  };
  if ('cost' in raw) {
    res.cost = Number(raw.cost);
  }
  if ('model' in raw) {
    res.model = raw.model;
  }

  return res;
};

export const normalizeContext = (raw: ContextApi[]): ContextModel[] => (
  raw.map(normalizeContextItem)
);

export interface PromptApi {
  response: string;
  model: string;
  cost: number;
  created_at: Date
}

export interface PromptModel {
  response: string;
  cost: number
  created_at: Date
  model: string;
}

export interface PromptApiReq {
  prompt?: string;
}

export const normalizePrompt = (raw: PromptApi): PromptModel => ({
  ...raw,
  cost: Number(raw.cost),
  created_at: new Date(raw.created_at),
});

export interface AIModelAPI {
  id: number;
  name: string;
  description: string;
  context: number;
  input_price: number;
  output_price: number;
}

const normalizeAIModel = (raw: AIModelAPI): AIModelAPI => ({
  ...raw,
  input_price: Number(raw.input_price),
  output_price: Number(raw.output_price),
});

export const normalizeAIModels = (raw: AIModelAPI[]): AIModelAPI[] => (
  raw.map(normalizeAIModel)
);

export interface HistoryApi {
  environment: {
    name: string
  }
  ai_model: {
    name: string
  }
  input_tokens: number
  output_tokens: number
  cost: number
  created_at: Date;
}

const lnormalizeHistory = (raw: HistoryApi): HistoryApi => ({
  ...raw,
  input_tokens: Number(raw.input_tokens),
  output_tokens: Number(raw.output_tokens),
  cost: Number(raw.cost),
  created_at: new Date(raw.created_at),
});

export const normalizeHistory = (raw: HistoryApi[]): HistoryApi[] => (
  raw.map(lnormalizeHistory).sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
);