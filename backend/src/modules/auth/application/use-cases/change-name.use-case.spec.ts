import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import { InMemoryUserRepository, makeUser } from '../../../../../test/support/fakes';
import { ChangeNameUseCase } from './change-name.use-case';

describe('ChangeNameUseCase', () => {
  it('normaliza y guarda el nuevo nombre completo', async () => {
    const users = new InMemoryUserRepository([makeUser({ id: 'user-1' })]);
    const useCase = new ChangeNameUseCase(users);

    await useCase.execute({ userId: 'user-1', fullName: '  Ana Pérez  ' });

    const updated = await users.findById('user-1');
    expect(updated?.fullName).toBe('Ana Pérez');
  });

  it('rechaza un usuario inexistente', async () => {
    const useCase = new ChangeNameUseCase(new InMemoryUserRepository());

    await expect(useCase.execute({ userId: 'no-existe', fullName: 'Ana Pérez' })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('rechaza un usuario inactivo', async () => {
    const users = new InMemoryUserRepository([makeUser({ id: 'user-1', isActive: false })]);
    const useCase = new ChangeNameUseCase(users);

    await expect(useCase.execute({ userId: 'user-1', fullName: 'Ana Pérez' })).rejects.toThrow(
      UnauthorizedError,
    );
  });
});
