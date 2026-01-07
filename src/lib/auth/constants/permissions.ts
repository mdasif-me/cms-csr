export const PERMISSIONS = {
  // user management
  USER: {
    VIEW: 'user:view',
    CREATE: 'user:create',
    EDIT: 'user:edit',
    DELETE: 'user:delete',
    EXPORT: 'user:export',
    IMPERSONATE: 'user:impersonate',
  },

  // product management
  PRODUCT: {
    VIEW: 'product:view',
    CREATE: 'product:create',
    EDIT: 'product:edit',
    DELETE: 'product:delete',
    PUBLISH: 'product:publish',
    ARCHIVE: 'product:archive',
  },

  // order management
  ORDER: {
    VIEW: 'order:view',
    CREATE: 'order:create',
    EDIT: 'order:edit',
    DELETE: 'order:delete',
    CANCEL: 'order:cancel',
    APPROVE: 'order:approve',
    EXPORT: 'order:export',
  },

  // analytics
  ANALYTICS: {
    VIEW: 'analytics:view',
    EXPORT: 'analytics:export',
    MANAGE: 'analytics:manage',
  },

  // settings
  SETTINGS: {
    VIEW: 'settings:view',
    EDIT: 'settings:edit',
    MANAGE: 'settings:manage',
  },

  // system
  SYSTEM: {
    LOGS_VIEW: 'system:logs:view',
    CONFIG_VIEW: 'system:config:view',
    CONFIG_EDIT: 'system:config:edit',
    BACKUP: 'system:backup',
    RESTORE: 'system:restore',
  },
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];

export type PermissionGroup = keyof typeof PERMISSIONS;
export type PermissionAction<T extends PermissionGroup> =
  keyof (typeof PERMISSIONS)[T];

// helper function to get permission
export function getPermission<T extends PermissionGroup>(
  group: T,
  action: PermissionAction<T>
): Permission {
  return PERMISSIONS[group][action] as Permission;
}

// permission sets for common roles
export const PERMISSION_SETS = {
  SUPER_ADMIN: Object.values(PERMISSIONS).flatMap((group) =>
    Object.values(group)
  ),

  ADMIN: [
    PERMISSIONS.USER.VIEW,
    PERMISSIONS.USER.CREATE,
    PERMISSIONS.USER.EDIT,
    PERMISSIONS.PRODUCT.VIEW,
    PERMISSIONS.PRODUCT.CREATE,
    PERMISSIONS.PRODUCT.EDIT,
    PERMISSIONS.ORDER.VIEW,
    PERMISSIONS.ORDER.EDIT,
    PERMISSIONS.ANALYTICS.VIEW,
    PERMISSIONS.SETTINGS.VIEW,
  ],

  MANAGER: [
    PERMISSIONS.USER.VIEW,
    PERMISSIONS.PRODUCT.VIEW,
    PERMISSIONS.PRODUCT.EDIT,
    PERMISSIONS.ORDER.VIEW,
    PERMISSIONS.ORDER.EDIT,
    PERMISSIONS.ORDER.APPROVE,
  ],

  USER: [
    PERMISSIONS.PRODUCT.VIEW,
    PERMISSIONS.ORDER.VIEW,
    PERMISSIONS.ORDER.CREATE,
    PERMISSIONS.ORDER.CANCEL,
  ],
} as const;
