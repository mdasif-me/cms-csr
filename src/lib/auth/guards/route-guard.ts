import { redirect } from 'next/navigation';
import { tokenManager } from '../core/token-manager';

export class RouteGuard {
  static async protectRoute(
    allowedRoles: string[] = [],
    allowedPermissions: string[] = [],
    redirectTo: string = '/unauthorized'
  ): Promise<void> {
    const user = await tokenManager.getCurrentUser();

    if (!user) {
      redirect('/login');
    }

    // check roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(user!.role)) {
      redirect(redirectTo);
    }

    // check permissions
    if (allowedPermissions.length > 0) {
      const hasPermission = allowedPermissions.every((permission) =>
        user!.permissions?.includes(permission)
      );

      if (!hasPermission) {
        redirect(redirectTo);
      }
    }
  }

  static async publicOnly(redirectTo: string = '/dashboard'): Promise<void> {
    const isAuthenticated = await tokenManager.isAuthenticated();

    if (isAuthenticated) {
      redirect(redirectTo);
    }
  }

  static async authenticatedOnly(redirectTo: string = '/login'): Promise<void> {
    const isAuthenticated = await tokenManager.isAuthenticated();

    if (!isAuthenticated) {
      redirect(redirectTo);
    }
  }
}
