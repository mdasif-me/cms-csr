export interface ILoginUserInput {
  email: string;
  password: string;
}

export interface ITokenData {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface IUserData {
  banner_url?: string;
  created_at: string;
  deleted_at?: string;
  email: string;
  full_name: string;
  location?: string;
  logo_url?: string;
  phone_number?: string;
  reminder_by?: string;
  role: string;
  status: string;
  tokens: ITokenData;
  uid: string;
  updated_at: string;
  website_url?: string;
  whatsapp_number?: string;
}

export interface IUserLoginEdge {
  data: IUserData;
  node: string;
}

export interface IUserLoginResponse {
  userLogin: {
    edge: IUserLoginEdge;
  };
}

export interface IUserLoginVariables {
  input: ILoginUserInput;
}
