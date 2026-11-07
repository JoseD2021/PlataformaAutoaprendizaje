import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { buildTypeOrmOptions } from './shared/infrastructure/database/typeorm-options';
import { HealthController } from './shared/presentation/health.controller';
import { GuidesModule } from './modules/guides/guides.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => buildTypeOrmOptions(process.env) }),
    UsersModule,
    AuthModule,
    UsersModule,
    AuthModule,
    GuidesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
