import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { GetRoomInfoUseCase } from '../../application/use-cases/get-room-info.use-case';
import { SalaInformacionResponseDto } from '../dtos/sala-informacion-response.dto';

@ApiTags('Sala')
@Controller('sala')
export class RoomInfoController {
  constructor(private readonly getRoomInfoUseCase: GetRoomInfoUseCase) {}

  @Get('informacion')
  @Public()
  @ApiOperation({
    summary: 'Ver el horario de atención y las normas de la sala',
    description:
      'Público y sin paginación. Horarios y normas vienen ya ordenados para mostrarse tal cual.',
  })
  @ApiOkResponse({ type: SalaInformacionResponseDto })
  async getInfo(): Promise<SalaInformacionResponseDto> {
    const info = await this.getRoomInfoUseCase.execute();

    return SalaInformacionResponseDto.from(info);
  }
}