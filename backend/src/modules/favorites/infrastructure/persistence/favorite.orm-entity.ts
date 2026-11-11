import { CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'favorites' })
export class FavoriteOrmEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Index()
  @PrimaryColumn({ name: 'guide_id', type: 'varchar', length: 80 })
  guideId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
