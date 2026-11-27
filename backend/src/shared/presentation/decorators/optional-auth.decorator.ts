import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Public } from './public.decorator';

export const OPTIONAL_AUTH_KEY = 'optionalAuth';

/**
 * Ruta pública que, si recibe un access token válido, igual identifica al usuario
 * (queda disponible con @CurrentUser). Un token inválido no da error: se trata
 * la petición como anónima.
 */
export const OptionalAuth = () => applyDecorators(Public(), SetMetadata(OPTIONAL_AUTH_KEY, true));
