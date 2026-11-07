import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../../../../shared/application/ports/password-hasher.port';
import { CreateDefaultRolesUseCase } from '../../application/use-cases/create-default-roles.use-case';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/enums/role.enum';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';

/**
 * Siembra el primer administrador de forma idempotente.
 *
 * Solo actúa cuando ADMIN_EMAIL y ADMIN_PASSWORD están definidos. Es la vía
 * para poder iniciar sesión en una base de datos recién migrada.
 */
@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    private readonly createDefaultRoles: CreateDefaultRolesUseCase,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.createDefaultRoles.execute();

      const rawEmail = this.config.get<string>('ADMIN_EMAIL')?.trim();
      const password = this.config.get<string>('ADMIN_PASSWORD');
      const fullName =
        this.config.get<string>('ADMIN_FULL_NAME')?.trim() ||
        'Administrador CLENA';

      if (!rawEmail || !password) {
        this.logger.warn(
          'Roles por defecto creados, pero no se creó el administrador inicial porque faltan ADMIN_EMAIL o ADMIN_PASSWORD.',
        );
        return;
      }

      const email = Email.create(rawEmail);

      if (await this.users.existsByEmail(email.value)) {
        return;
      }

      const user = User.create({
        id: randomUUID(),
        email: email.value,
        passwordHash: await this.passwordHasher.hash(password),
        fullName,
        role: Role.ADMINISTRADOR,
      });

      await this.users.save(user);
      this.logger.log(`Administrador inicial creado: ${email.value}`);
    } catch (error) {
      this.logger.error(
        'No se pudo crear el administrador inicial. Revisa ADMIN_EMAIL, ADMIN_PASSWORD y ADMIN_FULL_NAME.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
