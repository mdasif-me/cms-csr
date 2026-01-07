import { useAuth } from './use-auth';

export function useRoles() {
  const { user, hasRole } = useAuth();

  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = hasRole('admin') || isSuperAdmin;
  const isManager = hasRole('manager') || isAdmin;
  const isUser = hasRole('user') || isManager;
  const isGuest = hasRole('guest') || isUser;

  const hasHigherOrEqualRole = (
    requiredRole: string,
    hierarchy: string[]
  ): boolean => {
    if (!user?.role) return false;

    const userIndex = hierarchy.indexOf(user.role);
    const requiredIndex = hierarchy.indexOf(requiredRole);

    return userIndex >= requiredIndex;
  };

  return {
    user,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isManager,
    isUser,
    isGuest,
    hasHigherOrEqualRole,
    currentRole: user?.role,
  };
}
