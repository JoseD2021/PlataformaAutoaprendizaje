import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotManageCategoryError } from '../../domain/errors/category.errors';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import {
  CreateCategoryUseCase,
  type CreateCategoryInput,
} from './create-category.use-case';

class InMemoryCategoryRepository extends CategoryRepository {
  readonly categories: Category[] = [];

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

describe('CreateCategoryUseCase', () => {
  let categories: InMemoryCategoryRepository;
  let useCase: CreateCategoryUseCase;

  beforeEach(() => {
    categories = new InMemoryCategoryRepository();
    useCase = new CreateCategoryUseCase(categories);
  });

  it('crea y persiste una categoría cuando el actor tiene permiso', async () => {
    const input: CreateCategoryInput = {
      name: 'Documentos',
      iconName: 'book-open',
      description: 'Material de estudio',
      isFeatured: true,
    };

    const category = await useCase.execute(input, {
      permissions: [Permission.CATEGORIES_CREATE],
    });

    expect(category.id).toEqual(expect.any(String));
    expect(category.name).toBe(input.name);
    expect(category.slug).toBe('documentos');
    expect(await categories.findById(category.id)).toBe(category);
  });

  it('rechaza la creación si el actor no tiene permiso', async () => {
    await expect(
      useCase.execute({ name: 'Documentos' }, { permissions: [] }),
    ).rejects.toThrow(CannotManageCategoryError);

    expect(categories.categories).toHaveLength(0);
  });

  it('propaga la validación de la entidad y no persiste categorías inválidas', async () => {
    await expect(
      useCase.execute({ name: '   ' }, { permissions: [Permission.CATEGORIES_CREATE] }),
    ).rejects.toThrow();

    expect(categories.categories).toHaveLength(0);
  });
});
