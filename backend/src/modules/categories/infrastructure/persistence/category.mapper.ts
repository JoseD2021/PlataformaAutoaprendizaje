import { Category } from '../../domain/entities/category.entity';
import { CategoryOrmEntity } from './category.orm-entity';

export class CategoryMapper {
  static toDomain(orm: CategoryOrmEntity): Category {
    return Category.rehydrate({
      id: orm.id,
      name: orm.name,
      slug: orm.slug,
      iconUrl: orm.iconUrl,
      displayOrder: orm.displayOrder,
      isActive: orm.isActive,
    });
  }

  static toOrm(category: Category): CategoryOrmEntity {
    const orm = new CategoryOrmEntity();
    orm.id = category.id;
    orm.name = category.name;
    orm.slug = category.slug;
    orm.iconUrl = category.iconUrl;
    orm.displayOrder = category.displayOrder;
    orm.isActive = category.isActive;

    return orm;
  }
}