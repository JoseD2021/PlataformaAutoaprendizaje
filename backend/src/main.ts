import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true });

  const config = new DocumentBuilder()
    .setTitle('CLENA - Autoaprendizaje digital')
    .setDescription(
      'API de autenticación, usuarios, roles, permisos y guías paso a paso. Los permisos de roles inferiores pueden administrarse desde /api/v1/roles.',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addTag('Autenticación')
    .addTag('Usuarios')
    .addTag('Roles y permisos')
    .addTag('Guías')
    .addTag('Sala')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'CLENA API - Documentación',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();