import { GuideStatus } from '../enums/guide-status.enum';
import { InvalidGuideError, InvalidGuideStepError } from '../errors/guide.errors';
import { GuideStep } from './guide-step.entity';
import { Guide } from './guide.entity';

const step = (position: number, overrides: Partial<Parameters<typeof GuideStep.create>[0]> = {}) =>
  GuideStep.create({
    id: `step-${position}`,
    position,
    shortTitle: 'Redactar',
    action: 'Haz clic en el botón Redactar',
    description: 'Está arriba a la izquierda.',
    ...overrides,
  });

const baseGuide = {
  id: 'enviar-correo-foto',
  title: 'Enviar un correo con una foto',
  categoryId: 'correo',
  estimatedMinutes: 3,
};

describe('GuideStep', () => {
  it('rechaza un título corto de más de 20 caracteres', () => {
    expect(() => step(1, { shortTitle: 'x'.repeat(21) })).toThrow(InvalidGuideStepError);
  });

  it('rechaza un pie de imagen sin imagen', () => {
    expect(() => step(1, { imageCaption: 'Así se verá' })).toThrow(InvalidGuideStepError);
  });

  it('acepta un paso con imagen y pie', () => {
    const s = step(1, { imageUrl: '/img/redactar.png', imageCaption: 'Así se verá' });
    expect(s.imageUrl).toBe('/img/redactar.png');
  });
});

describe('Guide', () => {
  it('se crea en borrador y calcula totalSteps', () => {
    const guide = Guide.create({ ...baseGuide, steps: [step(1), step(2), step(3), step(4)] });
    expect(guide.status).toBe(GuideStatus.DRAFT);
    expect(guide.totalSteps).toBe(4);
  });

  it('rechaza ids que no son slug', () => {
    expect(() => Guide.create({ ...baseGuide, id: 'Enviar Correo' })).toThrow(InvalidGuideError);
  });

  it('rechaza minutos menores a 1', () => {
    expect(() => Guide.create({ ...baseGuide, estimatedMinutes: 0 })).toThrow(InvalidGuideError);
  });

  it('rechaza posiciones no consecutivas', () => {
    expect(() => Guide.create({ ...baseGuide, steps: [step(1), step(3)] })).toThrow(
      InvalidGuideError,
    );
  });

  it('no permite publicar sin pasos', () => {
    const guide = Guide.create(baseGuide);
    expect(() => guide.publish()).toThrow(InvalidGuideError);
  });

  it('publica una guía con pasos', () => {
    const guide = Guide.create({ ...baseGuide, steps: [step(1)] });
    guide.publish();
    expect(guide.status).toBe(GuideStatus.PUBLISHED);
  });
});