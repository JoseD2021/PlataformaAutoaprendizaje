import type { GuideImage } from '../../domain/entities/guide-image.entity';

export interface GuideImageModel {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
}

export interface GuideImageContentModel extends GuideImageModel {
  data: Buffer;
}

export function toGuideImageModel(image: GuideImage): GuideImageModel {
  return {
    id: image.id,
    fileName: image.fileName,
    mimeType: image.mimeType,
    size: image.size,
    createdAt: image.createdAt,
  };
}

export function toGuideImageContentModel(image: GuideImage): GuideImageContentModel {
  return {
    ...toGuideImageModel(image),
    data: image.data,
  };
}
