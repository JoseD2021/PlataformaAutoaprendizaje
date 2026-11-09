import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import { GetRoomInfoUseCase } from '../src/modules/room-info/application/use-cases/get-room-info.use-case';
import { ROOM_INFO_REPOSITORY } from '../src/modules/room-info/domain/repositories/room-info.repository';
import { RoomInfoController } from '../src/modules/room-info/presentation/controllers/room-info.controller';
import { InMemoryRoomInfoRepository, makeRoomRule, makeScheduleEntry } from './support/fakes';

describe('Información de la sala (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
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

    const moduleRef = await Test.createTestingModule({
      controllers: [RoomInfoController],
      providers: [GetRoomInfoUseCase, { provide: ROOM_INFO_REPOSITORY, useValue: repository }],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/sala/informacion devuelve el contrato del front, ordenado', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/sala/informacion')
      .expect(200);

    expect(response.body).toEqual({
      horarios: [
        { dias: 'Lunes a viernes', horas: '8:00 a.m. a 5:00 p.m.' },
        { dias: 'Sábado', horas: '9:00 a.m. a 12:00 m.' },
      ],
      normas: ['Pide ayuda a un monitor si te pierdes.', 'Cierra tu sesión al terminar.'],
    });
  });
});