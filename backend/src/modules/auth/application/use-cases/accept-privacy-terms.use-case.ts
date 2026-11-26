import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedError } from '../../../../shared/application/errors/common.errors';
import { PrivacyTermsRepository } from '../../../privacy/domain/repositories/privacy-terms.repository';
import { User } from '../../../users/domain/entities/user.entity';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { PrivacyTermsVersionMismatchError } from '../errors/auth.errors';

export interface AcceptPrivacyTermsInput {
  userId: string;
  privacyTermsVersion: string;
}

@Injectable()
export class AcceptPrivacyTermsUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly privacyTermsRepository: PrivacyTermsRepository,
  ) {}

  async execute(input: AcceptPrivacyTermsInput): Promise<User> {
    const user = await this.users.findById(input.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('La sesión ya no es válida.');
    }

    const currentTerms = await this.privacyTermsRepository.findCurrent();
    if (!currentTerms) {
      throw new PrivacyTermsVersionMismatchError('vigente');
    }

    const acceptedVersion =
      typeof input.privacyTermsVersion === 'string' ? input.privacyTermsVersion.trim() : '';
    if (acceptedVersion !== currentTerms.version) {
      throw new PrivacyTermsVersionMismatchError(currentTerms.version);
    }

    user.acceptPrivacyTerms(currentTerms.version);
    return this.users.save(user);
  }
}
