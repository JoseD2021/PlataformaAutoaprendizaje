import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityModule } from '../../shared/infrastructure/security/security.module';
import { ROLE_REPOSITORY } from './domain/repositories/role.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { CreateDefaultRolesUseCase } from './application/use-cases/create-default-roles.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetPrincipalUseCase } from './application/use-cases/get-principal.use-case';
import { ListRolesUseCase } from './application/use-cases/list-roles.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateRolePermissionsUseCase } from './application/use-cases/update-role-permissions.use-case';
import { UpdateUserRoleUseCase } from './application/use-cases/update-user-role.use-case';
import { AdminSeedService } from './infrastructure/seeding/admin-seed.service';
import { RoleOrmEntity } from './infrastructure/persistence/role.orm-entity';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm-role.repository';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { RolesController } from './presentation/controllers/roles.controller';
import { UsersController } from './presentation/controllers/users.controller';

const repositories = [
  { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
  { provide: ROLE_REPOSITORY, useClass: TypeOrmRoleRepository },
];

const useCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  CreateRoleUseCase,
  CreateDefaultRolesUseCase,
  DeleteRoleUseCase,
  UpdateUserRoleUseCase,
  UpdateRolePermissionsUseCase,
  ListRolesUseCase,
  ListUsersUseCase,
  GetPrincipalUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity]), SecurityModule],
  controllers: [UsersController, RolesController],
  providers: [...repositories, ...useCases, AdminSeedService],
  exports: [USER_REPOSITORY, ROLE_REPOSITORY, GetPrincipalUseCase],
})
export class UsersModule {}
