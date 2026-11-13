import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity';

@Entity({ name: 'users' })
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 120 })
  fullName: string;

  @Index()
  @Column({ type: 'varchar', length: 32 })
  role: string;

  @ManyToOne(() => RoleOrmEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'role',
    referencedColumnName: 'role',
    foreignKeyConstraintName: 'FK_users_role',
  })
  roleDefinition?: RoleOrmEntity;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'privacy_terms_accepted_at', type: 'timestamptz', nullable: true })
  privacyTermsAcceptedAt: Date | null;

  @Column({ name: 'privacy_terms_version', type: 'varchar', length: 32, nullable: true })
  privacyTermsVersion: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
