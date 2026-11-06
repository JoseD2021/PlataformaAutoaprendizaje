import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'varchar', length: 80 })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  iconUrl: string;

  @Column({ type: 'int' })
  displayOrder: number;

  @Column({ type: 'boolean' })
  isActive: boolean;
}
