export interface AssistantApi {
  id: number
  name: string
  description: string
  context: string
}

export interface AssistantApiReqCreate {
  name: string
  description: string
  context: string
}

export interface AssistantApiReqUpdate {
  name?: string
  description?: string
  context?: string
}