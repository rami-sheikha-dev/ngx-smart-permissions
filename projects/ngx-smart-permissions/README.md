# 🔐 ngx-smart-permissions

**ngx-smart-permissions** is a lightweight and smart Angular library for managing **role-based** and **permission-based** access control in Angular applications. Supports both **standalone components** and **NgModules**.  
Built for Angular 17+ & 18+.

---

## ✨ Features

- ✅ Show/Hide UI based on **permissions** or **roles**
- ✅ Reusable **Directives**: `*ngxHasPermission`, `*ngxHasRole`
- ✅ Built-in **Route Guard** for permission-based navigation
- ✅ Live permission switching (great for testing/admins)
- ✅ Support for **Super Admin**
- ✅ Lazy-loaded module support
- ✅ Fully compatible with **Standalone Components**
- ✅ Easy setup with `provideNgxSmartPermissions(...)`

---

## 📦 Installation

```bash
npm install ngx-smart-permissions
```

---

## 🛠️ Setup

### 1. Register the providers

In `main.ts`:

```ts
import { provideNgxSmartPermissions } from 'ngx-smart-permissions';

bootstrapApplication(AppComponent, {
  providers: [
    provideNgxSmartPermissions({
      redirectTo: '/unauthorized' // optional
    })
  ]
});
```

Or inside an NgModule:

```ts
@NgModule({
  imports: [
    NgxSmartPermissionsModule
  ]
})
export class AppModule {}
```

---

## 🧠 Usage

### ✅ UI Directive: `*ngxHasPermission`

```html
<!-- Show only if user has "edit-post" permission -->
<button *ngxHasPermission="'edit-post'">Edit</button>

<!-- Show if user has ANY of these -->
<div *ngxHasPermission="['admin', 'editor']">Admin Tools</div>
```

### ✅ Role Directive: `*ngxHasRole`

```html
<div *ngxHasRole="'admin'">Welcome, Admin</div>
```

---

### 🔐 Permission Guard

Protect routes by permission:

```ts
import { permissionGuard } from 'ngx-smart-permissions';

{
  path: 'admin',
  canActivate: [permissionGuard],
  data: {
    permission: 'access-admin'
  }
}
```

---

## 🔄 Set Permissions (e.g. after login)

In your AuthService or login component:

```ts
const permissions = ['view-dashboard', 'edit-user'];
const role = 'admin';
const isSuperAdmin = role === 'admin';

permissionService.switchPermissions(permissions, isSuperAdmin, role);
```

---

## 🚫 Access Denied Page

Use `redirectTo` in `provideNgxSmartPermissions()` to control redirection for unauthorized access.

```ts
provideNgxSmartPermissions({ redirectTo: '/unauthorized' });
```

---

## 🧪 Testing

Basic unit tests are recommended for your permission logic.  
You can spy on `PermissionService` methods for behavior tests.

---

## 📁 File Structure

```
src/
└── lib/
    ├── directives/
    │   ├── has-permission.directive.ts
    │   └── has-role.directive.ts
    ├── guards/
    │   └── permission.guard.ts
    ├── permission/
    │   ├── permission.service.ts
    │   ├── permission.config.ts
    │   └── permissions.providers.ts
    ├── ngx-smart-permissions.module.ts
    └── public-api.ts
```

---

## ✅ Compatibility

- ✅ Angular 17 & 18
- ✅ Supports both `NgModules` & `Standalone Components`
- ✅ Fully tree-shakable & side-effect free

---

## 📄 License

MIT © [Rami Shaikha](https://github.com/rami-sheikha-dev)