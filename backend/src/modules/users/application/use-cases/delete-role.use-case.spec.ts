import { DeleteRoleUseCase } from './delete-role.use-case';
import { Role } from '../../domain/enums/role.enum';
import {
  CannotManageRoleError,
  ReservedRoleError,
} from '../../domain/errors/user.errors';
import { RoleInUseError, RoleNotFoundError } from '../errors/user.errors';
import {
  InMemoryRoleRepository,
  InMemoryUserRepository,
  makeRole,
  makeUser,
} from '../../../../../test/support/fakes';

describe('DeleteRoleUseCase', () => {
  let users: InMemoryUserRepository;
  let roles: InMemoryRoleRepository;
  let useCase: DeleteRoleUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    roles = new InMemoryRoleRepository([
      makeRole(Role.ADMINISTRADOR, 30),
      makeRole(Role.USUARIO, 10),
      makeRole('colaborador', 5),
    ]);
    useCase = new DeleteRoleUseCase(roles, users);
  });

  it('elimina un rol inferior sin usuarios asignados', async () => {
    await useCase.execute({ role: 'colaborador' }, { roleRank: 30 });

    expect(await roles.findByRole('colaborador')).toBeNull();
  });

  it('impide eliminar roles reservados por el sistema', async () => {
    await expect(
      useCase.execute({ role: Role.USUARIO }, { roleRank: 30 }),
    ).rejects.toThrow(ReservedRoleError);
  });

  it('impide eliminar un rol con usuarios asignados', async () => {
    users = new InMemoryUserRepository([
      makeUser({ id: 'user-1', role: 'colaborador' }),
    ]);
    useCase = new DeleteRoleUseCase(roles, users);

    await expect(
      useCase.execute({ role: 'colaborador' }, { roleRank: 30 }),
    ).rejects.toThrow(RoleInUseError);
  });

  it('impide eliminar roles de jerarquía igual o superior', async () => {
    await expect(
      useCase.execute({ role: 'colaborador' }, { roleRank: 5 }),
    ).rejects.toThrow(CannotManageRoleError);
  });

  it('rechaza un rol inexistente', async () => {
    await expect(
      useCase.execute({ role: 'no-existe' }, { roleRank: 30 }),
    ).rejects.toThrow(RoleNotFoundError);
  });
});
