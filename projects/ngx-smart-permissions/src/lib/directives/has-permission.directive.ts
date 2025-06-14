import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { PermissionService } from '../permission.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[ngxHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input('ngxHasPermission') required: string | string[] = '';

  private sub?: Subscription;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    // راقب التغييرات على الصلاحيات
    this.sub = this.permissionService.permissionsChanged$.subscribe(() => {
      this.updateView();
    });

    // تأكد أول مرة
    this.updateView();
  }

  private updateView() {
    const has = Array.isArray(this.required)
      ? this.permissionService.hasAnyPermission(this.required)
      : this.permissionService.hasPermission(this.required);

    this.vcr.clear();
    if (has) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
