import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { ApiErrorResponseDto } from '../../../../shared/presentation/dto/api-error-response.dto';
import { GetGuideImageUseCase } from '../../application/use-cases/get-guide-image.use-case';
import { GuideImageIdParamDto } from '../dtos/guide-image-id-param.dto';

@ApiTags('Guías')
@Controller('guides/images')
export class GuideImagesController {
  constructor(private readonly getGuideImage: GetGuideImageUseCase) {}

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Ver una imagen subida para una guía',
    description: 'Devuelve el contenido binario de la imagen guardada en la base de datos.',
  })
  @ApiOkResponse({ description: 'Contenido binario de la imagen.' })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponseDto })
  async detail(
    @Param() params: GuideImageIdParamDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const image = await this.getGuideImage.execute(params.id);

    response.setHeader('Content-Type', image.mimeType);
    response.setHeader(
      'Content-Disposition',
      `inline; filename*=UTF-8''${encodeURIComponent(image.fileName)}`,
    );
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    return new StreamableFile(image.data);
  }
}
