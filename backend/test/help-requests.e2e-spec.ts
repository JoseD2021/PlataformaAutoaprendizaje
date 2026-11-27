import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import { GUIDE_REPOSITORY } from '../src/modules/guides/domain/repositories/guide.repository';
import { CreateHelpRequestUseCase } from '../src/modules/help-requests/application/use-cases/create-help-request.use-case';
import { ListPendingHelpRequestsUseCase } from '../src/modules/help-requests/application/use-cases/list-pending-help-requests.use-case';
import { ResolveHelpRequestUseCase } from '../src/modules/help-requests/application/use-cases/resolve-help-request.use-case';
import { HELP_REQUEST_REPOSITORY } from '../src/modules/help-requests/domain/repositories/help-request.repository';
import { HelpRequestsController } from '../src/modules/help-requests/presentation/controllers/help-requests.controller';
import { GetPrincipalUseCase } from '../src/modules/users/application/use-cases/get-principal.use-case';
import { Permission } from '../src/modules/users/domain/enums/permission.enum';
import { Role } from '../src/modules/users/domain/enums/role.enum';
import { UnauthorizedError } from '../src/shared/application/errors/common.errors';
import type { AuthenticatedUser } from '../src/shared/application/models/authenticated-user.model';
import { SESSION_CACHE } from '../src/shared/application/ports/session-cache.port';
import { TOKEN_SERVICE } from '../src/shared/application/ports/token-service.port';
import { JwtAuthGuard } from '../src/shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/shared/presentation/guards/permissions.guard';
import {
  InMemoryGuideRepository,
  InMemoryHelpRequestRepository,
  makeGuide,
} from './support/fakes';

const principals: Record<string, AuthenticatedUser> = {
  'user-staff': {
    id: 'user-staff',
    email: 'personal@clena.local',
    fullName: 'Personal de Prueba',
    role: Role.PERSONAL_CLENA,
    roleName: 'Personal del CLENA',
    roleRank: 20,
    permissions: [Permission.HELP_REQUESTS_READ, Permission.HELP_REQUESTS_MANAGE],
  },
  'user-public': {
    id: 'user-public',
    email: 'usuario@clena.local',
    fullName: 'Ana Pérez',
    role: Role.USUARIO,
    roleName: 'Usuario común',
    roleRank: 10,
    permissions: [Permission.FAVORITES_MANAGE, Permission.HELP_REQUESTS_CREATE],
  },
};

const tokens: Record<string, { sub: string; sid: string }> = {
  'token-staff': { sub: 'user-staff', sid: 'sid-staff' },
  'token-public': { sub: 'user-public', sid: 'sid-public' },
};

const STAFF = 'Bearer token-staff';
const PUBLIC_USER = 'Bearer token-public';

describe('Solicitudes de ayuda (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const tokenService = {
      verifyAccessToken: async (token: string) => {
        const claims = tokens[token];

        if (!claims) {
          throw new UnauthorizedError('Token inválido.');
        }

        return { ...claims, type: 'access' };
      },
    };
    const sessionCache = {
      findActive: async (sid: string) => {
        const entry = Object.values(tokens).find((claims) => claims.sid === sid);

        return entry ? { userId: entry.sub } : null;
      },
    };
    const getPrincipal = { execute: async (userId: string) => principals[userId] };

    const moduleRef = await Test.createTestingModule({
      controllers: [HelpRequestsController],
      providers: [
        CreateHelpRequestUseCase,
        ListPendingHelpRequestsUseCase,
        ResolveHelpRequestUseCase,
        { provide: HELP_REQUEST_REPOSITORY, useValue: new InMemoryHelpRequestRepository() },
        {
          provide: GUIDE_REPOSITORY,
          useValue: new InMemoryGuideRepository([
            makeGuide({ id: 'enviar-correo-foto', title: 'Enviar un correo con una foto' }),
          ]),
        },
        { provide: TOKEN_SERVICE, useValue: tokenService },
        { provide: SESSION_CACHE, useValue: sessionCache },
        { provide: GetPrincipalUseCase, useValue: getPrincipal },
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

  describe('POST /api/v1/help-requests', () => {
    it('es público: crea la solicitud sin token y sin nombre', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/help-requests')
        .send({ puesto: 5, guiaId: 'enviar-correo-foto', paso: 1 })
        .expect(201);

      expect(response.body).toMatchObject({
        puesto: 5,
        guiaId: 'enviar-correo-foto',
        guiaTitulo: 'Enviar un correo con una foto',
        paso: 1,
        solicitante: null,
        estado: 'pending',
      });
    });

    it('con sesión iniciada guarda el nombre del usuario', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/help-requests')
        .set('Authorization', PUBLIC_USER)
        .send({})
        .expect(201);

      expect(response.body.solicitante).toBe('Ana Pérez');
      expect(response.body.puesto).toBeNull();
    });

    it('con un token inválido no falla: la trata como anónima', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/help-requests')
        .set('Authorization', 'Bearer token-falso')
        .send({ puesto: 2 })
        .expect(201);

      expect(response.body.solicitante).toBeNull();
    });

    it('responde 400 con un puesto inválido', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/help-requests')
        .send({ puesto: 0 })
        .expect(400);
    });
  });

  describe('GET /api/v1/help-requests/pending', () => {
    it('responde 401 sin token y 403 sin permiso', async () => {
      await request(app.getHttpServer()).get('/api/v1/help-requests/pending').expect(401);
      await request(app.getHttpServer())
        .get('/api/v1/help-requests/pending')
        .set('Authorization', PUBLIC_USER)
        .expect(403);
    });

    it('el personal ve las solicitudes pendientes', async () => {
      await request(app.getHttpServer()).post('/api/v1/help-requests').send({ puesto: 5 });

      const response = await request(app.getHttpServer())
        .get('/api/v1/help-requests/pending')
        .set('Authorization', STAFF)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].puesto).toBe(5);
    });
  });

  describe('PATCH /api/v1/help-requests/:id/resolve', () => {
    it('el personal la marca como atendida y desaparece de pendientes', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/v1/help-requests')
        .send({ puesto: 5 });

      await request(app.getHttpServer())
        .patch(`/api/v1/help-requests/${created.body.id}/resolve`)
        .set('Authorization', STAFF)
        .expect(204);

      const pending = await request(app.getHttpServer())
        .get('/api/v1/help-requests/pending')
        .set('Authorization', STAFF);

      expect(pending.body).toEqual([]);
    });

    it('responde 403 a un usuario común', async () => {
      const created = await request(app.getHttpServer())
        .post('/api/v1/help-requests')
        .send({ puesto: 5 });

      await request(app.getHttpServer())
        .patch(`/api/v1/help-requests/${created.body.id}/resolve`)
        .set('Authorization', PUBLIC_USER)
        .expect(403);
    });

    it('responde 404 si no existe', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/help-requests/22222222-2222-4222-8222-222222222222/resolve')
        .set('Authorization', STAFF)
        .expect(404);
    });
  });
});
