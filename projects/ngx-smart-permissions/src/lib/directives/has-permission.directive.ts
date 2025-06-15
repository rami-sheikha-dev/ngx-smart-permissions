import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionService } from '../permission/permission.service';

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
    private permissionService: PermissionService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sub = this.permissionService.permissionsChanged$.subscribe(() => {
      this.updateView();
    });

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

    // ✅ Force Angular to detect changes immediately
    this.cdRef.markForCheck(); // or detectChanges() if needed
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
