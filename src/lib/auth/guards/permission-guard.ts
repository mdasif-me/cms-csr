import { SessionValidator } from '../core/session-validator';

export class PermissionGuard {
  static async checkPermission(requiredPermission: string): Promise<boolean> {
    return SessionValidator.validatePermission(requiredPermission);
  }

  static async checkAnyPermission(
    requiredPermissions: string[]
  ): Promise<boolean> {
    return SessionValidator.validateAnyPermission(requiredPermissions);
  }

  static async checkAllPermissions(
    requiredPermissions: string[]
  ): Promise<boolean> {
    return SessionValidator.validateAllPermissions(requiredPermissions);
  }

  static async checkRole(requiredRole: string): Promise<boolean> {
    return SessionValidator.validateRole(requiredRole);
  }

  static async checkAnyRole(requiredRoles: string[]): Promise<boolean> {
    const { isValid, user } = await SessionValidator.validateSession();
    if (!isValid || !user) return false;

    return requiredRoles.includes(user.role);
  }

  static async checkHigherOrEqualRole(
    requiredRole: string,
    roleHierarchy: string[]
  ): Promise<boolean> {
    const { isValid, user } = await SessionValidator.validateSession();
    if (!isValid || !user) return false;

    const userIndex = roleHierarchy.indexOf(user.role);
    const requiredIndex = roleHierarchy.indexOf(requiredRole);

    return userIndex >= requiredIndex;
  }
}
