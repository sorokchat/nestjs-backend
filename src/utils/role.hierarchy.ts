export class RoleHirerarchy {
  private readonly roles: Map<string, string[]>;

  constructor(roles: Map<string, string[]>) {
    for (const [, subRoles] of roles) {
      for (const subRole of subRoles) {
        if (!roles.has(subRole)) {
          throw new Error(`Під роль ${subRole} не визначена у ієрархії`);
        }
      }
    }
    this.roles = new Map(roles);
  }

  public hasNeededRole(
    existed: string,
    needed: string,
    visited: Set<string> = new Set(),
  ): boolean {
    if (existed === needed) return true;
    if (visited.has(existed)) return false;
    visited.add(existed);
    const direct = this.roles.get(existed);
    if (!direct) return false;
    return direct.some((role) => this.hasNeededRole(role, needed, visited));
  }
}
