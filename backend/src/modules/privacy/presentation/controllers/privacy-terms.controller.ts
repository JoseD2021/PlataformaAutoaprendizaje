import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../../../shared/application/models/authenticated-user.model';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { GetPrivacyTermsUseCase } from '../../application/use-cases/get-privacy-terms.use-case';
import { UpdatePrivacyTermsUseCase } from '../../application/use-cases/update-privacy-terms.use-case';
import { PrivacyTermsResponseDto } from '../dtos/privacy-terms-response.dto';
import { UpdatePrivacyTermsDto } from '../dtos/update-privacy-terms.dto';

@ApiTags('Privacidad')
@Controller('privacy')
export class PrivacyTermsController {
  constructor(
    private readonly getPrivacyTermsUseCase: GetPrivacyTermsUseCase,
    private readonly updatePrivacyTermsUseCase: UpdatePrivacyTermsUseCase,
  ) {}

  @Public()
  @Get('terms')
  @ApiOperation({
    summary: 'Consultar la versión vigente del aviso de privacidad',
    description:
      'Público. Devuelve el texto y la versión que el usuario debe aceptar al registrarse.',
  })
  @ApiOkResponse({ type: PrivacyTermsResponseDto })
  async getTerms(): Promise<PrivacyTermsResponseDto> {
    return PrivacyTermsResponseDto.from(await this.getPrivacyTermsUseCase.execute());
  }

  @Put('terms')
  @RequirePermissions(Permission.PRIVACY_TERMS_MANAGE)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Actualizar el aviso de privacidad vigente',
    description:
      'Reemplaza el aviso vigente completo. Al publicar una nueva versión, los nuevos registros deben aceptar esa versión.',
  })
  @ApiOkResponse({ type: PrivacyTermsResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  async updateTerms(
    @Body() dto: UpdatePrivacyTermsDto,
    @CurrentUser() actor: AuthenticatedUser,
  ): Promise<PrivacyTermsResponseDto> {
    const terms = await this.updatePrivacyTermsUseCase.execute(dto, {
      permissions: actor.permissions,
    });
    return PrivacyTermsResponseDto.from(terms);
  }
}
