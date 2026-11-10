import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GUIDE_REPOSITORY } from './domain/repositories/guide.repository';
import { GUIDE_IMAGE_REPOSITORY } from './domain/repositories/guide-image.repository';
import { GetGuideUseCase } from './application/use-cases/get-guide.use-case';
import { ListGuidesUseCase } from './application/use-cases/list-guides.use-case';
import { GuideOrmEntity } from './infrastructure/persistence/guide.orm-entity';
import { GuideStepOrmEntity } from './infrastructure/persistence/guide-step.orm-entity';
import { GuideImageOrmEntity } from './infrastructure/persistence/guide-image.orm-entity';
import { TypeOrmGuideRepository } from './infrastructure/persistence/typeorm-guide.repository';
import { TypeOrmGuideImageRepository } from './infrastructure/persistence/typeorm-guide-image.repository';
import { GuidesSeedService } from './infrastructure/seeding/guides-seed.service';
import { GuidesController } from './presentation/controllers/guides.controller';
import { GuideImagesController } from './presentation/controllers/guide-images.controller';
import { CategoriesModule } from '../categories/categories.module';
import { CATEGORY_LOOKUP } from './application/ports/category-lookup.port';
import { CategoryRepositoryLookup } from './infrastructure/categories/category-repository.lookup';
import { SearchGuidesUseCase } from './application/use-cases/search-guides.use-case';
import { ChangeGuideStatusUseCase } from './application/use-cases/change-guide-status.use-case';
import { CreateGuideUseCase } from './application/use-cases/create-guide.use-case';
import { DeleteGuideUseCase } from './application/use-cases/delete-guide.use-case';
import { GetGuideImageUseCase } from './application/use-cases/get-guide-image.use-case';
import { GetManagedGuideUseCase } from './application/use-cases/get-managed-guide.use-case';
import { ListManagedGuidesUseCase } from './application/use-cases/list-managed-guides.use-case';
import { UpdateGuideUseCase } from './application/use-cases/update-guide.use-case';
import { UploadGuideImageUseCase } from './application/use-cases/upload-guide-image.use-case';
import { GuidesManagementController } from './presentation/controllers/guides-management.controller';

const repositories = [
  { provide: GUIDE_REPOSITORY, useClass: TypeOrmGuideRepository },
  { provide: GUIDE_IMAGE_REPOSITORY, useClass: TypeOrmGuideImageRepository },
  { provide: CATEGORY_LOOKUP, useClass: CategoryRepositoryLookup },
];

const useCases = [
  ListGuidesUseCase, 
  GetGuideUseCase, 
  SearchGuidesUseCase,
  ListManagedGuidesUseCase,
  GetManagedGuideUseCase,
  CreateGuideUseCase,
  UpdateGuideUseCase,
  ChangeGuideStatusUseCase,
  DeleteGuideUseCase,
  UploadGuideImageUseCase,
  GetGuideImageUseCase,
];

@Module({
    imports: [
      TypeOrmModule.forFeature([GuideOrmEntity, GuideStepOrmEntity, GuideImageOrmEntity]),
      CategoriesModule,
    ],
  providers: [...repositories, ...useCases, GuidesSeedService],
  exports: [GUIDE_REPOSITORY],
  controllers: [GuidesController, GuideImagesController, GuidesManagementController],
})
export class GuidesModule {}