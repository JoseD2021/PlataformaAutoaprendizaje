import { Doubt } from '../../domain/entities/doubt.entity';
import { DoubtOrmEntity } from './doubt.orm-entity';

export class DoubtMapper {
  static toDomain(orm: DoubtOrmEntity): Doubt {
    return Doubt.rehydrate({
      id: orm.id,
      question: orm.question,
      normalizedQuestion: orm.normalizedQuestion,
      categoryId: orm.categoryId,
      topic: orm.topic,
      times: orm.timesCount,
      createdAt: orm.createdAt,
      lastAskedAt: orm.lastAskedAt,
    });
  }

  static toOrm(doubt: Doubt): DoubtOrmEntity {
    const orm = new DoubtOrmEntity();
    orm.id = doubt.id;
    orm.question = doubt.question;
    orm.normalizedQuestion = doubt.normalizedQuestion;
    orm.categoryId = doubt.categoryId;
    orm.topic = doubt.topic;
    orm.timesCount = doubt.times;
    orm.lastAskedAt = doubt.lastAskedAt;
    orm.createdAt = doubt.createdAt;
    orm.updatedAt = new Date();

    return orm;
  }
}
