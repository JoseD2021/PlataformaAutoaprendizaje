import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { GetAllCategoriesUseCase } from '../../application/use-cases/get-all-categories.use-case';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CategoryResponseDto } from '../dtos/category-response.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  async getAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.getAllCategoriesUseCase.execute();

    return categories.map((category) => CategoryResponseDto.from(category));
  }

  @Post()
  @RequirePermissions(Permission.CATEGORIES_CREATE)
  @ApiBearerAuth('access-token')
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