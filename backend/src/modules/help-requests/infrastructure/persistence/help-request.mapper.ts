import { HelpRequest } from '../../domain/entities/help-request.entity';
import { HelpRequestOrmEntity } from './help-request.orm-entity';

export class HelpRequestMapper {
  static toDomain(orm: HelpRequestOrmEntity): HelpRequest {
    return HelpRequest.rehydrate({
      id: orm.id,
      stationNumber: orm.stationNumber,
      guideId: orm.guideId,
      guideTitle: orm.guideTitle,
      stepNumber: orm.stepNumber,
      userId: orm.userId,
      requesterName: orm.requesterName,
      status: orm.status,
      createdAt: orm.createdAt,
      resolvedAt: orm.resolvedAt,
      resolvedBy: orm.resolvedBy,
    });
  }

  static toOrm(helpRequest: HelpRequest): HelpRequestOrmEntity {
    const orm = new HelpRequestOrmEntity();
    orm.id = helpRequest.id;
    orm.stationNumber = helpRequest.stationNumber;
    orm.guideId = helpRequest.guideId;
    orm.guideTitle = helpRequest.guideTitle;
    orm.stepNumber = helpRequest.stepNumber;
    orm.userId = helpRequest.userId;
    orm.requesterName = helpRequest.requesterName;
    orm.status = helpRequest.status;
    orm.createdAt = helpRequest.createdAt;
    orm.resolvedAt = helpRequest.resolvedAt;
    orm.resolvedBy = helpRequest.resolvedBy;

    return orm;
  }
}
