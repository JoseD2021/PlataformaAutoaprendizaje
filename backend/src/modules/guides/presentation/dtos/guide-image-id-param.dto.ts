import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GuideImageIdParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}
