import { NgModule } from '@angular/core';
import { HasPermissionDirective } from './directives/has-permission.directive';
 import { HasRoleDirective } from './directives/has-role.directive';
@NgModule({
  imports: [HasPermissionDirective,HasRoleDirective],   
   exports: [HasPermissionDirective,HasRoleDirective]
})
export class NgxSmartPermissionsModule {}
