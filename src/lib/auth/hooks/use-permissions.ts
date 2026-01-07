import { useAuth } from './use-auth';

export function usePermissions() {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } =
    useAuth();

  const canView = (resource: string): boolean =>
    hasPermission(`${resource}:view`) || hasPermission(`${resource}:*`);

  const canCreate = (resource: string): boolean =>
    hasPermission(`${resource}:create`) || hasPermission(`${resource}:*`);

  const canEdit = (resource: string): boolean =>
    hasPermission(`${resource}:edit`) || hasPermission(`${resource}:*`);

  const canDelete = (resource: string): boolean =>
    hasPermission(`${resource}:delete`) || hasPermission(`${resource}:*`);

  const canExport = (resource: string): boolean =>
    hasPermission(`${resource}:export`) || hasPermission(`${resource}:*`);

  const canManage = (resource: string): boolean =>
    hasAllPermissions([
      `${resource}:view`,
      `${resource}:create`,
      `${resource}:edit`,
      `${resource}:delete`,
    ]);

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canManage,
    permissions: user?.permissions || [],
  };
}
