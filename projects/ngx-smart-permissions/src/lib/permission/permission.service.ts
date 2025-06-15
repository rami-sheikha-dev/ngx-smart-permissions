import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private _permissions$ = new BehaviorSubject<Set<string>>(new Set());
  private _isSuperRole$ = new BehaviorSubject<boolean>(false);
  private _role$ = new BehaviorSubject<string | null>(null); // ✅ جديد

  permissionsChanged$ = this._permissions$.asObservable();
 roleChanged$ = this._role$.asObservable();       // 🔔 تستخدمه الدايركتيف

  loadPermissions(perms: string[]): void {
    this._permissions$.next(new Set(perms));
  }

  setSuperRole(active: boolean): void {
    this._isSuperRole$.next(active);
  }

  switchPermissions(perms: string[], superMode: boolean = false, role: string | null = null): void {
    this.loadPermissions(perms);
    this.setSuperRole(superMode);
    if (role) this.setRole(role); // ✅
  }

  hasPermission(permission: string | string[]): boolean {
    if (this.isSuper()) return true;
    const currentPerms = this._permissions$.getValue();
    return Array.isArray(permission)
      ? permission.some(p => currentPerms.has(p))
      : currentPerms.has(permission);
  }

  hasAnyPermission(perms: string[]): boolean {
    if (this.isSuper()) return true;
    const currentPerms = this._permissions$.getValue();
    return perms.some(p => currentPerms.has(p));
  }

  hasAllPermissions(perms: string[]): boolean {
    if (this.isSuper()) return true;
    const currentPerms = this._permissions$.getValue();
    return perms.every(p => currentPerms.has(p));
  }


  getPermissions(): string[] {
    return Array.from(this._permissions$.getValue());
  }

  isSuper(): boolean {
    return this._isSuperRole$.getValue();
  }




setRole(role: string): void {
  this._role$.next(role);
}

getRole(): string {
  return this._role$.getValue()||'';
}

hasRole(requiredRole: string | string[]): boolean {
  const currentRole = this.getRole();
  return Array.isArray(requiredRole)
    ? requiredRole.includes(currentRole)
    : currentRole === requiredRole;
}

}
