import { TestBed } from '@angular/core/testing';
import { PermissionService } from './permission.service';

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load permissions and check for a single permission', () => {
    service.loadPermissions(['view-dashboard']);
    expect(service.hasPermission('view-dashboard')).toBeTrue();
    expect(service.hasPermission('edit-users')).toBeFalse();
  });

  it('should detect super role and override all permissions', () => {
    service.loadPermissions([]);
    service.setSuperRole(true);
    expect(service.hasPermission('any')).toBeTrue();
  });

  it('should return true if user has any of the given permissions', () => {
    service.loadPermissions(['a', 'b']);
    expect(service.hasAnyPermission(['x', 'b'])).toBeTrue();
    expect(service.hasAnyPermission(['x', 'y'])).toBeFalse();
  });

  it('should return true only if user has all of the given permissions', () => {
    service.loadPermissions(['x', 'y', 'z']);
    expect(service.hasAllPermissions(['x', 'y'])).toBeTrue();
    expect(service.hasAllPermissions(['x', 'a'])).toBeFalse();
  });

  it('should correctly store and retrieve role', () => {
    service.setRole('admin');
    expect(service.getRole()).toBe('admin');
    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasRole(['admin', 'user'])).toBeTrue();
    expect(service.hasRole('user')).toBeFalse();
  });

  it('switchPermissions should set all values at once', () => {
    service.switchPermissions(['view-dashboard'], true, 'admin');
    expect(service.hasPermission('view-dashboard')).toBeTrue();
    expect(service.isSuper()).toBeTrue();
    expect(service.getRole()).toBe('admin');
  });
});
