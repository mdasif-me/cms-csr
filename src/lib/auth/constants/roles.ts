/* eslint-disable @typescript-eslint/no-require-imports */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Role[] = [
  ROLES.GUEST,
  ROLES.USER,
  ROLES.MANAGER,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [ROLES.SUPER_ADMIN]: [],
  [ROLES.ADMIN]: [],
  [ROLES.MANAGER]: [],
  [ROLES.USER]: [],
  [ROLES.GUEST]: [],
};

// initialize role permissions
Object.keys(ROLE_PERMISSIONS).forEach((role) => {
  const roleKey = role as Role;
  switch (roleKey) {
    case ROLES.SUPER_ADMIN:
      ROLE_PERMISSIONS[roleKey] =
        require('./permissions').PERMISSION_SETS.SUPER_ADMIN;
      break;
    case ROLES.ADMIN:
      ROLE_PERMISSIONS[roleKey] =
        require('./permissions').PERMISSION_SETS.ADMIN;
      break;
    case ROLES.MANAGER:
      ROLE_PERMISSIONS[roleKey] =
        require('./permissions').PERMISSION_SETS.MANAGER;
      break;
    case ROLES.USER:
      ROLE_PERMISSIONS[roleKey] = require('./permissions').PERMISSION_SETS.USER;
      break;
    case ROLES.GUEST:
      ROLE_PERMISSIONS[roleKey] = [];
      break;
  }
});
