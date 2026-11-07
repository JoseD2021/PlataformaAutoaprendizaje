import type { User } from '../../domain/entities/user.entity';
import type { Role } from '../../domain/enums/role.enum';

export interface UserListItem {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
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
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
