import { ApiProperty } from '@nestjs/swagger';
import type { GuideImageModel } from '../../application/models/guide-image.model';

export function guideImageUrl(id: string): string {
  return `/api/v1/guides/images/${id}`;
}

export class GuiaImagenResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    example: '/api/v1/guides/images/8d9b7d6e-4b1a-4f3e-9c2a-1b2c3d4e5f60',
    description: 'Ruta pública que se puede usar en imagenUrl de un paso.',
  })
  url: string;

  @ApiProperty({ example: 'paso-1.png' })
  nombreArchivo: string;

  @ApiProperty({ example: 'image/png' })
  tipoMime: string;

  @ApiProperty({ example: 20480 })
  tamanoBytes: number;

  static from(source: GuideImageModel): GuiaImagenResponseDto {
    return Object.assign(new GuiaImagenResponseDto(), {
      id: source.id,
      url: guideImageUrl(source.id),
      nombreArchivo: source.fileName,
      tipoMime: source.mimeType,
      tamanoBytes: source.size,
    });
  }
}
