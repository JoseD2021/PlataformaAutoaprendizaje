import { Module } from '@nestjs/common';
import { GetPrivacyTermsUseCase } from './application/use-cases/get-privacy-terms.use-case';
import { PrivacyTermsController } from './presentation/controllers/privacy-terms.controller';

@Module({
  controllers: [PrivacyTermsController],
  providers: [GetPrivacyTermsUseCase],
})
export class PrivacyModule {}
