import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import {
  flattenValidationErrors,
  ValidationException,
} from './shared/presentation/errors/validation.exception';
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exception.filter';

/** Configuración HTTP compartida entre la app real (main.ts) y los tests e2e. */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationException(flattenValidationErrors(errors)),
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
}