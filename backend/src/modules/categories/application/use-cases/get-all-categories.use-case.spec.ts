import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { GetAllCategoriesUseCase } from './get-all-categories.use-case';

class InMemoryCategoryRepository extends CategoryRepository {
  constructor(private readonly categories: Category[]) {
    super();
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((category) => category.id === id) ?? null;
  }

  async findAll(): Promise<Category[]> {
    return [...this.categories];
  }

  async save(category: Category): Promise<void> {
    this.categories.push(category);
  }

  async delete(id: string): Promise<void> {
    const index = this.categories.findIndex((category) => category.id === id);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }
}

describe('GetAllCategoriesUseCase', () => {
  it('obtiene todas las categorías del repositorio', async () => {
    const categories = [
      Category.create({ id: 'category-1', name: 'Documentos', slug: '' }),
      Category.create({ id: 'category-2', name: 'Videos', slug: '' }),
    ];
    const repository = new InMemoryCategoryRepository(categories);
    const useCase = new GetAllCategoriesUseCase(repository);

    await expect(useCase.execute()).resolves.toEqual(categories);
  });

  it('devuelve una lista vacía cuando no existen categorías', async () => {
    const useCase = new GetAllCategoriesUseCase(new InMemoryCategoryRepository([]));

    await expect(useCase.execute()).resolves.toEqual([]);
  });
});
