import { PermissionRule } from '../types/permission-rule.model';
import { Ability } from './ability';

export class AbilityBuilder {
  private rules: PermissionRule[] = [];

  can(action: string, subject: string, conditions?: any): this {
    this.rules.push({ action, subject, conditions });
    return this;
  }

  cannot(action: string, subject: string, conditions?: any): this {
    this.rules.push({ action, subject, conditions, inverted: true });
    return this;
  }

  build(): Ability {
    return new Ability(this.rules);
  }
}
