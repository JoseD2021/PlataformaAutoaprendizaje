import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotManageCategoryError } from '../../domain/errors/category.errors';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../domain/repositories/category.repository';

export interface CreateCategoryInput {
  name: string;
  iconName?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface CreateCategoryActor {
  permissions: Permission[];
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categories: CategoryRepository
  ) {}

  async execute(input: CreateCategoryInput, actor: CreateCategoryActor): Promise<Category> {
    if (!actor.permissions.includes(Permission.CATEGORIES_CREATE)) {
      throw new CannotManageCategoryError(
        'No tienes permiso para crear categorías.',
      );
    }

    const category = Category.create({
      id: randomUUID(),
      name: input.name,
      slug: '',
      iconName: input.iconName,
      description: input.description,
      isFeatured: input.isFeatured,
    });

    await this.categories.save(category);

    return category;
  }
}