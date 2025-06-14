import {
  EnvironmentProviders,
  importProvidersFrom,
  makeEnvironmentProviders,
  
} from '@angular/core';

import { NgxSmartPermissionsModule } from './ngx-smart-permissions.module';
 import { NgxSmartPermissionsConfig } from './permission.config';

let GLOBAL_CONFIG: NgxSmartPermissionsConfig = {
  redirectTo: '/access-denied'
};

export function setPermissionsConfig(config: NgxSmartPermissionsConfig) {
  GLOBAL_CONFIG = { ...GLOBAL_CONFIG, ...config };
}

export function getPermissionsConfig(): NgxSmartPermissionsConfig {
  return GLOBAL_CONFIG;
}

export function provideNgxSmartPermissions(config?: NgxSmartPermissionsConfig): EnvironmentProviders {
  setPermissionsConfig(config || {});
  return makeEnvironmentProviders([
    importProvidersFrom(NgxSmartPermissionsModule),
   ]);
}
