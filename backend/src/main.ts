import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { flattenValidationErrors, ValidationException } from './shared/presentation/errors/validation.exception';
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', { exclude: ['health'] });
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      exceptionFactory: (errors) =>
        new ValidationException(flattenValidationErrors(errors)),
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('CLENA - Autoaprendizaje digital')
    .setDescription(
      'API de autenticación, usuarios, roles y permisos. Los permisos de roles inferiores pueden administrarse desde /api/v1/roles.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Autenticación')
    .addTag('Usuarios')
    .addTag('Roles y permisos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'CLENA API - Documentación',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
