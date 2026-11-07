import { DeleteUserUseCase } from './delete-user.use-case';
import { Role } from '../../domain/enums/role.enum';
import { CannotManageUserError } from '../../domain/errors/user.errors';
import { UserNotFoundError } from '../errors/user.errors';
import {
  InMemoryRoleRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';

describe('DeleteUserUseCase', () => {
  let users: InMemoryUserRepository;
  let roles: InMemoryRoleRepository;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository([
      makeUser({ id: 'user-1', email: 'user1@clena.local', role: Role.USUARIO }),
      makeUser({ id: 'admin-1', email: 'admin1@clena.local', role: Role.ADMINISTRADOR }),
      makeUser({ id: 'admin-2', email: 'admin2@clena.local', role: Role.ADMINISTRADOR }),
    ]);
    roles = new InMemoryRoleRepository();
    useCase = new DeleteUserUseCase(users, roles);
  });

  it('elimina un usuario con rol inferior', async () => {
    await useCase.execute(
      { targetUserId: 'user-1' },
      { id: 'admin-1', roleRank: 30 },
    );

    expect(await users.findById('user-1')).toBeNull();
  });

  it('impide eliminar la propia cuenta desde la administración', async () => {
    await expect(
      useCase.execute(
        { targetUserId: 'admin-1' },
        { id: 'admin-1', roleRank: 30 },
      ),
    ).rejects.toThrow(CannotManageUserError);
  });

  it('impide eliminar usuarios con un rol igual o superior', async () => {
    await expect(
      useCase.execute(
        { targetUserId: 'admin-2' },
        { id: 'admin-1', roleRank: 30 },
      ),
    ).rejects.toThrow(CannotManageUserError);
  });

  it('rechaza un usuario inexistente', async () => {
    await expect(
      useCase.execute(
        { targetUserId: 'no-existe' },
        { id: 'admin-1', roleRank: 30 },
      ),
    ).rejects.toThrow(UserNotFoundError);
  });
});
