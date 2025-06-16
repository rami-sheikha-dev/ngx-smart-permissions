import { PermissionRule } from '../types/permission-rule.model';

export class Ability {
  constructor(private rules: PermissionRule[]) {}

  can(action: string, subject: string, object: any = {}): boolean {
    return this.rules.some(rule => {
      if (rule.action !== action || rule.subject !== subject) return false;

      // check inverted
      if (rule.inverted) return false;

      // check conditions if any
      if (rule.conditions) {
        return Object.entries(rule.conditions).every(
          ([key, value]) => object[key] === value
        );
      }

      return true;
    });
  }

  cannot(action: string, subject: string, object: any = {}): boolean {
    return !this.can(action, subject, object);
  }

  getRules(): PermissionRule[] {
    return this.rules;
  }
}
