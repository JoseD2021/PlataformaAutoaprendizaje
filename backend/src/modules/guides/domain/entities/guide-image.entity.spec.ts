import { MAX_GUIDE_IMAGE_SIZE_BYTES } from '../constants/guide-image.limits';
import { InvalidGuideImageError } from '../errors/guide.errors';
import { GuideImage } from './guide-image.entity';

const base = {
  id: '8d9b7d6e-4b1a-4f3e-9c2a-1b2c3d4e5f60',
  fileName: 'paso-1.png',
  mimeType: 'image/png',
  data: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
};

describe('GuideImage', () => {
  it('calcula el tamaño a partir de los bytes y normaliza el mime type', () => {
    const image = GuideImage.create({ ...base, mimeType: 'IMAGE/PNG' });

    expect(image.size).toBe(base.data.length);
    expect(image.mimeType).toBe('image/png');
  });

  it('rechaza un archivo vacío', () => {
    expect(() => GuideImage.create({ ...base, data: Buffer.alloc(0) })).toThrow(
      InvalidGuideImageError,
    );
  });

  it('rechaza una imagen que supera el tamaño máximo', () => {
    expect(() =>
      GuideImage.create({ ...base, data: Buffer.alloc(MAX_GUIDE_IMAGE_SIZE_BYTES + 1) }),
    ).toThrow(InvalidGuideImageError);
  });

  it('rechaza formatos que no son imágenes permitidas', () => {
    expect(() => GuideImage.create({ ...base, mimeType: 'image/svg+xml' })).toThrow(
      InvalidGuideImageError,
    );
  });

  it('rechaza un nombre de archivo vacío', () => {
    expect(() => GuideImage.create({ ...base, fileName: '   ' })).toThrow(InvalidGuideImageError);
  });
});
