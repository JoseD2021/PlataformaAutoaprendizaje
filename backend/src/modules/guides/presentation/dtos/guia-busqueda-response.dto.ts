import { ApiProperty } from '@nestjs/swagger';

export class GuiaBusquedaItemDto {
  @ApiProperty({ example: 'b1f0c7de-0000-4000-8000-000000000001' })
  id: string;

  @ApiProperty({ example: 'Enviar archivos por correo' })
  title: string;

  @ApiProperty({ example: 5 })
  estimatedMinutes: number;

  @ApiProperty({ example: 'Correo' })
  categoryName: string;
}

export class GuiasBusquedaResponseDto {
  @ApiProperty({ type: [GuiaBusquedaItemDto] })
  items: GuiaBusquedaItemDto[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}