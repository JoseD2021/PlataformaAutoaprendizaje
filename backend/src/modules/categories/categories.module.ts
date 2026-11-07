import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { GetAllCategoriesUseCase } from './application/use-cases/get-all-categories.use-case';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository';
import { CategoryOrmEntity } from './infrastructure/persistence/category.orm-entity';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm-category.repository';
import { CategoriesController } from './presentation/controllers/categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoriesController],
  providers: [
    CreateCategoryUseCase,
    GetAllCategoriesUseCase,
    { provide: CATEGORY_REPOSITORY, useClass: TypeOrmCategoryRepository },
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoriesModule {}
