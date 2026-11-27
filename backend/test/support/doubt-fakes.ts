import { Category } from '../../src/modules/categories/domain/entities/category.entity';
import { CategoryRepository } from '../../src/modules/categories/domain/repositories/category.repository';
import { Doubt } from '../../src/modules/doubts/domain/entities/doubt.entity';
import { DoubtRepository } from '../../src/modules/doubts/domain/repositories/doubt.repository';

export class InMemoryDoubtRepository extends DoubtRepository {
  private readonly doubts = new Map<string, Doubt>();

  constructor(seed: Doubt[] = []) {
    super();
    seed.forEach((doubt) => this.doubts.set(doubt.id, doubt));
  }

  async findByQuestionAndCategory(
    normalizedQuestion: string,
    categoryId: string,
  ): Promise<Doubt | null> {
    return (
      [...this.doubts.values()].find(
        (doubt) =>
          doubt.normalizedQuestion === normalizedQuestion &&
          doubt.categoryId === categoryId,
      ) ?? null
    );
  }

  async findById(id: string): Promise<Doubt | null> {
    return this.doubts.get(id) ?? null;
  }

  async findAll(): Promise<Doubt[]> {
    return [...this.doubts.values()];
  }

  async save(doubt: Doubt): Promise<void> {
    this.doubts.set(doubt.id, doubt);
  }

  async delete(id: string): Promise<void> {
    this.doubts.delete(id);
  }

  get all(): Doubt[] {
    return [...this.doubts.values()];
  }
}

export class InMemoryDoubtCategoryRepository extends CategoryRepository {
  private readonly categories = new Map<string, Category>();

  constructor(seed: Category[] = []) {
    super();
    seed.forEach((category) => this.categories.set(category.id, category));
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.get(id) ?? null;
  }

  async findBySlug(slug: string, excludeId?: string): Promise<Category | null> {
    return (
      [...this.categories.values()].find(
        (category) => category.slug === slug && category.id !== excludeId,
      ) ?? null
    );
  }

  async findFeatured(excludeId?: string): Promise<Category | null> {
    return (
      [...this.categories.values()].find(
        (category) => category.isFeatured && category.id !== excludeId,
      ) ?? null
    );
  }

  async findAll(): Promise<Category[]> {
    return [...this.categories.values()];
  }

  async save(category: Category): Promise<void> {
    this.categories.set(category.id, category);
  }

  async delete(id: string): Promise<void> {
    this.categories.delete(id);
  }
}
