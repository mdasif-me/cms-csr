import { tokenManager, type IDecodedToken } from './token-manager';

export class SessionValidator {
  static async validateSession(): Promise<{
    isValid: boolean;
    user: IDecodedToken | null;
    error?: string;
  }> {
    try {
      const token = await tokenManager.getAccessToken();

      if (!token) {
        return { isValid: false, user: null, error: 'No token found' };
      }

      if (tokenManager.isTokenExpired(token)) {
        return { isValid: false, user: null, error: 'Token expired' };
      }

      const user = tokenManager.decodeToken(token);

      if (!user) {
        return { isValid: false, user: null, error: 'Invalid token' };
      }

      // check if token has required claims
      if (!user.id || !user.email || !user.role) {
        return { isValid: false, user: null, error: 'Invalid token claims' };
      }

      return { isValid: true, user };
    } catch (error) {
      console.error('Session validation error:', error);
      return {
        isValid: false,
        user: null,
        error: error instanceof Error ? error.message : 'Validation failed',
      };
    }
  }

  static async validateRole(requiredRole: string): Promise<boolean> {
    const { isValid, user } = await this.validateSession();
    if (!isValid || !user) return false;

    return user.role === requiredRole;
  }

  static async validatePermission(
    requiredPermission: string
  ): Promise<boolean> {
    const { isValid, user } = await this.validateSession();
    if (!isValid || !user?.permissions) return false;

    return user.permissions.includes(requiredPermission);
  }

  static async validateAnyPermission(
    requiredPermissions: string[]
  ): Promise<boolean> {
    const { isValid, user } = await this.validateSession();
    if (!isValid || !user?.permissions) return false;

    return requiredPermissions.some((permission) =>
      user.permissions?.includes(permission)
    );
  }

  static async validateAllPermissions(
    requiredPermissions: string[]
  ): Promise<boolean> {
    const { isValid, user } = await this.validateSession();
    if (!isValid || !user?.permissions) return false;

    return requiredPermissions.every((permission) =>
      user.permissions?.includes(permission)
    );
  }

  static getSessionInfo(): {
    userId?: string;
    role?: string;
    email?: string;
    permissions?: string[];
  } {
    const token = tokenManager.getAccessToken();
    if (!token) return {};

    const user = tokenManager.decodeToken(token as unknown as string);
    if (!user) return {};

    return {
      userId: user.id,
      role: user.role,
      email: user.email,
      permissions: user.permissions,
    };
  }
}
