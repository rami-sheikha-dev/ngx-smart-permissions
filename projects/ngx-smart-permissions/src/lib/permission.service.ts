import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private _permissions$ = new BehaviorSubject<Set<string>>(new Set());
  private _isSuperRole$ = new BehaviorSubject<boolean>(false);

  /** ✅ Observable للتحديث التلقائي */
  permissionsChanged$ = this._permissions$.asObservable();

  /** تحميل صلاحيات المستخدم */
  loadPermissions(perms: string[]): void {
    this._permissions$.next(new Set(perms));
  }

  /** تفعيل أو إيقاف وضع Super Admin */
  setSuperRole(active: boolean): void {
    this._isSuperRole$.next(active);
  }

  /** تبديل الصلاحيات لايف */
  switchPermissions(perms: string[], superMode: boolean = false): void {
    this.loadPermissions(perms);
    this.setSuperRole(superMode);
  }

  /** فحص صلاحية واحدة أو أكثر */
  hasPermission(permission: string | string[]): boolean {
    if (this.isSuper()) return true;

    const currentPerms = this._permissions$.getValue();

    if (Array.isArray(permission)) {
      return permission.some(p => currentPerms.has(p));
    }

    return currentPerms.has(permission);
  }

  /** واحدة على الأقل من قائمة */
  hasAnyPermission(perms: string[]): boolean {
    if (this.isSuper()) return true;
    const currentPerms = this._permissions$.getValue();
    return perms.some(p => currentPerms.has(p));
  }

  /** كل الصلاحيات مطلوبة */
  hasAllPermissions(perms: string[]): boolean {
    if (this.isSuper()) return true;
    const currentPerms = this._permissions$.getValue();
    return perms.every(p => currentPerms.has(p));
  }

  /** استرجاع جميع الصلاحيات */
  getPermissions(): string[] {
    return Array.from(this._permissions$.getValue());
  }

  /** التحقق إذا المستخدم Super Admin */
  isSuper(): boolean {
    return this._isSuperRole$.getValue();
  }
}
