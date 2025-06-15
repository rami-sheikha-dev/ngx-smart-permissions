import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { PermissionService } from '../permission/permission.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[ngxHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input('ngxHasRole') required: string | string[] = '';

  private sub?: Subscription;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.sub = this.permissionService.roleChanged$.subscribe(() => {
      this.updateView();
    });
    this.updateView();
  }

  private updateView() {
    const has = this.permissionService.hasRole(this.required);
    this.vcr.clear();
    if (has) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
