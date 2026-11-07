import { LoginUseCase } from './login.use-case';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { InvalidTokenError } from '../errors/auth.errors';
import {
  FakePasswordHasher,
  FakeTokenHasher,
  FakeTokenService,
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';

describe('RefreshTokenUseCase', () => {
  let users: InMemoryUserRepository;
  let sessions: InMemoryRefreshTokenRepository;
  let tokenHasher: FakeTokenHasher;
  let tokenService: FakeTokenService;
  let useCase: RefreshTokenUseCase;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository([makeUser()]);
    sessions = new InMemoryRefreshTokenRepository();
    tokenHasher = new FakeTokenHasher();
    tokenService = new FakeTokenService();
    const passwordHasher = new FakePasswordHasher();
    loginUseCase = new LoginUseCase(users, sessions, passwordHasher, tokenHasher, tokenService);
    useCase = new RefreshTokenUseCase(users, sessions, tokenHasher, tokenService);
  });

  it('rota el refresh token y devuelve un par nuevo', async () => {
    const login = await loginUseCase.execute({
      email: 'usuario@clena.local',
      password: 'Password123',
    });

    const result = await useCase.execute({ refreshToken: login.tokens.refreshToken });

    expect(result.tokens.accessToken).toContain('access.user-1');
    expect(result.tokens.refreshToken).toContain('refresh.user-1');
    expect(result.tokens.refreshToken).not.toBe(login.tokens.refreshToken);
    expect(sessions.all[0].tokenHash).toBe(`hash:${result.tokens.refreshToken}`);
  });

  it('rechaza un refresh token inválido', async () => {
    await expect(useCase.execute({ refreshToken: 'token-invalido' })).rejects.toThrow(
      InvalidTokenError,
    );
  });

  it('rechaza una sesión revocada', async () => {
    const login = await loginUseCase.execute({
      email: 'usuario@clena.local',
      password: 'Password123',
    });
    sessions.all[0].revoke();
    await sessions.save(sessions.all[0]);

    await expect(
      useCase.execute({ refreshToken: login.tokens.refreshToken }),
    ).rejects.toThrow(InvalidTokenError);
  });

  it('revoca la sesión si detecta reutilización de un token rotado', async () => {
    const login = await loginUseCase.execute({
      email: 'usuario@clena.local',
      password: 'Password123',
    });
    const session = sessions.all[0];
    session.rotate('hash:otro-token', new Date(Date.now() + 60_000));
    await sessions.save(session);

    await expect(
      useCase.execute({ refreshToken: login.tokens.refreshToken }),
    ).rejects.toThrow(InvalidTokenError);
    expect(sessions.all[0].revokedAt).not.toBeNull();
  });
});
