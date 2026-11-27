import { ApiProperty } from '@nestjs/swagger';
import type { HelpRequestModel } from '../../application/models/help-request-view.model';
import { HelpRequestStatus } from '../../domain/enums/help-request-status.enum';

export class SolicitudAyudaResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 5, nullable: true, type: Number })
  puesto: number | null;

  @ApiProperty({ example: 'enviar-correo-foto', nullable: true, type: String })
  guiaId: string | null;

  @ApiProperty({ example: 'Enviar un correo con una foto', nullable: true, type: String })
  guiaTitulo: string | null;

  @ApiProperty({ example: 3, nullable: true, type: Number })
  paso: number | null;

  @ApiProperty({
    example: 'Ana Pérez',
    nullable: true,
    type: String,
    description: 'Nombre si pidió ayuda con sesión iniciada',
  })
  solicitante: string | null;

  @ApiProperty({ enum: HelpRequestStatus, example: HelpRequestStatus.PENDING })
  estado: HelpRequestStatus;

  @ApiProperty({ example: '2026-11-26T15:30:00.000Z' })
  creadaEn: string;

  static from(source: HelpRequestModel): SolicitudAyudaResponseDto {
    const dto = new SolicitudAyudaResponseDto();
    dto.id = source.id;
    dto.puesto = source.stationNumber;
    dto.guiaId = source.guideId;
    dto.guiaTitulo = source.guideTitle;
    dto.paso = source.stepNumber;
    dto.solicitante = source.requesterName;
    dto.estado = source.status;
    dto.creadaEn = source.createdAt.toISOString();

    return dto;
  }
}
