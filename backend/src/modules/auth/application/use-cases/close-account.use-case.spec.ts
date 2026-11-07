import { CloseAccountUseCase } from './close-account.use-case';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { UserNotFoundError } from '../../../users/application/errors/user.errors';
import {
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';

describe('CloseAccountUseCase', () => {
  let users: InMemoryUserRepository;
  let sessions: InMemoryRefreshTokenRepository;
  let useCase: CloseAccountUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository([makeUser({ id: 'user-1' })]);
    sessions = new InMemoryRefreshTokenRepository();
    useCase = new CloseAccountUseCase(users, sessions);
  });

  it('elimina la cuenta y revoca sus sesiones de refresco', async () => {
    const session = RefreshToken.create({
      id: 'session-1',
      userId: 'user-1',
      tokenHash: 'hash:refresh',
      expiresAt: new Date(Date.now() + 60_000),
    });
    await sessions.save(session);

    await useCase.execute({ userId: 'user-1' });

    expect(await users.findById('user-1')).toBeNull();
    expect(sessions.all).toHaveLength(1);
    expect(sessions.all[0].isActive()).toBe(false);
  });

  it('rechaza una cuenta inexistente', async () => {
    await expect(
      useCase.execute({ userId: 'no-existe' }),
    ).rejects.toThrow(UserNotFoundError);
  });
});
