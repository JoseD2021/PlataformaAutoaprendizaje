import { User } from '../../domain/entities/user.entity';
import type { Role } from '../../domain/enums/role.enum';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.rehydrate({
      id: orm.id,
      email: orm.email,
      passwordHash: orm.passwordHash,
      fullName: orm.fullName,
      role: orm.role as Role,
      isActive: orm.isActive,
      privacyTermsAcceptedAt: orm.privacyTermsAcceptedAt
        ? new Date(orm.privacyTermsAcceptedAt)
        : null,
      privacyTermsVersion: orm.privacyTermsVersion ?? null,
      createdAt: new Date(orm.createdAt),
      updatedAt: new Date(orm.updatedAt),
    });
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.passwordHash = user.passwordHash;
    orm.fullName = user.fullName;
    orm.role = user.role;
    orm.isActive = user.isActive;
    orm.privacyTermsAcceptedAt = user.privacyTermsAcceptedAt;
    orm.privacyTermsVersion = user.privacyTermsVersion;
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;

    return orm;
  }
}
