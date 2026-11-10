import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetRoomInfoUseCase } from './application/use-cases/get-room-info.use-case';
import { ROOM_INFO_REPOSITORY } from './domain/repositories/room-info.repository';
import { RoomRuleOrmEntity } from './infrastructure/persistence/room-rule.orm-entity';
import { RoomScheduleOrmEntity } from './infrastructure/persistence/room-schedule.orm-entity';
import { TypeOrmRoomInfoRepository } from './infrastructure/persistence/typeorm-room-info.repository';
import { RoomInfoSeedService } from './infrastructure/seeding/room-info-seed.service';
import { RoomInfoController } from './presentation/controllers/room-info.controller';
import { UpdateRoomInfoUseCase } from './application/use-cases/update-room-info.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([RoomScheduleOrmEntity, RoomRuleOrmEntity])],
  controllers: [RoomInfoController],
  providers: [
    { provide: ROOM_INFO_REPOSITORY, useClass: TypeOrmRoomInfoRepository },
    GetRoomInfoUseCase,
    UpdateRoomInfoUseCase,
    RoomInfoSeedService,
  ],
})
export class RoomInfoModule {}