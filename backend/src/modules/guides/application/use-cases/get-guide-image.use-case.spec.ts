import { GuideImageNotFoundError } from '../errors/guide.errors';
import { GetGuideImageUseCase } from './get-guide-image.use-case';
import { InMemoryGuideImageRepository, makeGuideImage } from '../../../../../test/support/fakes';

const image = makeGuideImage();

const build = (images = new InMemoryGuideImageRepository([image])) => ({
  images,
  useCase: new GetGuideImageUseCase(images),
});

describe('GetGuideImageUseCase', () => {
  it('devuelve el contenido binario de la imagen', async () => {
    const { useCase } = build();

    const result = await useCase.execute(image.id);

    expect(result.mimeType).toBe('image/png');
    expect(result.fileName).toBe('paso-1.png');
    expect(result.data).toEqual(image.data);
  });

  it('lanza un error 404 si la imagen no existe', async () => {
    const { useCase } = build();

    await expect(
      useCase.execute('00000000-0000-4000-8000-000000000000'),
    ).rejects.toBeInstanceOf(GuideImageNotFoundError);
  });
});
