import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { GetPrivacyTermsUseCase } from '../../application/use-cases/get-privacy-terms.use-case';
import { PrivacyTermsResponseDto } from '../dtos/privacy-terms-response.dto';

@ApiTags('Privacidad')
@Controller('privacy')
export class PrivacyTermsController {
  constructor(private readonly getPrivacyTermsUseCase: GetPrivacyTermsUseCase) {}

  @Public()
  @Get('terms')
  @ApiOperation({
    summary: 'Consultar la versión vigente del aviso de privacidad',
    description:
      'Público. Devuelve el texto y la versión que el usuario debe aceptar al registrarse.',
  })
  @ApiOkResponse({ type: PrivacyTermsResponseDto })
  getTerms(): PrivacyTermsResponseDto {
    return PrivacyTermsResponseDto.from(this.getPrivacyTermsUseCase.execute());
  }
}
