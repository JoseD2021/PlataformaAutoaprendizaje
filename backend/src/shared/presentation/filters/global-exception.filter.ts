import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { ApplicationError } from '../../application/errors/application.error';
import { DomainError } from '../../domain/errors/domain.error';

interface ErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    path: string;
    method: string;
    requestId: string;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const requestIdHeader = request.headers['x-request-id'];
    const requestId =
      typeof requestIdHeader === 'string' && requestIdHeader.trim()
        ? requestIdHeader
        : randomUUID();

    const { status, code, message, details } = this.resolve(exception);

    response.setHeader('x-request-id', requestId);
    response.status(status).json({
      success: false,
      error: { code, message, ...(details === undefined ? {} : { details }) },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.originalUrl ?? request.url,
        method: request.method,
        requestId,
      },
    } satisfies ErrorBody);
  }

  private resolve(exception: unknown): {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    if (exception instanceof ApplicationError) {
      return {
        status: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.details,
      };
    }

    if (exception instanceof DomainError) {
      return {
        status: this.domainStatus(exception.kind),
        code: exception.code,
        message: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      return this.fromHttpException(exception);
    }

    this.logger.error(
      'Excepción no controlada',
      exception instanceof Error ? exception.stack : String(exception),
    );

    return {
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'Ocurrió un error interno. Intenta nuevamente más tarde.',
    };
  }

  private fromHttpException(exception: HttpException) {
    const status = exception.getStatus();
    const payload = exception.getResponse();
    let code = this.defaultCode(status);
    let message = exception.message;
    let details: unknown;

    if (typeof payload === 'string') {
      message = payload;
    } else if (payload && typeof payload === 'object') {
      const body = payload as Record<string, unknown>;

      if (typeof body.code === 'string') {
        code = body.code;
      }

      if (typeof body.message === 'string') {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = 'La solicitud contiene datos inválidos.';
        details = body.message;
      }

      if (body.details !== undefined) {
        details = body.details;
      }
    }

    return { status, code, message, details };
  }

  private domainStatus(kind: DomainError['kind']): number {
    switch (kind) {
      case 'forbidden':
        return 403;
      case 'conflict':
        return 409;
      default:
        return 422;
    }
  }

  private defaultCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'UNPROCESSABLE_ENTITY';
      case 429:
        return 'TOO_MANY_REQUESTS';
      default:
        return status >= 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR';
    }
  }
}
