import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../../categories/domain/repositories/category.repository';
import {
  Doubt,
  normalizeQuestion,
} from '../../domain/entities/doubt.entity';
import { CannotRecordDoubtError } from '../../domain/errors/doubt.errors';
import {
  DOUBT_REPOSITORY,
  DoubtRepository,
} from '../../domain/repositories/doubt.repository';
import { DoubtCategoryNotFoundError } from '../errors/doubt.errors';
import { DoubtModel, toDoubtModel } from '../models/doubt-view.model';

export interface RegisterDoubtInput {
  question: string;
  categoryId: string;
}

export interface RegisterDoubtActor {
  permissions: Permission[];
}

@Injectable()
export class RegisterDoubtUseCase {
  constructor(
    @Inject(DOUBT_REPOSITORY) private readonly doubts: DoubtRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categories: CategoryRepository,
  ) {}

  async execute(
    input: RegisterDoubtInput,
    actor: RegisterDoubtActor,
  ): Promise<DoubtModel> {
    if (!actor.permissions.includes(Permission.DOUBTS_MANAGE)) {
      throw new CannotRecordDoubtError();
    }

    const category = await this.categories.findById(input.categoryId);

    if (!category) {
      throw new DoubtCategoryNotFoundError();
    }

    const normalizedQuestion = normalizeQuestion(input.question);
    const existing = await this.doubts.findByQuestionAndCategory(
      normalizedQuestion,
      category.id,
    );

    if (existing) {
      existing.registerAnother();
      await this.doubts.save(existing);

      return toDoubtModel(existing);
    }

    const doubt = Doubt.create({
      id: randomUUID(),
      question: input.question,
      categoryId: category.id,
      topic: category.name,
    });
    await this.doubts.save(doubt);

    return toDoubtModel(doubt);
  }
}
