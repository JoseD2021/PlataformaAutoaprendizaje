import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { RoomRule } from '../../domain/entities/room-rule.entity';
import { ScheduleEntry } from '../../domain/entities/schedule-entry.entity';
import {
  ROOM_INFO_REPOSITORY,
  RoomInfoRepository,
} from '../../domain/repositories/room-info.repository';

// Datos ficticios de demostración. Confirmar los reales con el CLENA.
const DEMO_SCHEDULES = [
  { days: 'Lunes a viernes', hours: '8:00 a.m. a 5:00 p.m.' },
  { days: 'Sábado', hours: '9:00 a.m. a 12:00 m.' },
  { days: 'Domingo y festivos', hours: 'Cerrado' },
];

const DEMO_RULES = [
  'Pide ayuda a un monitor si te pierdes.',
  'Cierra tu sesión de correo y redes al terminar.',
  'Mantén el volumen bajo o usa audífonos.',
  'No se permite comer ni beber junto a los computadores.',
];

/** Siembra el horario y las normas de demostración de forma idempotente (SEED_DEMO_DATA=true). */
@Injectable()
export class RoomInfoSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RoomInfoSeedService.name);

  constructor(
    @Inject(ROOM_INFO_REPOSITORY) private readonly roomInfo: RoomInfoRepository,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get<string>('SEED_DEMO_DATA') !== 'true') {
      return;
    }

    try {
      let schedules = 0;
      let rules = 0;

      if ((await this.roomInfo.countSchedules()) === 0) {
        await this.roomInfo.saveSchedules(
          DEMO_SCHEDULES.map((data, index) =>
            ScheduleEntry.create({ id: randomUUID(), order: index + 1, ...data }),
          ),
        );
        schedules = DEMO_SCHEDULES.length;
      }

      if ((await this.roomInfo.countRules()) === 0) {
        await this.roomInfo.saveRules(
          DEMO_RULES.map((text, index) =>
            RoomRule.create({ id: randomUUID(), order: index + 1, text }),
          ),
        );
        rules = DEMO_RULES.length;
      }

      this.logger.log(`Información de la sala sembrada: ${schedules} horarios y ${rules} normas nuevas.`);
    } catch (error) {
      this.logger.error(
        'No se pudo sembrar la información de la sala. ¿Se ejecutó la migración?',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}