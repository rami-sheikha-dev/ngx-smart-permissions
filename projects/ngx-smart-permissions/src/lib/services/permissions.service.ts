import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ability } from '../core/ability/ability';
import { AbilityBuilder } from '../core/ability/ability.builder';
import { PermissionRule } from '../core/types/permission-rule.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private ability!: Ability;
  private rules$ = new BehaviorSubject<PermissionRule[]>([]);
  private role$ = new BehaviorSubject<string | null>(null);

  /**
   * Define permissions directly by passing rules.
   */
  setRules(rules: PermissionRule[]) {
    this.ability = new Ability(rules);
    this.rules$.next(rules);
  }

  /**
   * Define permissions using a fluent builder API.
   */
  define(builderFn: (builder: AbilityBuilder) => void) {
    const builder = new AbilityBuilder();
    builderFn(builder);
    this.ability = builder.build();
    this.rules$.next(this.ability.getRules());
  }

  /**
   * Check if the current ability allows an action on a subject.
   */
  can(action: string, subject: string, object: any = {}): boolean {
    return this.ability?.can(action, subject, object) ?? false;
  }

  cannot(action: string, subject: string, object: any = {}): boolean {
    return !this.can(action, subject, object);
  }

  /**
   * (Optional) Set the current role for reference/use elsewhere.
   */
  setCurrentRole(role: string) {
    this.role$.next(role);
  }

  getCurrentRole(): Observable<string | null> {
    return this.role$.asObservable();
  }

  getRules(): Observable<PermissionRule[]> {
    return this.rules$.asObservable();
  }
}
