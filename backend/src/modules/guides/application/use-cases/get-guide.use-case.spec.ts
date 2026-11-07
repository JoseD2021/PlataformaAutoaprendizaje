import { GetGuideUseCase } from './get-guide.use-case';
import { GuideNotFoundError } from '../errors/guide.errors';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import {
  InMemoryGuideRepository,
  makeGuide,
  makeGuideStep,
} from '../../../../../test/support/fakes';

describe('GetGuideUseCase', () => {
  it('devuelve la guía con sus pasos en orden', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({
        id: 'responder-correo',
        steps: [
          makeGuideStep({ id: 's1', position: 1, shortTitle: 'Abrir' }),
          makeGuideStep({
            id: 's2',
            position: 2,
            shortTitle: 'Responder',
            imageUrl: '/img/responder.png',
            imageCaption: 'Así se verá en tu pantalla.',
          }),
        ],
      }),
    ]);
    const useCase = new GetGuideUseCase(guides);

    const result = await useCase.execute('responder-correo');

    expect(result.id).toBe('responder-correo');
    expect(result.totalSteps).toBe(2);
    expect(result.steps.map((step) => step.shortTitle)).toEqual(['Abrir', 'Responder']);
    expect(result.steps[1].imageCaption).toBe('Así se verá en tu pantalla.');
  });

  it('lanza GuideNotFoundError si la guía no existe', async () => {
    const useCase = new GetGuideUseCase(new InMemoryGuideRepository());

    await expect(useCase.execute('no-existe')).rejects.toBeInstanceOf(GuideNotFoundError);
  });

  it('lanza GuideNotFoundError si la guía está en borrador', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'borrador', status: GuideStatus.DRAFT }),
    ]);
    const useCase = new GetGuideUseCase(guides);

    await expect(useCase.execute('borrador')).rejects.toBeInstanceOf(GuideNotFoundError);
  });
});