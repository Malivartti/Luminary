export type AuthUserApi = {
  token: string;
  user: UserApi
}

export type UserApi = {
  id: number; 
  username: string; 
  rubles_used: number;
  role: UserRoleApi;
}

export type UserRoleApi = {
  name: Role
  rubles_limit: number
}

export enum Role {
  DEMO = 'Demo',
  GUEST = 'Guest',
};


export type UserApiReqRegister = {
  username: string;
  password: string;
  confirm_password: string;
}

export type UserApiReqUpdate = {
  username?: string;
  password?: string;
}

export type UserApiReqLogin = {
  username: string;
  password: string;
}

export const normalizeUser = (raw: UserApi): UserApi => ({
  ...raw,
  rubles_used: Number(raw.rubles_used),
});