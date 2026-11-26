import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../../../../shared/application/ports/password-hasher.port';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/domain/repositories/user.repository';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../domain/repositories/refresh-token.repository';
import { IncorrectCurrentPasswordError } from '../errors/auth.errors';

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.users.findById(input.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('La sesión ya no es válida.');
    }

    const currentPasswordMatches = await this.passwordHasher.compare(
      input.currentPassword,
      user.passwordHash,
    );

    if (!currentPasswordMatches) {
      throw new IncorrectCurrentPasswordError();
    }

    const passwordHash = await this.passwordHasher.hash(input.newPassword);
    user.changePasswordHash(passwordHash);

    await this.refreshTokens.revokeAllForUser(user.id);
    await this.users.save(user);
  }
}
