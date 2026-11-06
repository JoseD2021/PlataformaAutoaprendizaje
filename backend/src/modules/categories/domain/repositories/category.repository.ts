import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
    abstract findById(id: string): Promise<Category | null>;
    abstract findAll(): Promise<Category[]>;
    abstract save(category: Category): Promise<void>;
    abstract delete(id: string): Promise<void>;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');