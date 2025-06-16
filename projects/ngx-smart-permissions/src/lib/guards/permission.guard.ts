import { inject } from '@angular/core';
import {
  CanActivateFn,
  CanLoadFn,
  CanMatchFn,
  Route,
  UrlSegment,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { PermissionsService } from '../services/permissions.service';
import { Observable, of } from 'rxjs';

/**
 * Defines the config used by permission-based guards.
 */
interface PermissionGuardConfig {
  action?: string;             // Optional permission action (e.g., 'read')
  subject?: string;            // Optional permission subject (e.g., 'Post')
  object?: any;                // Optional object to validate conditions against
  allowedRoles?: string[];     // Optional list of roles that are allowed
  redirectTo?: string;         // Optional path to redirect on denial
}

/**
 * Centralized access check used by all permission guards.
 */
function checkAccess(config: PermissionGuardConfig): boolean {
  const permissionsService = inject(PermissionsService);
  const currentRole = permissionsService['role$'].getValue();
  const isSuperAdmin = currentRole === 'superadmin';

  // ✅ Allow superadmin to bypass all restrictions
  if (isSuperAdmin) return true;

  // ✅ Check roles if defined
  if (
    config.allowedRoles &&
    !config.allowedRoles.includes(currentRole ?? '')
  ) {
    return false;
  }

  // ✅ Check permission if action + subject are defined
  if (config.action && config.subject) {
    return permissionsService.can(
      config.action,
      config.subject,
      config.object ?? {}
    );
  }

  // ✅ Default: allow access if no restrictions specified
  return true;
}

/**
 * Angular Router Guard: CanActivate
 * Used for protecting routes directly.
 */
export const permissionGuard = (config: PermissionGuardConfig): CanActivateFn =>
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const allowed = checkAccess(config);
    if (!allowed) {
      const router = inject(Router);
      router.navigate([config.redirectTo ?? '/access-denied']);
    }
    return of(allowed);
  };

/**
 * Angular Router Guard: CanLoad
 * Used for lazy-loaded NgModules.
 */
export const permissionCanLoad = (config: PermissionGuardConfig): CanLoadFn =>
  (route: Route, segments: UrlSegment[]) => {
    const allowed = checkAccess(config);
    if (!allowed) {
      const router = inject(Router);
      router.navigate([config.redirectTo ?? '/access-denied']);
    }
    return of(allowed);
  };

/**
 * Angular Router Guard: CanMatch
 * Used for standalone routes (Angular 15+).
 */
export const permissionCanMatch = (config: PermissionGuardConfig): CanMatchFn =>
  (route, segments) => {
    const allowed = checkAccess(config);
    if (!allowed) {
      const router = inject(Router);
      router.navigate([config.redirectTo ?? '/access-denied']);
    }
    return of(allowed);
  };
