import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { DeleteDoubtUseCase } from './application/use-cases/delete-doubt.use-case';
import { ListDoubtsUseCase } from './application/use-cases/list-doubts.use-case';
import { RegisterDoubtUseCase } from './application/use-cases/register-doubt.use-case';
import { DOUBT_REPOSITORY } from './domain/repositories/doubt.repository';
import { DoubtOrmEntity } from './infrastructure/persistence/doubt.orm-entity';
import { TypeOrmDoubtRepository } from './infrastructure/persistence/typeorm-doubt.repository';
import { DoubtsController } from './presentation/controllers/doubts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DoubtOrmEntity]), CategoriesModule],
  controllers: [DoubtsController],
  providers: [
    { provide: DOUBT_REPOSITORY, useClass: TypeOrmDoubtRepository },
    RegisterDoubtUseCase,
    ListDoubtsUseCase,
    DeleteDoubtUseCase,
  ],
})
export class DoubtsModule {}
