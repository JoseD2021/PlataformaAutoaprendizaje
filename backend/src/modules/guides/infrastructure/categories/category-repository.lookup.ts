import { Inject, Injectable } from '@nestjs/common';
import { CategoryLookup } from '../../application/ports/category-lookup.port';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../../categories/domain/repositories/category.repository';

@Injectable()
export class CategoryRepositoryLookup extends CategoryLookup {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly categories: CategoryRepository) {
    super();
  }

  async findIdBySlug(slug: string): Promise<string | null> {
    const category = await this.categories.findBySlug(slug);

    return category ? category.id : null;
  }
  
  async existsById(id: string): Promise<boolean> {
    return (await this.categories.findById(id)) !== null;
  }
}