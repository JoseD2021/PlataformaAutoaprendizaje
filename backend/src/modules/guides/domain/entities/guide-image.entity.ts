import {
  ALLOWED_GUIDE_IMAGE_MIME_TYPES,
  MAX_GUIDE_IMAGE_SIZE_BYTES,
  type AllowedGuideImageMimeType,
} from '../constants/guide-image.limits';
import { InvalidGuideImageError } from '../errors/guide.errors';

export interface GuideImageProps {
  id: string;
  fileName: string;
  mimeType: string;
  data: Buffer;
  createdAt?: Date;
}

export class GuideImage {
  static readonly MAX_FILE_NAME_LENGTH = 255;

  readonly id: string;
  readonly fileName: string;
  readonly mimeType: AllowedGuideImageMimeType;
  readonly size: number;
  readonly data: Buffer;
  readonly createdAt: Date;

  private constructor(props: {
    id: string;
    fileName: string;
    mimeType: AllowedGuideImageMimeType;
    data: Buffer;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.fileName = props.fileName;
    this.mimeType = props.mimeType;
    this.size = props.data.length;
    this.data = props.data;
    this.createdAt = props.createdAt;
  }

  static create(props: GuideImageProps): GuideImage {
    const id = props.id?.trim() ?? '';
    const fileName = props.fileName?.trim() ?? '';
    const mimeType = props.mimeType?.trim().toLowerCase() ?? '';
    const data = props.data;

    if (!id) {
      throw new InvalidGuideImageError('El id de la imagen es obligatorio');
    }
    if (!fileName) {
      throw new InvalidGuideImageError('El nombre del archivo es obligatorio');
    }
    if (fileName.length > GuideImage.MAX_FILE_NAME_LENGTH) {
      throw new InvalidGuideImageError(
        `El nombre del archivo no puede superar ${GuideImage.MAX_FILE_NAME_LENGTH} caracteres`,
      );
    }
    if (!data || data.length === 0) {
      throw new InvalidGuideImageError('El archivo de la imagen está vacío');
    }
    if (data.length > MAX_GUIDE_IMAGE_SIZE_BYTES) {
      throw new InvalidGuideImageError(
        `La imagen no puede superar ${MAX_GUIDE_IMAGE_SIZE_BYTES / (1024 * 1024)} MB`,
      );
    }
    if (!ALLOWED_GUIDE_IMAGE_MIME_TYPES.includes(mimeType as AllowedGuideImageMimeType)) {
      throw new InvalidGuideImageError(
        `Formato de imagen no permitido. Usa ${ALLOWED_GUIDE_IMAGE_MIME_TYPES.join(', ')}`,
      );
    }

    return new GuideImage({
      id,
      fileName,
      mimeType: mimeType as AllowedGuideImageMimeType,
      data,
      createdAt: props.createdAt ?? new Date(),
    });
  }
}
