// ============================================
// Login Types
// ============================================
export interface ILoginUserInput {
  email: string;
  password: string;
  remember_me?: boolean;
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
  tokens?: ITokenData;
  uid: string;
  updated_at: string;
  website_url?: string;
  whatsapp_number?: string;
}

export interface IUserLoginEdge {
  data: IUserData & { tokens: ITokenData };
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

// ============================================
// Registration Types
// ============================================
export interface IRegisterUserInput {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  whatsAppNumber?: string;
  websiteUrl?: string;
  location?: string;
  logoUrl?: string;
  bannerUrl?: string;
  role?: string;
  reminderBy?: string;
}

export interface IUserRegistrationEdge {
  data: IUserData;
  node: string;
}

export interface IUserRegistrationResponse {
  userRegistration: {
    edge: IUserRegistrationEdge;
  };
}

export interface IUserRegistrationVariables {
  input: IRegisterUserInput;
}

// ============================================
// Refresh Token Types
// ============================================
export interface IRefreshTokenInput {
  refreshToken: string;
}

export interface IRefreshTokenEdge {
  data: ITokenData;
  node: string;
}

export interface IRefreshTokenResponse {
  refreshToken: {
    edge: IRefreshTokenEdge;
  };
}

export interface IRefreshTokenVariables {
  input: IRefreshTokenInput;
}

// ============================================
// Forgot Password Types
// ============================================
export interface IForgotPasswordInput {
  email: string;
  reminderMethod?: string;
}

export interface IForgotPasswordEdge {
  data: IUserData;
  node: string;
}

export interface IForgotPasswordResponse {
  forgotPassword: {
    edge: IForgotPasswordEdge;
  };
}

export interface IForgotPasswordVariables {
  input: IForgotPasswordInput;
}

// ============================================
// Reset Password Types
// ============================================
export interface IResetPasswordInput {
  email: string;
  newPassword: string;
}

export interface IResetPasswordEdge {
  data: IUserData;
  node: string;
}

export interface IResetPasswordResponse {
  resetPassword: {
    edge: IResetPasswordEdge;
  };
}

export interface IResetPasswordVariables {
  input: IResetPasswordInput;
}

// ============================================
// Logout Types
// ============================================
export interface IUserLogoutResponse {
  userLogout: {
    success: boolean;
    message: string;
  };
}
