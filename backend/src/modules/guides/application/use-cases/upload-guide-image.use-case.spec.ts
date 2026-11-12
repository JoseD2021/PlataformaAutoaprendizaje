import { Permission } from '../../../users/domain/enums/permission.enum';
import {
  CannotManageGuideError,
  InvalidGuideImageError,
} from '../../domain/errors/guide.errors';
import { UploadGuideImageUseCase } from './upload-guide-image.use-case';
import { InMemoryGuideImageRepository } from '../../../../../test/support/fakes';

const actor = { permissions: [Permission.GUIDES_CREATE] };

const input = {
  fileName: 'paso-1.png',
  mimeType: 'image/png',
  data: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
};

const build = (images = new InMemoryGuideImageRepository()) => ({
  images,
  useCase: new UploadGuideImageUseCase(images),
});

describe('UploadGuideImageUseCase', () => {
  it('guarda la imagen y devuelve su modelo', async () => {
    const { images, useCase } = build();

    const result = await useCase.execute(input, actor);

    expect(result).toMatchObject({
      fileName: 'paso-1.png',
      mimeType: 'image/png',
      size: input.data.length,
    });
    expect(result.id).toBeTruthy();
    expect(images.all).toHaveLength(1);
  });

  it('rechaza al actor sin permiso y no guarda nada', async () => {
    const { images, useCase } = build();

    await expect(useCase.execute(input, { permissions: [] })).rejects.toBeInstanceOf(
      CannotManageGuideError,
    );
    expect(images.all).toHaveLength(0);
  });

  it('rechaza un formato no permitido y no guarda nada', async () => {
    const { images, useCase } = build();

    await expect(
      useCase.execute({ ...input, mimeType: 'application/pdf' }, actor),
    ).rejects.toBeInstanceOf(InvalidGuideImageError);
    expect(images.all).toHaveLength(0);
  });
});
