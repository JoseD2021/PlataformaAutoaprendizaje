import { ApplicationError } from '../../../../shared/application/errors/application.error';

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super('INVALID_CREDENTIALS', 'El correo o la contraseña son incorrectos.', 401);
  }
}

export class InvalidTokenError extends ApplicationError {
  constructor(message = 'El token es inválido o ha expirado.') {
    super('INVALID_TOKEN', message, 401);
  }
}

export class PrivacyTermsNotAcceptedError extends ApplicationError {
  constructor() {
    super(
      'PRIVACY_TERMS_NOT_ACCEPTED',
      'Debes aceptar el aviso de privacidad para crear una cuenta.',
      400,
    );
  }
}

export class PrivacyTermsVersionMismatchError extends ApplicationError {
  constructor(currentVersion: string) {
    super(
      'PRIVACY_TERMS_VERSION_MISMATCH',
      `El aviso de privacidad cambió. Revisa y acepta la versión vigente (${currentVersion}).`,
      409,
    );
  }
}
