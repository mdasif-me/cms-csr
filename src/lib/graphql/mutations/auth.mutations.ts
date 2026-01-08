import { gql } from '@apollo/client';

// User Login Mutation
export const USER_LOGIN = gql`
  mutation UserLogin($input: LoginUserInput!) {
    userLogin(input: $input) {
      edge {
        data {
          banner_url
          created_at
          deleted_at
          email
          full_name
          location
          logo_url
          phone_number
          reminder_by
          role
          status
          tokens {
            accessToken
            accessTokenExpiresAt
            refreshToken
            refreshTokenExpiresAt
          }
          uid
          updated_at
          website_url
          whatsapp_number
        }
        node
      }
    }
  }
`;

// User Registration Mutation
export const USER_REGISTRATION = gql`
  mutation UserRegistration($input: RegisterUserInput!) {
    userRegistration(input: $input) {
      edge {
        data {
          banner_url
          created_at
          deleted_at
          email
          full_name
          location
          logo_url
          phone_number
          reminder_by
          role
          status
          uid
          updated_at
          website_url
          whatsapp_number
        }
        node
      }
    }
  }
`;

// Refresh Token Mutation
export const REFRESH_TOKEN = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      edge {
        data {
          accessToken
          accessTokenExpiresAt
          refreshToken
          refreshTokenExpiresAt
        }
        node
      }
    }
  }
`;

// Forgot Password Mutation
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      edge {
        data {
          banner_url
          created_at
          deleted_at
          email
          full_name
          location
          logo_url
          phone_number
          reminder_by
          role
          status
          uid
          updated_at
          website_url
          whatsapp_number
        }
        node
      }
    }
  }
`;

// Reset Password Mutation
export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      edge {
        data {
          banner_url
          created_at
          deleted_at
          email
          full_name
          location
          logo_url
          phone_number
          reminder_by
          role
          status
          uid
          updated_at
          website_url
          whatsapp_number
        }
        node
      }
    }
  }
`;

// User Logout Mutation
export const USER_LOGOUT = gql`
  mutation UserLogout {
    userLogout {
      success
      message
    }
  }
`;
