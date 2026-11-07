import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'categories' })
@Index('UQ_categories_slug', ['slug'], { unique: true })
export class CategoryOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'varchar', length: 80 })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  iconName: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;
}
