export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/products',
  '/api/auth',
  '/api/public',
];

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/api/protected',
];

export const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/products',
  '/admin/orders',
  '/admin/settings',
  '/api/admin',
];

export const DYNAMIC_ROUTES = [
  '/users/:id',
  '/products/:id',
  '/orders/:id',
  '/admin/users/:id',
  '/admin/products/:id',
];

//NOTE: route groups for easier management
export const ROUTE_GROUPS = {
  PUBLIC: PUBLIC_ROUTES,
  PROTECTED: PROTECTED_ROUTES,
  ADMIN: ADMIN_ROUTES,
  DYNAMIC: DYNAMIC_ROUTES,
} as const;

//NOTE: route permissions mapping
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/admin/users': ['user:view'],
  '/admin/users/create': ['user:create'],
  '/admin/users/:id/edit': ['user:edit'],
  '/admin/products': ['product:view'],
  '/admin/products/create': ['product:create'],
  '/admin/orders': ['order:view'],
  '/admin/orders/:id/approve': ['order:approve'],
  '/dashboard': ['dashboard:view'],
  '/settings': ['settings:view'],
};
