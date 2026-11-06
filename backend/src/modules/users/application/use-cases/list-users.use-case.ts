import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import type { UserListItem } from '../models/user-list-item.model';
import { toUserListItem } from '../models/user-list-item.model';

export interface ListUsersInput {
  page: number;
  limit: number;
}

export interface ListUsersResult {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListUsersUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(input: ListUsersInput): Promise<ListUsersResult> {
    const result = await this.users.paginate({ page: input.page, limit: input.limit });

    return {
      items: result.items.map(toUserListItem),
      total: result.total,
      page: input.page,
      limit: input.limit,
    };
  }
}
