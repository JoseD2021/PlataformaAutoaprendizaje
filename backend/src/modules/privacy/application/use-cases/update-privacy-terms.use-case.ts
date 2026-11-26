import { ForbiddenException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { PrivacyTerms } from '../../domain/entities/privacy-terms.entity';
import { PrivacyTermsRepository } from '../../domain/repositories/privacy-terms.repository';

export interface UpdatePrivacyTermsInput {
  version: string;
  effectiveDate: string;
  title: string;
  sections: { title: string; paragraphs: string[] }[];
}

interface Actor {
  permissions: Permission[];
}

@Injectable()
export class UpdatePrivacyTermsUseCase {
  constructor(private readonly repository: PrivacyTermsRepository) {}

  async execute(input: UpdatePrivacyTermsInput, actor: Actor): Promise<PrivacyTerms> {
    if (!actor.permissions.includes(Permission.PRIVACY_TERMS_MANAGE)) {
      throw new ForbiddenException('No tienes permiso para modificar el aviso de privacidad.');
    }

    const current = await this.repository.findCurrent();
    const terms = PrivacyTerms.create({
      id: current?.id ?? randomUUID(),
      version: input.version,
      effectiveDate: input.effectiveDate,
      title: input.title,
      sections: input.sections,
    });

    return this.repository.save(terms);
  }
}
