import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotManageCategoryError } from '../../domain/errors/category.errors';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../domain/repositories/category.repository';
import { CategoryNotFoundError } from '../errors/category.errors';

export interface DeleteCategoryInput {
  id: string;
}

export interface DeleteCategoryActor {
  permissions: Permission[];
}

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categories: CategoryRepository,
  ) {}

  async execute(
    input: DeleteCategoryInput,
    actor: DeleteCategoryActor,
  ): Promise<void> {
    if (!actor.permissions.includes(Permission.CATEGORIES_MANAGE)) {
      throw new CannotManageCategoryError(
        'No tienes permiso para eliminar categorías.',
      );
    }

    const category = await this.categories.findById(input.id);

    if (!category) {
      throw new CategoryNotFoundError();
    }

    await this.categories.delete(category.id);
  }
}
