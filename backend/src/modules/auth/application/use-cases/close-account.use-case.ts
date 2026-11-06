import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserNotFoundError } from '../../../users/application/errors/user.errors';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';

export interface CloseAccountInput {
  userId: string;
}

@Injectable()
export class CloseAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
  ) {}

  async execute(input: CloseAccountInput): Promise<void> {
    const user = await this.users.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.refreshTokens.revokeAllForUser(user.id);
    await this.users.delete(user.id);
  }
}
