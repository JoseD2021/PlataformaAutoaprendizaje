import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CategoryResponseDto } from '../dtos/category-response.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@ApiTags('Categorías')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

  @Post()
  @RequirePermissions(Permission.CATEGORIES_CREATE)
  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<CategoryResponseDto> {
    const category = await this.createCategoryUseCase.execute(dto, {
      permissions: actor.permissions,
    });

    return CategoryResponseDto.from(category);
  }
}