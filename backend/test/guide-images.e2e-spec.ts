import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import { ChangeGuideStatusUseCase } from '../src/modules/guides/application/use-cases/change-guide-status.use-case';
import { CreateGuideUseCase } from '../src/modules/guides/application/use-cases/create-guide.use-case';
import { DeleteGuideUseCase } from '../src/modules/guides/application/use-cases/delete-guide.use-case';
import { GetGuideImageUseCase } from '../src/modules/guides/application/use-cases/get-guide-image.use-case';
import { GetManagedGuideUseCase } from '../src/modules/guides/application/use-cases/get-managed-guide.use-case';
import { ListManagedGuidesUseCase } from '../src/modules/guides/application/use-cases/list-managed-guides.use-case';
import { UpdateGuideUseCase } from '../src/modules/guides/application/use-cases/update-guide.use-case';
import { UploadGuideImageUseCase } from '../src/modules/guides/application/use-cases/upload-guide-image.use-case';
import { GUIDE_IMAGE_REPOSITORY } from '../src/modules/guides/domain/repositories/guide-image.repository';
import { GuideImagesController } from '../src/modules/guides/presentation/controllers/guide-images.controller';
import { GuidesManagementController } from '../src/modules/guides/presentation/controllers/guides-management.controller';
import { GetPrincipalUseCase } from '../src/modules/users/application/use-cases/get-principal.use-case';
import { Permission } from '../src/modules/users/domain/enums/permission.enum';
import { Role } from '../src/modules/users/domain/enums/role.enum';
import { UnauthorizedError } from '../src/shared/application/errors/common.errors';
import type { AuthenticatedUser } from '../src/shared/application/models/authenticated-user.model';
import { SESSION_CACHE } from '../src/shared/application/ports/session-cache.port';
import { TOKEN_SERVICE } from '../src/shared/application/ports/token-service.port';
import { JwtAuthGuard } from '../src/shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/shared/presentation/guards/permissions.guard';
import { InMemoryGuideImageRepository } from './support/fakes';

const principals: Record<string, AuthenticatedUser> = {
  'user-staff': {
    id: 'user-staff',
    email: 'personal@clena.local',
    fullName: 'Personal de Prueba',
    role: Role.PERSONAL_CLENA,
    roleName: 'Personal del CLENA',
    roleRank: 20,
    permissions: [Permission.GUIDES_CREATE, Permission.GUIDES_MANAGE],
  },
  'user-public': {
    id: 'user-public',
    email: 'usuario@clena.local',
    fullName: 'Usuario de Prueba',
    role: Role.USUARIO,
    roleName: 'Usuario común',
    roleRank: 10,
    permissions: [Permission.FAVORITES_MANAGE],
  },
};

const tokens: Record<string, { sub: string; sid: string }> = {
  'token-staff': { sub: 'user-staff', sid: 'sid-staff' },
  'token-public': { sub: 'user-public', sid: 'sid-public' },
};

const STAFF = 'Bearer token-staff';
const PUBLIC_USER = 'Bearer token-public';

const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe('Imágenes de guías (e2e)', () => {
  let app: INestApplication<App>;
  let repository: InMemoryGuideImageRepository;

  beforeEach(async () => {
    repository = new InMemoryGuideImageRepository();

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
      controllers: [GuidesManagementController, GuideImagesController],
      providers: [
        UploadGuideImageUseCase,
        GetGuideImageUseCase,
        { provide: GUIDE_IMAGE_REPOSITORY, useValue: repository },
        { provide: ListManagedGuidesUseCase, useValue: {} },
        { provide: GetManagedGuideUseCase, useValue: {} },
        { provide: CreateGuideUseCase, useValue: {} },
        { provide: UpdateGuideUseCase, useValue: {} },
        { provide: ChangeGuideStatusUseCase, useValue: {} },
        { provide: DeleteGuideUseCase, useValue: {} },
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

  describe('POST /api/v1/management/guides/images', () => {
    it('sube una imagen, la guarda y devuelve la url pública', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/management/guides/images')
        .set('Authorization', STAFF)
        .attach('file', pngBytes, { filename: 'paso-1.png', contentType: 'image/png' })
        .expect(201);

      expect(response.body).toMatchObject({
        nombreArchivo: 'paso-1.png',
        tipoMime: 'image/png',
        tamanoBytes: pngBytes.length,
      });
      expect(response.body.url).toBe(`/api/v1/guides/images/${response.body.id}`);
      expect(repository.all).toHaveLength(1);
    });

    it('responde 401 sin token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/management/guides/images')
        .attach('file', pngBytes, { filename: 'paso-1.png', contentType: 'image/png' })
        .expect(401);
    });

    it('responde 403 sin el permiso y no guarda nada', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/management/guides/images')
        .set('Authorization', PUBLIC_USER)
        .attach('file', pngBytes, { filename: 'paso-1.png', contentType: 'image/png' })
        .expect(403);

      expect(repository.all).toHaveLength(0);
    });

    it('responde 400 si no se adjunta el archivo', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/management/guides/images')
        .set('Authorization', STAFF)
        .expect(400);
    });

    it('responde 422 si el archivo no es una imagen permitida', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/management/guides/images')
        .set('Authorization', STAFF)
        .attach('file', Buffer.from('%PDF-1.7'), {
          filename: 'documento.pdf',
          contentType: 'application/pdf',
        })
        .expect(422);

      expect(repository.all).toHaveLength(0);
    });
  });

  describe('GET /api/v1/guides/images/:id', () => {
    it('devuelve el contenido binario de la imagen', async () => {
      const upload = await request(app.getHttpServer())
        .post('/api/v1/management/guides/images')
        .set('Authorization', STAFF)
        .attach('file', pngBytes, { filename: 'paso-1.png', contentType: 'image/png' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(upload.body.url)
        .expect(200);

      expect(response.headers['content-type']).toBe('image/png');
      expect(Buffer.from(response.body)).toEqual(pngBytes);
    });

    it('responde 404 si la imagen no existe', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/guides/images/00000000-0000-4000-8000-000000000000')
        .expect(404);
    });

    it('responde 400 si el id no es un uuid', async () => {
      await request(app.getHttpServer()).get('/api/v1/guides/images/no-es-uuid').expect(400);
    });
  });
});
