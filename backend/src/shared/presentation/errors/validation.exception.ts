import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export interface ValidationDetail {
  field: string;
  message: string;
}

export function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationDetail[] {
  return errors.flatMap((error) => {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;
    const ownDetails = Object.values(error.constraints ?? {}).map((message) => ({
      field,
      message,
    }));
    const childDetails = flattenValidationErrors(error.children ?? [], field);

    return [...ownDetails, ...childDetails];
  });
}

export class ValidationException extends BadRequestException {
  constructor(details: ValidationDetail[]) {
    super({
      code: 'VALIDATION_ERROR',
      message: 'La solicitud contiene datos inválidos.',
      details,
    });
  }
}
