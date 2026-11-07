import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SESSION_CACHE } from '../../shared/application/ports/session-cache.port';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityModule } from '../../shared/infrastructure/security/security.module';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard';
import { TOKEN_SERVICE } from '../../shared/application/ports/token-service.port';
import { UsersModule } from '../users/users.module';
import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories/refresh-token.repository';
import { CloseAccountUseCase } from './application/use-cases/close-account.use-case';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { RefreshTokenOrmEntity } from './infrastructure/persistence/refresh-token.orm-entity';
import { TypeOrmRefreshTokenRepository } from './infrastructure/persistence/typeorm-refresh-token.repository';
import { JwtTokenService } from './infrastructure/security/jwt-token.service';
import { SessionCacheService } from './infrastructure/security/session-cache.service';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshTokenOrmEntity]),
    UsersModule,
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GetProfileUseCase,
    RegisterUserUseCase,
    CloseAccountUseCase,
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: TypeOrmRefreshTokenRepository },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: SESSION_CACHE, useClass: SessionCacheService },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AuthModule {}
