import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsUUID, Length } from 'class-validator';
import { MAX_QUESTION_LENGTH } from '../../domain/entities/doubt.entity';

export class CrearDudaDto {
  @ApiProperty({
    example: '¿Cómo puedo enviar un correo con una foto?',
    minLength: 3,
    maxLength: MAX_QUESTION_LENGTH,
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(3, MAX_QUESTION_LENGTH)
  duda: string;

  @ApiProperty({
    format: 'uuid',
    description: 'Categoría elegida como tema de la duda',
  })
  @IsUUID()
  categoriaId: string;
}
