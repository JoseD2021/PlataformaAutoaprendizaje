import { GuideStep } from '../../domain/entities/guide-step.entity';
import { Guide } from '../../domain/entities/guide.entity';
import type { GuideStatus } from '../../domain/enums/guide-status.enum';
import { GuideOrmEntity } from './guide.orm-entity';
import { GuideStepOrmEntity } from './guide-step.orm-entity';

export class GuideMapper {
  static toDomain(orm: GuideOrmEntity): Guide {
    return Guide.create({
      id: orm.id,
      title: orm.title,
      categoryId: orm.categoryId,
      estimatedMinutes: orm.estimatedMinutes,
      isMostRequested: orm.isMostRequested,
      tag: orm.tag,
      status: orm.status as GuideStatus,
      steps: (orm.steps ?? []).map((step) =>
        GuideStep.create({
          id: step.id,
          position: step.position,
          shortTitle: step.shortTitle,
          action: step.action,
          description: step.description,
          imageUrl: step.imageUrl,
          imageCaption: step.imageCaption,
        }),
      ),
      createdAt: new Date(orm.createdAt),
      updatedAt: new Date(orm.updatedAt),
      searchKeywords: orm.searchKeywords,
    });
  }

  static toOrm(guide: Guide): GuideOrmEntity {
    const orm = new GuideOrmEntity();
    orm.id = guide.id;
    orm.title = guide.title;
    orm.categoryId = guide.categoryId;
    orm.estimatedMinutes = guide.estimatedMinutes;
    orm.isMostRequested = guide.isMostRequested;
    orm.tag = guide.tag;
    orm.status = guide.status;
    orm.createdAt = guide.createdAt;
    orm.updatedAt = guide.updatedAt;
    orm.searchKeywords = guide.searchKeywords;
    orm.steps = guide.steps.map((step) => {
      const stepOrm = new GuideStepOrmEntity();
      stepOrm.id = step.id;
      stepOrm.guideId = guide.id;
      stepOrm.position = step.position;
      stepOrm.shortTitle = step.shortTitle;
      stepOrm.action = step.action;
      stepOrm.description = step.description;
      stepOrm.imageUrl = step.imageUrl;
      stepOrm.imageCaption = step.imageCaption;

      return stepOrm;
    });

    return orm;
  }
}