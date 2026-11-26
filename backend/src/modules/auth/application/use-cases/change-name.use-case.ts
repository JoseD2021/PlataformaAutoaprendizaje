import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/domain/repositories/user.repository';

export interface ChangeNameInput {
  userId: string;
  fullName: string;
}

@Injectable()
export class ChangeNameUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  async execute(input: ChangeNameInput): Promise<void> {
    const user = await this.users.findById(input.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('La sesión ya no es válida.');
    }

    user.changeFullName(input.fullName);
    await this.users.save(user);
  }
}
