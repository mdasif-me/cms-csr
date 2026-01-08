import { gql } from '@apollo/client';

// login
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

// registration
export const USER_REGISTER = gql`
  mutation UserRegister($input: RegisterUserInput!) {
    userRegister(input: $input) {
      edge {
        data {
          uid
          email
          full_name
          role
          status
        }
        node
      }
    }
  }
`;

// refresh token
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

// logout
export const USER_LOGOUT = gql`
  mutation UserLogout {
    userLogout {
      success
      message
    }
  }
`;
