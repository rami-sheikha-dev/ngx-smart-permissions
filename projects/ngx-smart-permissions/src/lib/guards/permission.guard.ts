import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from '../permission.service';
import { getPermissionsConfig } from '../permissions.providers';
 
export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const required = route.data?.['permission']; // ممكن تكون string أو array
  const config = getPermissionsConfig();

  const hasPermission = Array.isArray(required)
    ? permissionService.hasAnyPermission(required)
    : permissionService.hasPermission(required);

  if (hasPermission) {
    return true;
  }

  const redirectPath = route.data?.['redirectTo'] || config.redirectTo || '/access-denied';
  return router.parseUrl(redirectPath);
};
