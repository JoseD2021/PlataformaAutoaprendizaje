import { ListUsersUseCase } from './list-users.use-case';
import { Role } from '../../domain/enums/role.enum';
import { InMemoryUserRepository, makeUser } from '../../../../../test/support/fakes';

describe('ListUsersUseCase', () => {
  it('devuelve la página solicitada y el total de usuarios', async () => {
    const users = new InMemoryUserRepository([
      makeUser({
        id: 'user-1',
        email: 'uno@clena.local',
        role: Role.USUARIO,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
      makeUser({
        id: 'user-2',
        email: 'dos@clena.local',
        role: Role.PERSONAL_CLENA,
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
      }),
      makeUser({
        id: 'user-3',
        email: 'tres@clena.local',
        role: Role.USUARIO,
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
      }),
    ]);
    const useCase = new ListUsersUseCase(users);

    const result = await useCase.execute({ page: 2, limit: 2 });

    expect(result.total).toBe(3);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].email).toBe('uno@clena.local');
  });
});
