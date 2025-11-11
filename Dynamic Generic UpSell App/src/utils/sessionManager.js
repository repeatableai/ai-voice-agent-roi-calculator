/**
 * Session Manager Utility
 * Handles role-based authentication and permission management for FieldSell Pro
 *
 * Session Structure:
 * {
 *   user: { id, email, full_name, role: 'super_admin' | 'admin' | 'technician' },
 *   permissions: ['super_admin', 'admin', 'technician'], // What this user can access
 *   company_id: string | null, // null for super admin (all companies)
 *   created_at: timestamp
 * }
 */

const SESSION_KEY = 'fieldsell_active_session';

// Role hierarchy - determines default permissions
const ROLE_PERMISSIONS = {
  super_admin: ['super_admin', 'admin', 'technician'], // Can access everything
  admin: ['admin', 'technician'], // Can access admin and tech
  technician: ['technician'] // Can only access technician portal
};

/**
 * Create a new session for a user
 * @param {Object} user - User object with id, email, full_name, role
 * @param {string} companyId - Company ID (null for super admin)
 * @returns {Object} Session object
 */
export function createSession(user, companyId = null) {
  const session = {
    user: {
      id: user.id || user.user_id || user.employee_id,
      email: user.email || user.user_email,
      full_name: user.full_name,
      role: user.role
    },
    permissions: ROLE_PERMISSIONS[user.role] || ['technician'],
    company_id: companyId,
    created_at: new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  console.log('✅ [SESSION] Created session:', {
    user: session.user.full_name,
    role: session.user.role,
    permissions: session.permissions,
    company_id: session.company_id
  });

  return session;
}

/**
 * Get the current active session
 * @returns {Object|null} Session object or null if no session exists
 */
export function getSession() {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    return session;
  } catch (error) {
    console.error('❌ [SESSION] Error parsing session:', error);
    return null;
  }
}

/**
 * Check if the current user has permission to access a specific role
 * @param {string} requiredRole - Role to check ('super_admin', 'admin', 'technician')
 * @returns {boolean} True if user has permission
 */
export function hasPermission(requiredRole) {
  const session = getSession();
  if (!session) {
    console.log('❌ [SESSION] No active session');
    return false;
  }

  const hasAccess = session.permissions.includes(requiredRole);
  console.log(`🔒 [SESSION] Permission check for "${requiredRole}":`, hasAccess);
  return hasAccess;
}

/**
 * Get the user's role from active session
 * @returns {string|null} Role or null if no session
 */
export function getUserRole() {
  const session = getSession();
  return session ? session.user.role : null;
}

/**
 * Get the user's company ID from active session
 * @returns {string|null} Company ID or null
 */
export function getCompanyId() {
  const session = getSession();
  return session ? session.company_id : null;
}

/**
 * Switch context for super admin (to view as admin or technician of a specific company)
 * @param {string} targetRole - Role to switch to ('admin' or 'technician')
 * @param {string} companyId - Company to view
 * @returns {boolean} Success status
 */
export function switchContext(targetRole, companyId) {
  const session = getSession();

  if (!session || session.user.role !== 'super_admin') {
    console.error('❌ [SESSION] Only super admin can switch context');
    return false;
  }

  if (!['admin', 'technician'].includes(targetRole)) {
    console.error('❌ [SESSION] Invalid target role:', targetRole);
    return false;
  }

  // Create a temporary session maintaining super admin privileges
  const newSession = {
    ...session,
    viewing_as: targetRole,
    viewing_company: companyId,
    updated_at: new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  console.log(`✅ [SESSION] Super admin switched context to ${targetRole} for company ${companyId}`);

  return true;
}

/**
 * Clear the current session (logout)
 */
export function clearSession() {
  const session = getSession();
  if (session) {
    console.log('🚪 [SESSION] Logging out:', session.user.full_name);
  }

  localStorage.removeItem(SESSION_KEY);

  // Also clear legacy session keys for clean logout
  localStorage.removeItem('fieldsell_superadmin_session');
  localStorage.removeItem('fieldsell_demo_technician');
  localStorage.removeItem('fieldsell_admin_session');
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getSession() !== null;
}

/**
 * Get user info from session
 * @returns {Object|null} User object or null
 */
export function getUser() {
  const session = getSession();
  return session ? session.user : null;
}

/**
 * Validate session and redirect if needed
 * @param {string} requiredRole - Required role for the current page
 * @param {Function} navigate - React Router navigate function
 * @returns {boolean} True if valid, false if redirected
 */
export function validateSession(requiredRole, navigate) {
  if (!isAuthenticated()) {
    console.log('❌ [SESSION] Not authenticated, redirecting to login');
    navigate('/');
    return false;
  }

  if (!hasPermission(requiredRole)) {
    console.log(`❌ [SESSION] No permission for "${requiredRole}", redirecting`);

    // Redirect based on user's actual role
    const userRole = getUserRole();
    if (userRole === 'technician') {
      navigate('/technician');
    } else if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/superadmin');
    }
    return false;
  }

  return true;
}

export default {
  createSession,
  getSession,
  hasPermission,
  getUserRole,
  getCompanyId,
  switchContext,
  clearSession,
  isAuthenticated,
  getUser,
  validateSession
};
