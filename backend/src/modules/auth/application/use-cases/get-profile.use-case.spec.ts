import { GetProfileUseCase } from './get-profile.use-case';
import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import { InMemoryUserRepository, makeUser } from '../../../../../test/support/fakes';

describe('GetProfileUseCase', () => {
  it('devuelve el usuario autenticado', async () => {
    const users = new InMemoryUserRepository([makeUser({ id: 'user-1' })]);
    const useCase = new GetProfileUseCase(users);

    const user = await useCase.execute('user-1');

    expect(user.email).toBe('usuario@clena.local');
  });

  it('rechaza un usuario inexistente', async () => {
    const useCase = new GetProfileUseCase(new InMemoryUserRepository());

    await expect(useCase.execute('no-existe')).rejects.toThrow(UnauthorizedError);
  });

  it('rechaza un usuario inactivo', async () => {
    const users = new InMemoryUserRepository([makeUser({ isActive: false })]);
    const useCase = new GetProfileUseCase(users);

    await expect(useCase.execute('user-1')).rejects.toThrow(UnauthorizedError);
  });
});
