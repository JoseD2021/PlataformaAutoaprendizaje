import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetPrivacyTermsUseCase } from './application/use-cases/get-privacy-terms.use-case';
import { UpdatePrivacyTermsUseCase } from './application/use-cases/update-privacy-terms.use-case';
import { PrivacyTermsRepository } from './domain/repositories/privacy-terms.repository';
import { PrivacyTermsSectionOrmEntity } from './infrastructure/persistence/privacy-terms-section.orm-entity';
import { PrivacyTermsOrmEntity } from './infrastructure/persistence/privacy-terms.orm-entity';
import { TypeOrmPrivacyTermsRepository } from './infrastructure/persistence/typeorm-privacy-terms.repository';
import { PrivacyTermsSeedService } from './infrastructure/seeding/privacy-terms-seed.service';
import { PrivacyTermsController } from './presentation/controllers/privacy-terms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrivacyTermsOrmEntity, PrivacyTermsSectionOrmEntity])],
  controllers: [PrivacyTermsController],
  providers: [
    GetPrivacyTermsUseCase,
    UpdatePrivacyTermsUseCase,
    { provide: PrivacyTermsRepository, useClass: TypeOrmPrivacyTermsRepository },
    PrivacyTermsSeedService,
  ],
  exports: [PrivacyTermsRepository],
})
export class PrivacyModule {}
