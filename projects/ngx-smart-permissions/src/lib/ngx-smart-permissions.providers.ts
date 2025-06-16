import { importProvidersFrom } from '@angular/core';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsService } from './services/permissions.service';

export interface NgxSmartPermissionsConfig {
  defaultRole?: string;
  enableSuperAdmin?: boolean;
  redirectTo?: string;
  loader?: () => Promise<any>; // Optional: dynamic loading from API
}

/**
 * Main provider for standalone or NgModule-based apps.
 */
export function provideNgxSmartPermissions(config: NgxSmartPermissionsConfig = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    // ✅ Import CommonModule (for directives, *ngIf, etc.)
    importProvidersFrom(CommonModule),

    // ✅ Provide PermissionsService with optional default role / loader
    {
      provide: PermissionsService,
      useFactory: () => {
        const service = new PermissionsService();

        if (config.defaultRole) {
          service.setCurrentRole(config.defaultRole);
        }

        if (config.loader) {
          config.loader().then((data) => {
            if (data.rules) service.setRules(data.rules);
            if (data.role) service.setCurrentRole(data.role);
          });
        }

        return service;
      },
    },
  ]);
}
