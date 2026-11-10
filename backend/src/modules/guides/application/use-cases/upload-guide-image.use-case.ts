import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GuideImage } from '../../domain/entities/guide-image.entity';
import {
  GUIDE_IMAGE_REPOSITORY,
  GuideImageRepository,
} from '../../domain/repositories/guide-image.repository';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';
import { toGuideImageModel, type GuideImageModel } from '../models/guide-image.model';

export interface UploadGuideImageInput {
  fileName: string;
  mimeType: string;
  data: Buffer;
}

@Injectable()
export class UploadGuideImageUseCase {
  constructor(
    @Inject(GUIDE_IMAGE_REPOSITORY) private readonly images: GuideImageRepository,
  ) {}

  async execute(input: UploadGuideImageInput, actor: GuideActor): Promise<GuideImageModel> {
    assertGuidePermission(actor, Permission.GUIDES_CREATE);

    const image = GuideImage.create({
      id: randomUUID(),
      fileName: input.fileName,
      mimeType: input.mimeType,
      data: input.data,
    });

    return toGuideImageModel(await this.images.save(image));
  }
}
