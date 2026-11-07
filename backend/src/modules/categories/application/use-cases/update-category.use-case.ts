import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotManageCategoryError } from '../../domain/errors/category.errors';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../domain/repositories/category.repository';
import {
  CategoryNotFoundError,
  CategorySlugAlreadyExistsError,
} from '../errors/category.errors';

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  iconName?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface UpdateCategoryActor {
  permissions: Permission[];
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categories: CategoryRepository,
  ) {}

  async execute(
    input: UpdateCategoryInput,
    actor: UpdateCategoryActor,
  ): Promise<Category> {
    if (!actor.permissions.includes(Permission.CATEGORIES_MANAGE)) {
      throw new CannotManageCategoryError(
        'No tienes permiso para editar categorías.',
      );
    }

    const category = await this.categories.findById(input.id);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    if (input.name !== undefined) {
      const slug = Category.generateSlug(input.name);

      if (await this.categories.findBySlug(slug, category.id)) {
        throw new CategorySlugAlreadyExistsError();
      }

      category.changeName(input.name);
    }

    if (input.iconName !== undefined) {
      category.changeIconName(input.iconName);
    }

    if (input.description !== undefined) {
      category.changeDescription(input.description);
    }

    if (input.isFeatured !== undefined) {
      category.changeIsFeatured(input.isFeatured);
    }

    await this.categories.save(category);

    return category;
  }
}
