import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import {
  FakePasswordHasher,
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { IncorrectCurrentPasswordError } from '../errors/auth.errors';
import { ChangePasswordUseCase } from './change-password.use-case';

describe('ChangePasswordUseCase', () => {
  let users: InMemoryUserRepository;
  let sessions: InMemoryRefreshTokenRepository;
  let passwordHasher: FakePasswordHasher;
  let useCase: ChangePasswordUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository([makeUser({ id: 'user-1' })]);
    sessions = new InMemoryRefreshTokenRepository();
    passwordHasher = new FakePasswordHasher();
    useCase = new ChangePasswordUseCase(users, sessions, passwordHasher);
  });

  it('cifra la nueva contraseña y revoca las sesiones del usuario', async () => {
    const session = RefreshToken.create({
      id: 'session-1',
      userId: 'user-1',
      tokenHash: 'hash:refresh',
      expiresAt: new Date(Date.now() + 60_000),
    });
    await sessions.save(session);

    await useCase.execute({
      userId: 'user-1',
      currentPassword: 'Password123',
      newPassword: 'NuevaSegura123',
    });

    const updated = await users.findById('user-1');
    expect(updated?.passwordHash).toBe('hashed:NuevaSegura123');
    expect(sessions.all[0].isActive()).toBe(false);
  });

  it('rechaza una contraseña actual incorrecta sin modificar el usuario', async () => {
    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'Incorrecta123',
        newPassword: 'NuevaSegura123',
      }),
    ).rejects.toThrow(IncorrectCurrentPasswordError);

    const unchanged = await users.findById('user-1');
    expect(unchanged?.passwordHash).toBe('hashed:Password123');
  });

  it('rechaza un usuario inexistente', async () => {
    await expect(
      useCase.execute({
        userId: 'no-existe',
        currentPassword: 'Password123',
        newPassword: 'NuevaSegura123',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('rechaza un usuario inactivo', async () => {
    users = new InMemoryUserRepository([makeUser({ id: 'user-1', isActive: false })]);
    useCase = new ChangePasswordUseCase(users, sessions, passwordHasher);

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'Password123',
        newPassword: 'NuevaSegura123',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
