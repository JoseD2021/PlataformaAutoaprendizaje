import type { User } from '../../domain/entities/user.entity';
import type { Role } from '../../domain/enums/role.enum';

export interface UserListItem {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  privacyTermsAcceptedAt: Date | null;
  privacyTermsVersion: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserListItem(user: User): UserListItem {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    privacyTermsAcceptedAt: user.privacyTermsAcceptedAt,
    privacyTermsVersion: user.privacyTermsVersion,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
