import { RoleDefinition } from './role-definition.entity';
import { Permission } from '../enums/permission.enum';
import { Role } from '../enums/role.enum';
import { CannotModifyRolePermissionsError } from '../errors/user.errors';
import { makeRole } from '../../../../../test/support/fakes';

describe('RoleDefinition', () => {
  it('expone si tiene un permiso', () => {
    const role = makeRole(Role.USUARIO, 10, [
      Permission.FAVORITES_MANAGE,
      Permission.HELP_REQUESTS_CREATE,
    ]);

    expect(role.has(Permission.FAVORITES_MANAGE)).toBe(true);
    expect(role.has(Permission.USERS_CREATE)).toBe(false);
  });

  it('permite que un rol superior actualice los permisos de un rol inferior', () => {
    const role = makeRole(Role.USUARIO, 10, [Permission.FAVORITES_MANAGE]);
    const changedAt = new Date('2026-03-01T00:00:00.000Z');

    role.updatePermissions([Permission.HELP_REQUESTS_CREATE], 30, changedAt);

    expect(role.permissions).toEqual([Permission.HELP_REQUESTS_CREATE]);
    expect(role.updatedAt).toEqual(changedAt);
  });

  it('impide modificar los permisos del propio rol', () => {
    const role = makeRole(Role.ADMINISTRADOR, 30, [Permission.USERS_CREATE]);

    expect(() => role.updatePermissions([], 30)).toThrow(CannotModifyRolePermissionsError);
  });

  it('impide modificar roles de igual o mayor jerarquía', () => {
    const role = makeRole(Role.ADMINISTRADOR, 30, [Permission.USERS_CREATE]);

    expect(() => role.updatePermissions([], 20)).toThrow(CannotModifyRolePermissionsError);
  });

  it('devuelve una copia de los permisos', () => {
    const role = makeRole(Role.USUARIO, 10, [Permission.FAVORITES_MANAGE]);
    const permissions = role.permissions;

    permissions.push(Permission.USERS_CREATE);

    expect(role.has(Permission.USERS_CREATE)).toBe(false);
  });

  it('rehidrata definiciones de rol', () => {
    const role = RoleDefinition.rehydrate({
      role: Role.PERSONAL_CLENA,
      name: 'Personal del CLENA',
      rank: 20,
      permissions: [Permission.SESSIONS_READ_ONLINE],
    });

    expect(role.role).toBe(Role.PERSONAL_CLENA);
    expect(role.rank).toBe(20);
    expect(role.has(Permission.SESSIONS_READ_ONLINE)).toBe(true);
  });
});
