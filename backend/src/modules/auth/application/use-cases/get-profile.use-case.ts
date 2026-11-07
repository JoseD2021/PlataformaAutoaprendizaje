import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import type { User } from '../../../users/domain/entities/user.entity';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';

@Injectable()
export class GetProfileUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.users.findById(userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('La sesión ya no es válida.');
    }

    return user;
  }
}
