import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationErrorDetailDto {
  @ApiProperty({ example: 'email' })
  field: string;

  @ApiProperty({ example: 'email must be an email' })
  message: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({
    example: {
      code: 'VALIDATION_ERROR',
      message: 'La solicitud contiene datos inválidos.',
      details: [{ field: 'email', message: 'email must be an email' }],
    },
  })
  error: {
    code: string;
    message: string;
    details?: unknown;
  };

  @ApiProperty({
    example: {
      timestamp: '2026-01-01T00:00:00.000Z',
      path: '/api/v1/auth/login',
      method: 'POST',
      requestId: '8d9b7d6e-4b1a-4f3e-9c2a-1b2c3d4e5f60',
    },
  })
  meta: {
    timestamp: string;
    path: string;
    method: string;
    requestId: string;
  };
}

export class ValidationErrorResponseDto extends ApiErrorResponseDto {
  @ApiPropertyOptional({ type: [ValidationErrorDetailDto] })
  declare details?: ValidationErrorDetailDto[];
}
