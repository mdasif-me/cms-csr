import { redirect } from 'next/navigation';
import { SessionValidator } from '../core/session-validator';

export class RoleGuard {
  static async requireRole(
    requiredRole: string,
    redirectTo: string = '/unauthorized'
  ): Promise<void> {
    const hasRole = await SessionValidator.validateRole(requiredRole);

    if (!hasRole) {
      redirect(redirectTo);
    }
  }

  static async requireAnyRole(
    requiredRoles: string[],
    redirectTo: string = '/unauthorized'
  ): Promise<void> {
    const { isValid, user } = await SessionValidator.validateSession();

    if (!isValid || !user || !requiredRoles.includes(user.role)) {
      redirect(redirectTo);
    }
  }

  static async requireHigherOrEqualRole(
    requiredRole: string,
    roleHierarchy: string[],
    redirectTo: string = '/unauthorized'
  ): Promise<void> {
    const { isValid, user } = await SessionValidator.validateSession();

    if (!isValid || !user) {
      redirect('/login');
    }

    const userIndex = roleHierarchy.indexOf(user!.role);
    const requiredIndex = roleHierarchy.indexOf(requiredRole);

    if (userIndex < requiredIndex) {
      redirect(redirectTo);
    }
  }

  static async requireSuperAdmin(
    redirectTo: string = '/unauthorized'
  ): Promise<void> {
    await this.requireRole('super_admin', redirectTo);
  }

  static async requireAdmin(
    redirectTo: string = '/unauthorized'
  ): Promise<void> {
    await this.requireAnyRole(['admin', 'super_admin'], redirectTo);
  }
}
