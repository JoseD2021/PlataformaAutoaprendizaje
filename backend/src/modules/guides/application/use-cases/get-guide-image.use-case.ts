import { Inject, Injectable } from '@nestjs/common';
import {
  GUIDE_IMAGE_REPOSITORY,
  GuideImageRepository,
} from '../../domain/repositories/guide-image.repository';
import { GuideImageNotFoundError } from '../errors/guide.errors';
import {
  toGuideImageContentModel,
  type GuideImageContentModel,
} from '../models/guide-image.model';

@Injectable()
export class GetGuideImageUseCase {
  constructor(
    @Inject(GUIDE_IMAGE_REPOSITORY) private readonly images: GuideImageRepository,
  ) {}

  async execute(id: string): Promise<GuideImageContentModel> {
    const image = await this.images.findById(id);

    if (!image) {
      throw new GuideImageNotFoundError();
    }

    return toGuideImageContentModel(image);
  }
}
