import { Permission } from '../../../users/domain/enums/permission.enum';
import { Category } from '../../domain/entities/category.entity';
import { CannotManageCategoryError } from '../../domain/errors/category.errors';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryNotFoundError } from '../errors/category.errors';
import {
  UpdateCategoryUseCase,
  type UpdateCategoryInput,
} from './update-category.use-case';

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
    const index = this.categories.findIndex(
      (storedCategory) => storedCategory.id === category.id,
    );

    if (index >= 0) {
      this.categories[index] = category;
      return;
    }

    this.categories.push(category);
  }

  async delete(id: string): Promise<void> {
    const index = this.categories.findIndex((category) => category.id === id);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }
}

describe('UpdateCategoryUseCase', () => {
  const input: UpdateCategoryInput = {
    id: 'category-1',
    name: 'Documentos académicos',
    iconName: 'book-open',
    description: 'Material académico',
    isFeatured: true,
  };
  let categories: InMemoryCategoryRepository;
  let useCase: UpdateCategoryUseCase;

  beforeEach(() => {
    categories = new InMemoryCategoryRepository([
      Category.create({
        id: 'category-1',
        name: 'Documentos',
        slug: '',
        iconName: 'file',
      }),
    ]);
    useCase = new UpdateCategoryUseCase(categories);
  });

  it('actualiza y persiste una categoría cuando el actor tiene permiso', async () => {
    const category = await useCase.execute(input, {
      permissions: [Permission.CATEGORIES_MANAGE],
    });

    expect(category.name).toBe('Documentos académicos');
    expect(category.slug).toBe('documentos-acadmicos');
    expect(category.iconName).toBe('book-open');
    expect(category.description).toBe('Material académico');
    expect(category.isFeatured).toBe(true);
    expect(await categories.findById('category-1')).toBe(category);
  });

  it('rechaza la edición si el actor no tiene permiso', async () => {
    await expect(
      useCase.execute(input, { permissions: [] }),
    ).rejects.toThrow(CannotManageCategoryError);

    expect((await categories.findById('category-1'))?.name).toBe('Documentos');
  });

  it('rechaza categorías inexistentes', async () => {
    await expect(
      useCase.execute(
        { id: 'missing', name: 'Documentos' },
        { permissions: [Permission.CATEGORIES_MANAGE] },
      ),
    ).rejects.toThrow(CategoryNotFoundError);
  });
});
