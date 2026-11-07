import { UpdateRolePermissionsUseCase } from './update-role-permissions.use-case';
import { Permission } from '../../domain/enums/permission.enum';
import { Role } from '../../domain/enums/role.enum';
import { CannotModifyRolePermissionsError } from '../../domain/errors/user.errors';
import { RoleNotFoundError } from '../errors/user.errors';
import { InMemoryRoleRepository, makeRole } from '../../../../../test/support/fakes';

describe('UpdateRolePermissionsUseCase', () => {
  let roles: InMemoryRoleRepository;
  let useCase: UpdateRolePermissionsUseCase;

  beforeEach(() => {
    roles = new InMemoryRoleRepository();
    useCase = new UpdateRolePermissionsUseCase(roles);
  });

  it('permite al administrador modificar los permisos de un rol inferior', async () => {
    const updated = await useCase.execute(
      {
        role: Role.USUARIO,
        permissions: [Permission.FAVORITES_MANAGE, Permission.HELP_REQUESTS_CREATE],
      },
      { roleRank: 30 },
    );

    expect(updated.permissions).toEqual([
      Permission.FAVORITES_MANAGE,
      Permission.HELP_REQUESTS_CREATE,
    ]);
    expect((await roles.findByRole(Role.USUARIO))?.permissions).toEqual(updated.permissions);
  });

  it('impide modificar los permisos del rol administrador', async () => {
    await expect(
      useCase.execute(
        { role: Role.ADMINISTRADOR, permissions: [] },
        { roleRank: 30 },
      ),
    ).rejects.toThrow(CannotModifyRolePermissionsError);
  });

  it('impide modificar roles de jerarquía igual o superior', async () => {
    await expect(
      useCase.execute(
        { role: Role.PERSONAL_CLENA, permissions: [] },
        { roleRank: 20 },
      ),
    ).rejects.toThrow(CannotModifyRolePermissionsError);
  });

  it('rechaza un rol inexistente', async () => {
    roles = new InMemoryRoleRepository([makeRole(Role.ADMINISTRADOR, 30)]);
    useCase = new UpdateRolePermissionsUseCase(roles);

    await expect(
      useCase.execute({ role: Role.USUARIO, permissions: [] }, { roleRank: 30 }),
    ).rejects.toThrow(RoleNotFoundError);
  });
});
