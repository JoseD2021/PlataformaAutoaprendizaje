import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GuiaResumenResponseDto } from '../../../guides/presentation/dtos/guia-resumen-response.dto';
import { AddFavoriteUseCase } from '../../application/use-cases/add-favorite.use-case';
import { ListFavoritesUseCase } from '../../application/use-cases/list-favorites.use-case';
import { RemoveFavoriteUseCase } from '../../application/use-cases/remove-favorite.use-case';
import { FavoriteGuideParamDto } from '../dtos/favorite-guide-param.dto';

@ApiTags('Favoritos')
@ApiBearerAuth('access-token')
@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly listFavoritesUseCase: ListFavoritesUseCase,
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
  ) {}

  @Get()
  @RequirePermissions(Permission.FAVORITES_MANAGE)
  @ApiOperation({ summary: 'Listar mis guías favoritas' })
  @ApiOkResponse({ type: [GuiaResumenResponseDto] })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async list(@CurrentUser() user: AuthenticatedUser): Promise<GuiaResumenResponseDto[]> {
    const favorites = await this.listFavoritesUseCase.execute(user.id);

    return favorites.map((favorite) => GuiaResumenResponseDto.from(favorite));
  }

  @Put(':guideId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.FAVORITES_MANAGE)
  @ApiOperation({ summary: 'Marcar una guía como favorita' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async add(
    @Param() params: FavoriteGuideParamDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.addFavoriteUseCase.execute({ userId: user.id, guideId: params.guideId });
  }

  @Delete(':guideId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.FAVORITES_MANAGE)
  @ApiOperation({ summary: 'Quitar una guía de mis favoritos' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async remove(
    @Param() params: FavoriteGuideParamDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.removeFavoriteUseCase.execute({ userId: user.id, guideId: params.guideId });
  }
}
