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
  selector: '[ngxHasPermission]',
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private requiredPermission: string | null = null;
  private context: any = {};
  private sub = new Subscription();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionsService: PermissionsService
  ) {}

  @Input()
  set ngxHasPermission(value: string | { action: string; subject: string; object?: any }) {
    if (typeof value === 'string') {
      const [action, subject] = value.split(':');
      this.context = { action, subject };
    } else {
      this.context = {
        action: value.action,
        subject: value.subject,
        object: value.object || {},
      };
    }
    this.updateView();
  }

  ngOnInit() {
    this.sub.add(
      this.permissionsService.getCurrentRole().subscribe(() => this.updateView())
    );
    this.sub.add(
      this.permissionsService.getRules().subscribe(() => this.updateView())
    );
  }

  private updateView() {
    const { action, subject, object } = this.context;

    const isSuperAdmin = this.permissionsService['can']?.name === 'bound can' // fallback check
      ? false
      : this.permissionsService['role$']?.getValue?.() === 'superadmin';

    const hasAccess =
      isSuperAdmin || this.permissionsService.can(action, subject, object);

    this.viewContainer.clear();

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
