import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import { GetRoomInfoUseCase } from '../src/modules/room-info/application/use-cases/get-room-info.use-case';
import { UpdateRoomInfoUseCase } from '../src/modules/room-info/application/use-cases/update-room-info.use-case';
import { ROOM_INFO_REPOSITORY } from '../src/modules/room-info/domain/repositories/room-info.repository';
import { RoomInfoController } from '../src/modules/room-info/presentation/controllers/room-info.controller';
import { GetPrincipalUseCase } from '../src/modules/users/application/use-cases/get-principal.use-case';
import { Permission } from '../src/modules/users/domain/enums/permission.enum';
import { Role } from '../src/modules/users/domain/enums/role.enum';
import { UnauthorizedError } from '../src/shared/application/errors/common.errors';
import type { AuthenticatedUser } from '../src/shared/application/models/authenticated-user.model';
import { SESSION_CACHE } from '../src/shared/application/ports/session-cache.port';
import { TOKEN_SERVICE } from '../src/shared/application/ports/token-service.port';
import { JwtAuthGuard } from '../src/shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../src/shared/presentation/guards/permissions.guard';
import { InMemoryRoomInfoRepository, makeRoomRule, makeScheduleEntry } from './support/fakes';

const principals: Record<string, AuthenticatedUser> = {
  'user-staff': {
    id: 'user-staff',
    email: 'personal@clena.local',
    fullName: 'Personal de Prueba',
    role: Role.PERSONAL_CLENA,
    roleName: 'Personal del CLENA',
    roleRank: 20,
    permissions: [Permission.ROOM_INFO_MANAGE],
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

const infoInicial = {
  horarios: [
    { dias: 'Lunes a viernes', horas: '8:00 a.m. a 5:00 p.m.' },
    { dias: 'Sábado', horas: '9:00 a.m. a 12:00 m.' },
  ],
  normas: ['Pide ayuda a un monitor si te pierdes.', 'Cierra tu sesión al terminar.'],
};

const infoNueva = {
  horarios: [
    { dias: 'Lunes a sábado', horas: '7:00 a.m. a 6:00 p.m.' },
    { dias: 'Domingo y festivos', horas: 'Cerrado' },
  ],
  normas: ['Mantén el volumen bajo o usa audífonos.'],
};

describe('Información de la sala (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const repository = new InMemoryRoomInfoRepository({
      schedules: [
        makeScheduleEntry({ id: 'h2', days: 'Sábado', hours: '9:00 a.m. a 12:00 m.', order: 2 }),
        makeScheduleEntry({ id: 'h1', days: 'Lunes a viernes', hours: '8:00 a.m. a 5:00 p.m.', order: 1 }),
      ],
      rules: [
        makeRoomRule({ id: 'r2', text: 'Cierra tu sesión al terminar.', order: 2 }),
        makeRoomRule({ id: 'r1', text: 'Pide ayuda a un monitor si te pierdes.', order: 1 }),
      ],
    });

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
      controllers: [RoomInfoController],
      providers: [
        GetRoomInfoUseCase,
        UpdateRoomInfoUseCase,
        { provide: ROOM_INFO_REPOSITORY, useValue: repository },
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

  describe('GET /api/v1/sala/informacion', () => {
    it('es público y devuelve el contrato del front, ordenado', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/sala/informacion')
        .expect(200);

      expect(response.body).toEqual(infoInicial);
    });
  });

  describe('PUT /api/v1/sala/informacion', () => {
    it('responde 401 sin token', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .send(infoNueva)
        .expect(401);
    });

    it('responde 401 con un token desconocido', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .set('Authorization', 'Bearer token-falso')
        .send(infoNueva)
        .expect(401);
    });

    it('responde 403 sin el permiso y no cambia nada', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .set('Authorization', PUBLIC_USER)
        .send(infoNueva)
        .expect(403);

      const response = await request(app.getHttpServer()).get('/api/v1/sala/informacion');

      expect(response.body).toEqual(infoInicial);
    });

    it('reemplaza horarios y normas, y el GET público lo refleja', async () => {
      const put = await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .set('Authorization', STAFF)
        .send(infoNueva)
        .expect(200);

      expect(put.body).toEqual(infoNueva);

      const get = await request(app.getHttpServer()).get('/api/v1/sala/informacion').expect(200);

      expect(get.body).toEqual(infoNueva);
    });

    it('conserva el orden del arreglo como orden de visualización', async () => {
      const invertida = {
        horarios: [...infoInicial.horarios].reverse(),
        normas: [...infoInicial.normas].reverse(),
      };

      await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .set('Authorization', STAFF)
        .send(invertida)
        .expect(200);

      const get = await request(app.getHttpServer()).get('/api/v1/sala/informacion');

      expect(get.body).toEqual(invertida);
    });

    it('permite dejar ambas listas vacías', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .set('Authorization', STAFF)
        .send({ horarios: [], normas: [] })
        .expect(200);

      const get = await request(app.getHttpServer()).get('/api/v1/sala/informacion');

      expect(get.body).toEqual({ horarios: [], normas: [] });
    });

    it.each([
      ['horarios que no es un arreglo', { horarios: 'texto', normas: [] }],
      ['normas que no es un arreglo', { horarios: [], normas: 'texto' }],
      ['falta la lista de normas', { horarios: [] }],
      ['campo desconocido', { horarios: [], normas: [], extra: 1 }],
      ['horario sin días', { horarios: [{ horas: '8:00 a.m.' }], normas: [] }],
      ['norma vacía', { horarios: [], normas: [''] }],
      [
        'más de 20 horarios',
        {
          horarios: Array.from({ length: 21 }, (_, i) => ({ dias: `Día ${i}`, horas: '8:00 a.m.' })),
          normas: [],
        },
      ],
      [
        'más de 30 normas',
        { horarios: [], normas: Array.from({ length: 31 }, (_, i) => `Norma ${i}`) },
      ],
    ])('responde 400 con %s y no cambia nada', async (_name, body) => {
      await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .set('Authorization', STAFF)
        .send(body)
        .expect(400);

      const get = await request(app.getHttpServer()).get('/api/v1/sala/informacion');

      expect(get.body).toEqual(infoInicial);
    });

    it('responde 422 si un texto es solo espacios (regla del dominio) y no cambia nada', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/sala/informacion')
        .set('Authorization', STAFF)
        .send({ horarios: [{ dias: '   ', horas: 'Cerrado' }], normas: ['Norma válida.'] })
        .expect(422);

      const get = await request(app.getHttpServer()).get('/api/v1/sala/informacion');

      expect(get.body).toEqual(infoInicial);
    });
  });
});