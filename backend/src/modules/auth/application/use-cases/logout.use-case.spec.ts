import { LoginUseCase } from './login.use-case';
import { LogoutUseCase } from './logout.use-case';
import { InvalidTokenError } from '../errors/auth.errors';
import {
  FakePasswordHasher,
  FakeTokenHasher,
  FakeTokenService,
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  makeUser,
} from '../../../../../test/support/fakes';

describe('LogoutUseCase', () => {
  let sessions: InMemoryRefreshTokenRepository;
  let tokenService: FakeTokenService;
  let loginUseCase: LoginUseCase;
  let useCase: LogoutUseCase;

  beforeEach(() => {
    const users = new InMemoryUserRepository([makeUser()]);
    sessions = new InMemoryRefreshTokenRepository();
    tokenService = new FakeTokenService();
    const tokenHasher = new FakeTokenHasher();
    loginUseCase = new LoginUseCase(
      users,
      sessions,
      new FakePasswordHasher(),
      tokenHasher,
      tokenService,
    );
    useCase = new LogoutUseCase(sessions, tokenService);
  });

  it('revoca la sesión asociada al refresh token', async () => {
    const login = await loginUseCase.execute({
      email: 'usuario@clena.local',
      password: 'Password123',
    });

    await useCase.execute({ refreshToken: login.tokens.refreshToken });

    expect(sessions.all[0].revokedAt).not.toBeNull();
  });

  it('es idempotente si la sesión ya no existe', async () => {
    await expect(
      useCase.execute({ refreshToken: 'refresh.user-1.sesion-inexistente' }),
    ).resolves.toBeUndefined();
  });

  it('rechaza un token inválido', async () => {
    await expect(useCase.execute({ refreshToken: 'invalido' })).rejects.toThrow(
      InvalidTokenError,
    );
  });
});
