import { Category } from '../../domain/entities/category.entity';
import { CategoryOrmEntity } from './category.orm-entity';

export class CategoryMapper {
  static toDomain(orm: CategoryOrmEntity): Category {
    return Category.rehydrate({
      id: orm.id,
      name: orm.name,
      slug: orm.slug,
      iconName: orm.iconName,
      description: orm.description,
      isFeatured: orm.isFeatured,
    });
  }

  static toOrm(category: Category): CategoryOrmEntity {
    const orm = new CategoryOrmEntity();
    orm.id = category.id;
    orm.name = category.name;
    orm.slug = category.slug;
    orm.iconName = category.iconName;
    orm.description = category.description;
    orm.isFeatured = category.isFeatured;

    return orm;
  }
}