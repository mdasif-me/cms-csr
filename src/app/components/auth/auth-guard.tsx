'use client';

import { useAuth } from '@/lib/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';
import React, { JSX, ReactNode } from 'react';

interface IAuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback = null,
}: IAuthGuardProps): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface IPermissionGuardProps extends IAuthGuardProps {
  permission?: string;
  anyPermission?: string[];
  allPermissions?: string[];
  role?: string;
  anyRole?: string[];
}

export function PermissionGuard({
  children,
  permission,
  anyPermission,
  allPermissions,
  role,
  anyRole,
  fallback = null,
  ...authProps
}: IPermissionGuardProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hasPermission, hasRole, user } = useAuth();

  const checkAccess = (): boolean => {
    // check permissions
    if (permission && !hasPermission(permission)) return false;

    if (anyPermission && !anyPermission.some((p) => hasPermission(p)))
      return false;

    if (allPermissions && !allPermissions.every((p) => hasPermission(p)))
      return false;

    // check roles
    if (role && !hasRole(role)) return false;

    if (anyRole && !anyRole.some((r) => hasRole(r))) return false;

    return true;
  };

  const hasAccess = checkAccess();

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <AuthGuard {...authProps}>{children}</AuthGuard>;
}

const LoadingSpinner: React.FC = () => (
  <div className='flex items-center justify-center min-h-50'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' />
  </div>
);
