import { Injectable, NotFoundException } from '@nestjs/common';
import { PrivacyTermsRepository } from '../../domain/repositories/privacy-terms.repository';
import { PrivacyTerms } from '../../domain/entities/privacy-terms.entity';

@Injectable()
export class GetPrivacyTermsUseCase {
  constructor(private readonly repository: PrivacyTermsRepository) {}

  async execute(): Promise<PrivacyTerms> {
    const terms = await this.repository.findCurrent();
    if (!terms) throw new NotFoundException('No hay un aviso de privacidad configurado.');
    return terms;
  }
}
