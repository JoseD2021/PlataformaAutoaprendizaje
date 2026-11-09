import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GetRoomInfoUseCase } from '../../application/use-cases/get-room-info.use-case';
import { UpdateRoomInfoUseCase } from '../../application/use-cases/update-room-info.use-case';
import { ActualizarSalaInformacionDto } from '../dtos/actualizar-sala-informacion.dto';
import { SalaInformacionResponseDto } from '../dtos/sala-informacion-response.dto';

@ApiTags('Sala')
@Controller('sala')
export class RoomInfoController {
  constructor(
    private readonly getRoomInfoUseCase: GetRoomInfoUseCase,
    private readonly updateRoomInfoUseCase: UpdateRoomInfoUseCase,
  ) {}

  @Get('informacion')
  @Public()
  @ApiOperation({
    summary: 'Ver el horario de atención y las normas de la sala',
    description:
      'Público y sin paginación. Horarios y normas vienen ya ordenados para mostrarse tal cual.',
  })
  @ApiOkResponse({ type: SalaInformacionResponseDto })
  async getInfo(): Promise<SalaInformacionResponseDto> {
    const info = await this.getRoomInfoUseCase.execute();

    return SalaInformacionResponseDto.from(info);
  }

  @Put('informacion')
  @RequirePermissions(Permission.ROOM_INFO_MANAGE)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Reemplazar el horario y las normas de la sala',
    description:
      'Reemplaza ambas listas completas en una sola operación. Para crear, editar, borrar o reordenar, envía las listas finales: el orden del arreglo es el orden de visualización. Una lista vacía deja esa sección sin elementos.',
  })
  @ApiOkResponse({ type: SalaInformacionResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async update(
    @Body() dto: ActualizarSalaInformacionDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<SalaInformacionResponseDto> {
    const info = await this.updateRoomInfoUseCase.execute(
      {
        schedules: dto.horarios.map((horario) => ({ days: horario.dias, hours: horario.horas })),
        rules: dto.normas,
      },
      { permissions: actor.permissions },
    );

    return SalaInformacionResponseDto.from(info);
  }
}