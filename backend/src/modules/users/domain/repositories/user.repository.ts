import type { User } from '../entities/user.entity';

export interface PaginatedUsers {
  items: User[];
  total: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract save(user: User): Promise<User>;
  abstract paginate(options: PaginationOptions): Promise<PaginatedUsers>;
  abstract countByRole(role: string): Promise<number>;
  abstract delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
