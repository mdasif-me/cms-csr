export type {
  LoginForm,
  LoginFormData,
  TLoginForm,
} from '../schemas/login.schema';

export type { RegisterForm, TRegisterForm } from '../schemas/register.schema';

export type {
  TChangePasswordForm,
  TForgotPasswordForm,
  TResendVerificationEmailForm,
  TResetPasswordForm,
} from '../schemas/password.schema';

export type {
  IForgotPasswordEdge,
  IForgotPasswordInput,
  IForgotPasswordResponse,
  IForgotPasswordVariables,
  ILoginUserInput,
  IRefreshTokenEdge,
  IRefreshTokenInput,
  IRefreshTokenResponse,
  IRefreshTokenVariables,
  IRegisterUserInput,
  IResetPasswordEdge,
  IResetPasswordInput,
  IResetPasswordResponse,
  IResetPasswordVariables,
  ITokenData,
  IUserData,
  IUserLoginEdge,
  IUserLoginResponse,
  IUserLoginVariables,
  IUserLogoutResponse,
  IUserRegistrationEdge,
  IUserRegistrationResponse,
  IUserRegistrationVariables,
} from '@/lib/graphql/types/auth.types';
