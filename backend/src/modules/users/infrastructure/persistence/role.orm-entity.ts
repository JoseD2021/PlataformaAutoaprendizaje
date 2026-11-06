import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  role: string;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'int' })
  rank: number;

  @Column({ type: 'simple-array' })
  permissions: string[];

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
