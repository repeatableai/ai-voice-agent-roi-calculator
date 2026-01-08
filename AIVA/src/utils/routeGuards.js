// Route Guard Utilities
// Functions for checking route permissions

export function requireAuth(user) {
  return user !== null && user !== undefined;
}

export function requireRole(user, role) {
  if (!requireAuth(user)) return false;
  return user.role === role;
}

export function requireAnyRole(user, roles) {
  if (!requireAuth(user)) return false;
  return roles.includes(user.role);
}

export function requireAdmin(user) {
  if (!requireAuth(user)) return false;
  return user.role === 'admin' || user.role === 'super_admin';
}

export function requireSuperAdmin(user) {
  if (!requireAuth(user)) return false;
  return user.role === 'super_admin';
}

export function canAccessRoute(user, route) {
  if (!requireAuth(user)) return false;

  // Define route permissions
  const routePermissions = {
    '/': ['user', 'admin', 'super_admin'],
    '/analyses': ['user', 'admin', 'super_admin'],
    '/company': ['admin', 'super_admin'],
    '/company/employees': ['admin', 'super_admin'],
    '/company/analytics': ['admin', 'super_admin'],
    '/companies': ['super_admin'],
    '/companies/:id': ['super_admin'],
    '/admin': ['super_admin'],
    '/admin/settings': ['super_admin'],
    '/admin/users': ['super_admin'],
  };

  // Check exact match first
  if (routePermissions[route]) {
    return routePermissions[route].includes(user.role);
  }

  // Check pattern matches (e.g., /companies/:id)
  for (const [pattern, roles] of Object.entries(routePermissions)) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
      if (regex.test(route) && roles.includes(user.role)) {
        return true;
      }
    }
  }

  return false;
}

