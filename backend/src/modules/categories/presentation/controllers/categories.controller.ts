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
  ApiCreatedResponse,
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
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';
import { GetAllCategoriesUseCase } from '../../application/use-cases/get-all-categories.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CategoryResponseDto } from '../dtos/category-response.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
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

  @Patch(':id')
  @RequirePermissions(Permission.CATEGORIES_MANAGE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Editar una categoría' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  @ApiResponse({ status: 422, type: ApiErrorResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<CategoryResponseDto> {
    const category = await this.updateCategoryUseCase.execute(
      {
        id,
        name: dto.name,
        iconName: dto.iconName,
        description: dto.description,
        isFeatured: dto.isFeatured,
      },
      { permissions: actor.permissions },
    );

    return CategoryResponseDto.from(category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.CATEGORIES_MANAGE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async remove(
    @Param('id') id: string,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteCategoryUseCase.execute(
      { id },
      { permissions: actor.permissions },
    );
  }
}