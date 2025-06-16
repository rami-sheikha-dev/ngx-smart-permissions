/**
 * Defines the type of action that can be performed.
 * Examples: 'read', 'create', 'update', 'delete', 'manage'
 */
export type Action = string;

/**
 * Represents the target entity on which the action is performed.
 * Examples: 'Post', 'Comment', 'User'
 */
export type Subject = string;

/**
 * Defines optional conditions that must match for a permission to be valid.
 * Example: { status: 'published', authorId: 5 }
 */
export interface Condition {
  [field: string]: any;
}

/**
 * Represents a single permission rule in the ability system.
 */
export interface PermissionRule {
  /**
   * The allowed action (e.g., 'read', 'update', etc.)
   */
  action: Action;

  /**
   * The subject on which the action applies (e.g., 'Post')
   */
  subject: Subject;

  /**
   * If true, the rule is inverted (i.e., used in `cannot()` logic)
   */
  inverted?: boolean;

  /**
   * Optional conditions that must match for the rule to apply
   */
  conditions?: Condition;

  /**
   * Optional list of specific fields this rule applies to
   */
  fields?: string[];

  /**
   * Optional reason why this rule is applied (can be shown to users)
   */
  reason?: string;
}
