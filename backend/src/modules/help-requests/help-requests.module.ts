import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidesModule } from '../guides/guides.module';
import { HELP_REQUEST_REPOSITORY } from './domain/repositories/help-request.repository';
import { HelpRequestOrmEntity } from './infrastructure/persistence/help-request.orm-entity';
import { TypeOrmHelpRequestRepository } from './infrastructure/persistence/typeorm-help-request.repository';
import { HelpRequestsController } from './presentation/controllers/help-requests.controller';
import { CreateHelpRequestUseCase } from './application/use-cases/create-help-request.use-case';
import { ListPendingHelpRequestsUseCase } from './application/use-cases/list-pending-help-requests.use-case';
import { ResolveHelpRequestUseCase } from './application/use-cases/resolve-help-request.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([HelpRequestOrmEntity]), GuidesModule],
  controllers: [HelpRequestsController],
  providers: [
    { provide: HELP_REQUEST_REPOSITORY, useClass: TypeOrmHelpRequestRepository },
    CreateHelpRequestUseCase,
    ListPendingHelpRequestsUseCase,
    ResolveHelpRequestUseCase,
  ],
})
export class HelpRequestsModule {}
