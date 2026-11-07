import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { Permission } from '../../domain/enums/permission.enum';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserRoleUseCase } from '../../application/use-cases/update-user-role.use-case';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ListUsersQueryDto } from '../dtos/list-users-query.dto';
import { PaginatedUsersResponseDto } from '../dtos/paginated-users-response.dto';
import { UpdateUserRoleDto } from '../dtos/update-user-role.dto';
import { UserIdParamDto } from '../dtos/user-id-param.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@ApiTags('Usuarios')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @RequirePermissions(Permission.USERS_CREATE)
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto, {
      id: actor.id,
      roleRank: actor.roleRank,
    });

    return UserResponseDto.from(user);
  }

  @Get()
  @RequirePermissions(Permission.USERS_READ)
  @ApiOperation({ summary: 'Listar usuarios de forma paginada' })
  @ApiOkResponse({ type: PaginatedUsersResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async list(@Query() query: ListUsersQueryDto): Promise<PaginatedUsersResponseDto> {
    const result = await this.listUsersUseCase.execute({
      page: query.page,
      limit: query.limit,
    });

    return PaginatedUsersResponseDto.from(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.USERS_DELETE)
  @ApiOperation({ summary: 'Eliminar un usuario con rol inferior al del usuario autenticado' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async remove(
    @Param() params: UserIdParamDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteUserUseCase.execute(
      { targetUserId: params.id },
      { id: actor.id, roleRank: actor.roleRank },
    );
  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.USERS_UPDATE_ROLE)
  @ApiOperation({ summary: 'Cambiar el rol de otro usuario' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async updateRole(
    @Param() params: UserIdParamDto,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserRoleUseCase.execute(
      { targetUserId: params.id, role: dto.role },
      { id: actor.id, roleRank: actor.roleRank },
    );

    return UserResponseDto.from(user);
  }
}
