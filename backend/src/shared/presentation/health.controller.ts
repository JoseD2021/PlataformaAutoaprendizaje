import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../presentation/decorators/public.decorator';

@ApiTags('Salud')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Verificar que el servicio está en línea' })
  check() {
    return { status: 'ok' };
  }
}
