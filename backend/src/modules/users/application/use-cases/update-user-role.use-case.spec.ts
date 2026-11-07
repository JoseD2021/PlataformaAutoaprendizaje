import { UpdateUserRoleUseCase } from './update-user-role.use-case';
import { Role } from '../../domain/enums/role.enum';
import {
  CannotAssignRoleError,
  CannotManageUserError,
} from '../../domain/errors/user.errors';
import { UserNotFoundError } from '../errors/user.errors';
import {
  InMemoryRoleRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';

describe('UpdateUserRoleUseCase', () => {
  let users: InMemoryUserRepository;
  let roles: InMemoryRoleRepository;
  let useCase: UpdateUserRoleUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository([
      makeUser({ id: 'user-1', email: 'user1@clena.local', role: Role.USUARIO }),
      makeUser({ id: 'admin-2', email: 'admin2@clena.local', role: Role.ADMINISTRADOR }),
    ]);
    roles = new InMemoryRoleRepository();
    useCase = new UpdateUserRoleUseCase(users, roles);
  });

  it('permite al administrador cambiar el rol de otro usuario', async () => {
    const updated = await useCase.execute(
      { targetUserId: 'user-1', role: Role.PERSONAL_CLENA },
      { id: 'admin-1', roleRank: 30 },
    );

    expect(updated.role).toBe(Role.PERSONAL_CLENA);
  });

  it('impide cambiar el rol propio', async () => {
    await expect(
      useCase.execute(
        { targetUserId: 'admin-2', role: Role.USUARIO },
        { id: 'admin-2', roleRank: 30 },
      ),
    ).rejects.toThrow(CannotManageUserError);
  });

  it('impide administrar un usuario con un rol superior', async () => {
    await expect(
      useCase.execute(
        { targetUserId: 'admin-2', role: Role.USUARIO },
        { id: 'clena-1', roleRank: 20 },
      ),
    ).rejects.toThrow(CannotManageUserError);
  });

  it('impide asignar un rol superior al del actor', async () => {
    await expect(
      useCase.execute(
        { targetUserId: 'user-1', role: Role.ADMINISTRADOR },
        { id: 'clena-1', roleRank: 20 },
      ),
    ).rejects.toThrow(CannotAssignRoleError);
  });

  it('rechaza un usuario inexistente', async () => {
    await expect(
      useCase.execute(
        { targetUserId: 'no-existe', role: Role.USUARIO },
        { id: 'admin-1', roleRank: 30 },
      ),
    ).rejects.toThrow(UserNotFoundError);
  });
});
