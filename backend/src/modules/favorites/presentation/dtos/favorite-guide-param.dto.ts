import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class FavoriteGuideParamDto {
  @ApiProperty({ example: 'enviar-correo-foto' })
  @IsString()
  @MaxLength(80)
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'El id de la guía solo admite minúsculas, números y guiones.',
  })
  guideId: string;
}
