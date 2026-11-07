import { LoginUseCase } from './login.use-case';
import { InvalidCredentialsError } from '../errors/auth.errors';
import {
  FakePasswordHasher,
  FakeTokenHasher,
  FakeTokenService,
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';

describe('LoginUseCase', () => {
  let users: InMemoryUserRepository;
  let sessions: InMemoryRefreshTokenRepository;
  let passwordHasher: FakePasswordHasher;
  let tokenHasher: FakeTokenHasher;
  let tokenService: FakeTokenService;
  let useCase: LoginUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository([makeUser()]);
    sessions = new InMemoryRefreshTokenRepository();
    passwordHasher = new FakePasswordHasher();
    tokenHasher = new FakeTokenHasher();
    tokenService = new FakeTokenService();
    useCase = new LoginUseCase(users, sessions, passwordHasher, tokenHasher, tokenService);
  });

  it('devuelve tokens y crea una sesión de refresco', async () => {
    const result = await useCase.execute({
      email: '  USUARIO@CLENA.LOCAL ',
      password: 'Password123',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    });

    expect(result.user.id).toBe('user-1');
    expect(result.tokens.accessToken).toBe('access.user-1.usuario.1');
    expect(result.tokens.refreshToken).toContain(`refresh.user-1.${sessions.all[0].id}.`);
    expect(result.tokens.tokenType).toBe('Bearer');
    expect(sessions.all).toHaveLength(1);
    expect(sessions.all[0].tokenHash).toBe(`hash:${result.tokens.refreshToken}`);
    expect(sessions.all[0].ipAddress).toBe('127.0.0.1');
    expect(sessions.all[0].userAgent).toBe('jest');
  });

  it('rechaza credenciales incorrectas sin revelar si el usuario existe', async () => {
    await expect(
      useCase.execute({ email: 'usuario@clena.local', password: 'Incorrecta123' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('rechaza un correo inexistente', async () => {
    await expect(
      useCase.execute({ email: 'noexiste@clena.local', password: 'Password123' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('rechaza un usuario inactivo', async () => {
    users = new InMemoryUserRepository([makeUser({ isActive: false })]);
    useCase = new LoginUseCase(users, sessions, passwordHasher, tokenHasher, tokenService);

    await expect(
      useCase.execute({ email: 'usuario@clena.local', password: 'Password123' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
