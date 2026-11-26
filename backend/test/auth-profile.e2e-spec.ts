import { type INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import { AcceptPrivacyTermsUseCase } from '../src/modules/auth/application/use-cases/accept-privacy-terms.use-case';
import { ChangeNameUseCase } from '../src/modules/auth/application/use-cases/change-name.use-case';
import { ChangePasswordUseCase } from '../src/modules/auth/application/use-cases/change-password.use-case';
import { CloseAccountUseCase } from '../src/modules/auth/application/use-cases/close-account.use-case';
import { GetProfileUseCase } from '../src/modules/auth/application/use-cases/get-profile.use-case';
import { LoginUseCase } from '../src/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '../src/modules/auth/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../src/modules/auth/application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from '../src/modules/auth/application/use-cases/register-user.use-case';
import { RefreshToken } from '../src/modules/auth/domain/entities/refresh-token.entity';
import { REFRESH_TOKEN_REPOSITORY } from '../src/modules/auth/domain/repositories/refresh-token.repository';
import { AuthController } from '../src/modules/auth/presentation/controllers/auth.controller';
import { PrivacyTermsRepository } from '../src/modules/privacy/domain/repositories/privacy-terms.repository';
import { GetPrincipalUseCase } from '../src/modules/users/application/use-cases/get-principal.use-case';
import { Role } from '../src/modules/users/domain/enums/role.enum';
import { USER_REPOSITORY } from '../src/modules/users/domain/repositories/user.repository';
import { UnauthorizedError } from '../src/shared/application/errors/common.errors';
import type { AuthenticatedUser } from '../src/shared/application/models/authenticated-user.model';
import { PASSWORD_HASHER } from '../src/shared/application/ports/password-hasher.port';
import { SESSION_CACHE } from '../src/shared/application/ports/session-cache.port';
import { TOKEN_SERVICE } from '../src/shared/application/ports/token-service.port';
import { JwtAuthGuard } from '../src/shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/shared/presentation/guards/permissions.guard';
import {
  FakePasswordHasher,
  InMemoryRefreshTokenRepository,
  InMemoryUserRepository,
  makeUser,
} from './support/fakes';

const principal: AuthenticatedUser = {
  id: 'user-1',
  email: 'usuario@clena.local',
  fullName: 'Usuario de Prueba',
  role: Role.USUARIO,
  roleName: 'Usuario común',
  roleRank: 10,
  permissions: [],
};

const TOKEN = 'Bearer token-user';

describe('Perfil del usuario autenticado (e2e)', () => {
  let app: INestApplication<App>;
  let users: InMemoryUserRepository;
  let sessions: InMemoryRefreshTokenRepository;

  beforeEach(async () => {
    users = new InMemoryUserRepository([makeUser({ id: 'user-1', fullName: 'Usuario de Prueba' })]);
    sessions = new InMemoryRefreshTokenRepository();
    await sessions.save(
      RefreshToken.create({
        id: 'sid-1',
        userId: 'user-1',
        tokenHash: 'hash:refresh',
        expiresAt: new Date(Date.now() + 60_000),
      }),
    );

    const tokenService = {
      verifyAccessToken: async (token: string) => {
        if (token !== 'token-user') {
          throw new UnauthorizedError('Token inválido.');
        }

        return { sub: 'user-1', sid: 'sid-1', type: 'access' };
      },
    };
    const sessionCache = {
      findActive: async (sessionId: string) =>
        sessionId === 'sid-1' ? { userId: 'user-1' } : null,
      invalidate: () => undefined,
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ChangePasswordUseCase,
        ChangeNameUseCase,
        { provide: LoginUseCase, useValue: {} },
        { provide: RefreshTokenUseCase, useValue: {} },
        { provide: LogoutUseCase, useValue: {} },
        { provide: GetProfileUseCase, useValue: {} },
        { provide: RegisterUserUseCase, useValue: {} },
        { provide: CloseAccountUseCase, useValue: {} },
        { provide: AcceptPrivacyTermsUseCase, useValue: {} },
        {
          provide: PrivacyTermsRepository,
          useValue: { findCurrent: async () => null },
        },
        { provide: USER_REPOSITORY, useValue: users },
        { provide: REFRESH_TOKEN_REPOSITORY, useValue: sessions },
        { provide: PASSWORD_HASHER, useValue: new FakePasswordHasher() },
        { provide: TOKEN_SERVICE, useValue: tokenService },
        { provide: SESSION_CACHE, useValue: sessionCache },
        {
          provide: GetPrincipalUseCase,
          useValue: { execute: async () => principal },
        },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: PermissionsGuard },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('PATCH /api/v1/auth/me/password', () => {
    it('cambia la contraseña y revoca la sesión', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/auth/me/password')
        .set('Authorization', TOKEN)
        .send({ currentPassword: 'Password123', newPassword: 'NuevaSegura123' })
        .expect(204);

      const updated = await users.findById('user-1');
      expect(updated?.passwordHash).toBe('hashed:NuevaSegura123');
      expect(sessions.all[0].isActive()).toBe(false);
    });

    it('rechaza una contraseña actual incorrecta', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/v1/auth/me/password')
        .set('Authorization', TOKEN)
        .send({
          currentPassword: 'Incorrecta123',
          newPassword: 'NuevaSegura123',
        })
        .expect(401);

      expect(response.body.error.code).toBe('INCORRECT_CURRENT_PASSWORD');
      expect((await users.findById('user-1'))?.passwordHash).toBe('hashed:Password123');
    });

    it('rechaza una nueva contraseña que no cumple la política', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/auth/me/password')
        .set('Authorization', TOKEN)
        .send({ currentPassword: 'Password123', newPassword: 'debil' })
        .expect(400);
    });

    it('requiere autenticación', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/auth/me/password')
        .send({ currentPassword: 'Password123', newPassword: 'NuevaSegura123' })
        .expect(401);
    });
  });

  describe('PATCH /api/v1/auth/me/name', () => {
    it('cambia el nombre completo', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/auth/me/name')
        .set('Authorization', TOKEN)
        .send({ fullName: '  Ana Pérez  ' })
        .expect(204);

      expect((await users.findById('user-1'))?.fullName).toBe('Ana Pérez');
    });

    it('rechaza un nombre fuera de los límites permitidos', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/auth/me/name')
        .set('Authorization', TOKEN)
        .send({ fullName: 'A' })
        .expect(400);
    });

    it('requiere autenticación', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/auth/me/name')
        .send({ fullName: 'Ana Pérez' })
        .expect(401);
    });
  });
});
