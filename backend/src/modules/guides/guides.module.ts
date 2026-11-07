import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GUIDE_REPOSITORY } from './domain/repositories/guide.repository';
import { GetGuideUseCase } from './application/use-cases/get-guide.use-case';
import { ListGuidesUseCase } from './application/use-cases/list-guides.use-case';
import { GuideOrmEntity } from './infrastructure/persistence/guide.orm-entity';
import { GuideStepOrmEntity } from './infrastructure/persistence/guide-step.orm-entity';
import { TypeOrmGuideRepository } from './infrastructure/persistence/typeorm-guide.repository';
import { GuidesSeedService } from './infrastructure/seeding/guides-seed.service';
import { GuidesController } from './presentation/controllers/guides.controller';

const repositories = [{ provide: GUIDE_REPOSITORY, useClass: TypeOrmGuideRepository }];

const useCases = [ListGuidesUseCase, GetGuideUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([GuideOrmEntity, GuideStepOrmEntity])],
  providers: [...repositories, ...useCases, GuidesSeedService],
  exports: [GUIDE_REPOSITORY],
  controllers: [GuidesController],
})
export class GuidesModule {}