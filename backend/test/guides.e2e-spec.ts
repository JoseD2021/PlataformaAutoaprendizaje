import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import { GetGuideUseCase } from '../src/modules/guides/application/use-cases/get-guide.use-case';
import { ListGuidesUseCase } from '../src/modules/guides/application/use-cases/list-guides.use-case';
import { GuideStatus } from '../src/modules/guides/domain/enums/guide-status.enum';
import { GUIDE_REPOSITORY } from '../src/modules/guides/domain/repositories/guide.repository';
import { GuidesController } from '../src/modules/guides/presentation/controllers/guides.controller';
import { InMemoryGuideRepository, makeGuide, makeGuideStep } from './support/fakes';

describe('Guías (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const repository = new InMemoryGuideRepository([
      makeGuide({
        id: 'enviar-correo-foto',
        title: 'Enviar un correo con una foto',
        categoryId: 'correo',
        estimatedMinutes: 3,
        isMostRequested: true,
        steps: [
          makeGuideStep({ id: 's1', position: 1, shortTitle: 'Redactar' }),
          makeGuideStep({ id: 's2', position: 2, shortTitle: 'Para' }),
          makeGuideStep({ id: 's3', position: 3, shortTitle: 'Adjuntar' }),
          makeGuideStep({ id: 's4', position: 4, shortTitle: 'Enviar' }),
        ],
      }),
      makeGuide({ id: 'entrar-correo', title: 'Entrar a mi correo', categoryId: 'correo' }),
      makeGuide({
        id: 'cerrar-sesion',
        title: 'Cerrar sesión al terminar',
        categoryId: 'correo',
        tag: 'Importante en computadores públicos',
      }),
      makeGuide({ id: 'escribir-carta', title: 'Escribir una carta', categoryId: 'documentos' }),
      makeGuide({
        id: 'guia-en-borrador',
        title: 'Guía en borrador',
        categoryId: 'correo',
        status: GuideStatus.DRAFT,
      }),
    ]);

    const moduleRef = await Test.createTestingModule({
      controllers: [GuidesController],
      providers: [
        ListGuidesUseCase,
        GetGuideUseCase,
        { provide: GUIDE_REPOSITORY, useValue: repository },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/guides', () => {
    it('lista las guías publicadas con el formato del front, más pedidas primero', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/guides').expect(200);

      expect(response.body).toMatchObject({ total: 4, page: 1, limit: 20 });
      expect(response.body.items.map((item: { id: string }) => item.id)).toEqual([
        'enviar-correo-foto',
        'cerrar-sesion',
        'entrar-correo',
        'escribir-carta',
      ]);
      expect(response.body.items[0]).toEqual({
        id: 'enviar-correo-foto',
        titulo: 'Enviar un correo con una foto',
        categoriaId: 'correo',
        totalPasos: 4,
        minutosEstimados: 3,
        esMasPedida: true,
      });
    });

    it('incluye la etiqueta solo cuando la guía la tiene', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/guides').expect(200);
      const byId = new Map<string, Record<string, unknown>>(
        response.body.items.map((item: { id: string }) => [item.id, item]),
      );

      expect(byId.get('cerrar-sesion')?.etiqueta).toBe('Importante en computadores públicos');
      expect(byId.get('entrar-correo')).not.toHaveProperty('etiqueta');
    });

    it('no muestra guías en borrador', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/guides').expect(200);
      const ids = response.body.items.map((item: { id: string }) => item.id);

      expect(ids).not.toContain('guia-en-borrador');
    });

    it('filtra por categoría', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/guides')
        .query({ categoriaId: 'documentos' })
        .expect(200);

      expect(response.body.items.map((item: { id: string }) => item.id)).toEqual([
        'escribir-carta',
      ]);
    });

    it('busca por palabra clave en el título', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/guides')
        .query({ q: 'CORREO' })
        .expect(200);

      expect(response.body.items.map((item: { id: string }) => item.id)).toEqual([
        'enviar-correo-foto',
        'entrar-correo',
      ]);
    });

    it('pagina los resultados', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/guides')
        .query({ page: 2, limit: 3 })
        .expect(200);

      expect(response.body).toMatchObject({ total: 4, page: 2, limit: 3 });
      expect(response.body.items).toHaveLength(1);
    });

    it.each([
      ['page en cero', { page: 0 }],
      ['page no numérico', { page: 'abc' }],
      ['limit por encima del máximo', { limit: 500 }],
      ['parámetro desconocido', { foo: 'bar' }],
    ])('responde 400 con %s', async (_name, query) => {
      await request(app.getHttpServer()).get('/api/v1/guides').query(query).expect(400);
    });
  });

  describe('GET /api/v1/guides/:id', () => {
    it('devuelve la guía con sus pasos en orden', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/guides/enviar-correo-foto')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 'enviar-correo-foto',
        titulo: 'Enviar un correo con una foto',
        totalPasos: 4,
      });
      expect(response.body.pasos.map((paso: { orden: number }) => paso.orden)).toEqual([
        1, 2, 3, 4,
      ]);
      expect(
        response.body.pasos.map((paso: { tituloCorto: string }) => paso.tituloCorto),
      ).toEqual(['Redactar', 'Para', 'Adjuntar', 'Enviar']);
      expect(response.body.pasos[0]).toEqual({
        orden: 1,
        tituloCorto: 'Redactar',
        accion: 'Haz clic en el botón Redactar',
        descripcion: 'Está arriba a la izquierda y tiene un lápiz dibujado.',
      });
    });

    it('responde 404 si la guía no existe', async () => {
      await request(app.getHttpServer()).get('/api/v1/guides/no-existe').expect(404);
    });

    it('responde 404 si la guía está en borrador', async () => {
      await request(app.getHttpServer()).get('/api/v1/guides/guia-en-borrador').expect(404);
    });

    it('responde 400 si el id no tiene formato válido', async () => {
      await request(app.getHttpServer()).get('/api/v1/guides/Mal_Id').expect(400);
    });
  });
});