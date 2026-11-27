import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { DeleteDoubtUseCase } from '../../application/use-cases/delete-doubt.use-case';
import { ListDoubtsUseCase } from '../../application/use-cases/list-doubts.use-case';
import { RegisterDoubtUseCase } from '../../application/use-cases/register-doubt.use-case';
import { CrearDudaDto } from '../dtos/crear-duda.dto';
import { DudaIdParamDto } from '../dtos/duda-id-param.dto';
import { DudaResponseDto } from '../dtos/duda-response.dto';

@ApiTags('Dudas sin guía')
@Controller('doubts')
export class DoubtsController {
  constructor(
    private readonly registerDoubtUseCase: RegisterDoubtUseCase,
    private readonly listDoubtsUseCase: ListDoubtsUseCase,
    private readonly deleteDoubtUseCase: DeleteDoubtUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @RequirePermissions(Permission.DOUBTS_MANAGE)
  @ApiOperation({
    summary: 'Anotar una duda sin guía',
    description:
      'Si ya existe la misma duda sobre el mismo tema, suma una vez a la registrada en lugar de crear otra.',
  })
  @ApiOkResponse({ type: DudaResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async register(
    @Body() body: CrearDudaDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<DudaResponseDto> {
    const doubt = await this.registerDoubtUseCase.execute(
      { question: body.duda, categoryId: body.categoriaId },
      { permissions: actor.permissions },
    );

    return DudaResponseDto.from(doubt);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @RequirePermissions(Permission.DOUBTS_MANAGE)
  @ApiOperation({ summary: 'Listar dudas sin guía, con las más preguntadas primero' })
  @ApiOkResponse({ type: [DudaResponseDto] })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async list(@CurrentUser() actor: AuthenticatedUser): Promise<DudaResponseDto[]> {
    const doubts = await this.listDoubtsUseCase.execute({
      permissions: actor.permissions,
    });

    return doubts.map((doubt) => DudaResponseDto.from(doubt));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @RequirePermissions(Permission.DOUBTS_MANAGE)
  @ApiOperation({ summary: 'Eliminar una duda registrada' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async delete(
    @Param() params: DudaIdParamDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteDoubtUseCase.execute(params.id, {
      permissions: actor.permissions,
    });
  }
}
