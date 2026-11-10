import { GuideImage } from '../../domain/entities/guide-image.entity';
import { GuideImageOrmEntity } from './guide-image.orm-entity';

export class GuideImageMapper {
  static toDomain(orm: GuideImageOrmEntity): GuideImage {
    return GuideImage.create({
      id: orm.id,
      fileName: orm.fileName,
      mimeType: orm.mimeType,
      data: Buffer.isBuffer(orm.data) ? orm.data : Buffer.from(orm.data),
      createdAt: new Date(orm.createdAt),
    });
  }

  static toOrm(image: GuideImage): GuideImageOrmEntity {
    const orm = new GuideImageOrmEntity();
    orm.id = image.id;
    orm.fileName = image.fileName;
    orm.mimeType = image.mimeType;
    orm.size = image.size;
    orm.data = image.data;
    orm.createdAt = image.createdAt;

    return orm;
  }
}
