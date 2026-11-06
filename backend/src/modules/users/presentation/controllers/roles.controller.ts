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
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { DeleteRoleUseCase } from '../../application/use-cases/delete-role.use-case';
import { ListRolesUseCase } from '../../application/use-cases/list-roles.use-case';
import { UpdateRolePermissionsUseCase } from '../../application/use-cases/update-role-permissions.use-case';
import { Permission } from '../../domain/enums/permission.enum';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleParamDto } from '../dtos/role-param.dto';
import { RoleResponseDto } from '../dtos/role-response.dto';
import { UpdateRolePermissionsDto } from '../dtos/update-role-permissions.dto';

@ApiTags('Roles y permisos')
@ApiBearerAuth('access-token')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly updateRolePermissionsUseCase: UpdateRolePermissionsUseCase,
  ) {}

  @Get()
  @RequirePermissions(Permission.ROLES_READ)
  @ApiOperation({ summary: 'Listar roles y sus permisos' })
  @ApiOkResponse({ type: [RoleResponseDto] })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async list(): Promise<RoleResponseDto[]> {
    const roles = await this.listRolesUseCase.execute();

    return roles.map((role) => RoleResponseDto.from(role));
  }

  @Post()
  @RequirePermissions(Permission.ROLES_CREATE)
  @ApiOperation({
    summary: 'Crear un rol con jerarquía inferior al usuario autenticado',
  })
  @ApiCreatedResponse({ type: RoleResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async create(
    @Body() dto: CreateRoleDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<RoleResponseDto> {
    const role = await this.createRoleUseCase.execute(dto, {
      roleRank: actor.roleRank,
      permissions: actor.permissions,
    });

    return RoleResponseDto.from(role);
  }

  @Delete(':role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.ROLES_DELETE)
  @ApiOperation({ summary: 'Eliminar un rol sin usuarios asignados' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  async remove(
    @Param() params: RoleParamDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteRoleUseCase.execute(
      { role: params.role },
      { roleRank: actor.roleRank },
    );
  }

  @Patch(':role/permissions')
  @RequirePermissions(Permission.ROLES_UPDATE_PERMISSIONS)
  @ApiOperation({ summary: 'Actualizar los permisos de un rol inferior' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async updatePermissions(
    @Param() params: RoleParamDto,
    @Body() dto: UpdateRolePermissionsDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<RoleResponseDto> {
    const role = await this.updateRolePermissionsUseCase.execute(
      { role: params.role, permissions: dto.permissions },
      { roleRank: actor.roleRank },
    );

    return RoleResponseDto.from(role);
  }
}
