'use client';

import { usePermissions } from '@/lib/auth/hooks/use-permissions';
import React, { JSX, ReactNode } from 'react';

interface IPermissionBoundaryProps {
  children: ReactNode;
  resource: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'manage';
  fallback?: ReactNode;
  showForAdmins?: boolean;
}

export function PermissionBoundary({
  children,
  resource,
  action,
  fallback = null,
  showForAdmins = true,
}: IPermissionBoundaryProps): JSX.Element {
  const { canView, canCreate, canEdit, canDelete, canExport, canManage, user } =
    usePermissions();

  const hasPermission = (): boolean => {
    // admins bypass if enabled
    if (showForAdmins && user?.role === 'admin') return true;

    switch (action) {
      case 'view':
        return canView(resource);
      case 'create':
        return canCreate(resource);
      case 'edit':
        return canEdit(resource);
      case 'delete':
        return canDelete(resource);
      case 'export':
        return canExport(resource);
      case 'manage':
        return canManage(resource);
      default:
        return false;
    }
  };

  if (!hasPermission()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// higher-order component for permission checking
export function withPermission<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  resource: string,
  action: IPermissionBoundaryProps['action'],
  fallback?: ReactNode
): React.FC<T> {
  return function WithPermissionComponent(props: T) {
    return (
      <PermissionBoundary
        resource={resource}
        action={action}
        fallback={fallback}
      >
        <WrappedComponent {...props} />
      </PermissionBoundary>
    );
  };
}
