import { GetPrincipalUseCase } from './get-principal.use-case';
import { Role } from '../../domain/enums/role.enum';
import { Permission } from '../../domain/enums/permission.enum';
import { UnauthorizedError } from '../../../../../src/shared/application/errors/common.errors';
import {
  InMemoryRoleRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';

describe('GetPrincipalUseCase', () => {
  it('resuelve el usuario con los permisos actuales de su rol', async () => {
    const users = new InMemoryUserRepository([
      makeUser({ id: 'clena-1', role: Role.PERSONAL_CLENA }),
    ]);
    const roles = new InMemoryRoleRepository();
    const useCase = new GetPrincipalUseCase(users, roles);

    const principal = await useCase.execute('clena-1');

    expect(principal.role).toBe(Role.PERSONAL_CLENA);
    expect(principal.roleRank).toBe(20);
    expect(principal.permissions).toContain(Permission.SESSIONS_READ_ONLINE);
  });

  it('rechaza un usuario inexistente', async () => {
    const useCase = new GetPrincipalUseCase(
      new InMemoryUserRepository(),
      new InMemoryRoleRepository(),
    );

    await expect(useCase.execute('no-existe')).rejects.toThrow(UnauthorizedError);
  });

  it('rechaza un usuario inactivo', async () => {
    const users = new InMemoryUserRepository([
      makeUser({ id: 'user-1', isActive: false }),
    ]);
    const useCase = new GetPrincipalUseCase(users, new InMemoryRoleRepository());

    await expect(useCase.execute('user-1')).rejects.toThrow(UnauthorizedError);
  });
});
