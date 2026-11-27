import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class HelpRequestIdParamDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string;
}
