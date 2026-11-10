import { CreateDefaultRolesUseCase } from './create-default-roles.use-case';
import { ALL_PERMISSIONS, Permission } from '../../domain/enums/permission.enum';
import { Role } from '../../domain/enums/role.enum';
import { InMemoryRoleRepository } from '../../../../../test/support/fakes';

describe('CreateDefaultRolesUseCase', () => {
  it('crea los tres roles por defecto con sus permisos', async () => {
    const roles = new InMemoryRoleRepository([]);
    const useCase = new CreateDefaultRolesUseCase(roles);

    const createdRoles = await useCase.execute();

    expect(createdRoles.map(({ role }) => role)).toEqual([
      Role.ADMINISTRADOR,
      Role.PERSONAL_CLENA,
      Role.USUARIO,
    ]);
    expect(createdRoles[0].permissions).toEqual(ALL_PERMISSIONS);
    expect(createdRoles[1].permissions).toEqual([
      Permission.USERS_READ,
      Permission.SESSIONS_READ_ONLINE,
      Permission.HELP_REQUESTS_READ,
      Permission.ROOM_INFO_MANAGE,
      Permission.GUIDES_CREATE,
      Permission.GUIDES_MANAGE,
    ]);
    expect(createdRoles[2].permissions).toEqual([
      Permission.FAVORITES_MANAGE,
      Permission.HELP_REQUESTS_CREATE,
    ]);
  });

  it('no duplica roles que ya existen', async () => {
    const roles = new InMemoryRoleRepository([]);
    const useCase = new CreateDefaultRolesUseCase(roles);

    await useCase.execute();
    await useCase.execute();

    expect(await roles.findAll()).toHaveLength(3);
  });
});
