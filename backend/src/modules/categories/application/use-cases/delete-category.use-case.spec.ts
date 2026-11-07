import { Permission } from '../../../users/domain/enums/permission.enum';
import { Category } from '../../domain/entities/category.entity';
import { CannotManageCategoryError } from '../../domain/errors/category.errors';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryNotFoundError } from '../errors/category.errors';
import {
  DeleteCategoryUseCase,
  type DeleteCategoryInput,
} from './delete-category.use-case';

class InMemoryCategoryRepository extends CategoryRepository {
  constructor(readonly categories: Category[]) {
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

describe('DeleteCategoryUseCase', () => {
  const input: DeleteCategoryInput = { id: 'category-1' };
  let categories: InMemoryCategoryRepository;
  let useCase: DeleteCategoryUseCase;

  beforeEach(() => {
    categories = new InMemoryCategoryRepository([
      Category.create({
        id: 'category-1',
        name: 'Documentos',
        slug: '',
      }),
    ]);
    useCase = new DeleteCategoryUseCase(categories);
  });

  it('elimina una categoría cuando el actor tiene permiso', async () => {
    await useCase.execute(input, {
      permissions: [Permission.CATEGORIES_MANAGE],
    });

    await expect(categories.findById(input.id)).resolves.toBeNull();
  });

  it('rechaza la eliminación si el actor no tiene permiso', async () => {
    await expect(
      useCase.execute(input, { permissions: [] }),
    ).rejects.toThrow(CannotManageCategoryError);

    await expect(categories.findById(input.id)).resolves.toBeDefined();
  });

  it('rechaza categorías inexistentes', async () => {
    await expect(
      useCase.execute(
        { id: 'missing' },
        { permissions: [Permission.CATEGORIES_MANAGE] },
      ),
    ).rejects.toThrow(CategoryNotFoundError);
  });
});