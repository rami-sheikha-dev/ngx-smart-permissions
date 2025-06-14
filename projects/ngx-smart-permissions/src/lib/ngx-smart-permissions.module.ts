import { NgModule } from '@angular/core';
import { HasPermissionDirective } from './directives/has-permission.directive';

@NgModule({
  imports: [HasPermissionDirective],   
  exports: [HasPermissionDirective]
})
export class NgxSmartPermissionsModule {}
