import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[ngxHasRole]',
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private requiredRoles: string[] = [];
  private sub = new Subscription();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionsService: PermissionsService
  ) {}

  @Input()
  set ngxHasRole(value: string | string[]) {
    this.requiredRoles = Array.isArray(value) ? value : [value];
    this.updateView();
  }

  ngOnInit() {
    this.sub.add(
      this.permissionsService.getCurrentRole().subscribe(() => this.updateView())
    );
  }

  private updateView() {
    const currentRole = this.permissionsService['role$']?.getValue?.();
    const isSuperAdmin = currentRole === 'superadmin';

    const hasRole =
      isSuperAdmin || this.requiredRoles.includes(currentRole ?? '');

    this.viewContainer.clear();

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
