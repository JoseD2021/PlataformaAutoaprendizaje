import type { GuideImage } from '../entities/guide-image.entity';

export abstract class GuideImageRepository {
  abstract save(image: GuideImage): Promise<GuideImage>;
  abstract findById(id: string): Promise<GuideImage | null>;
}

export const GUIDE_IMAGE_REPOSITORY = Symbol('GUIDE_IMAGE_REPOSITORY');
