import { Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../application/models/authenticated-user.model';
import { UnauthorizedError } from '../../application/errors/common.errors';
import { SESSION_CACHE, SessionCache } from '../../application/ports/session-cache.port';
import { TOKEN_SERVICE, TokenService } from '../../application/ports/token-service.port';
import { GetPrincipalUseCase } from '../../../modules/users/application/use-cases/get-principal.use-case';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
    private readonly getPrincipal: GetPrincipalUseCase,
    @Inject(SESSION_CACHE) private readonly sessions: SessionCache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedError('Debes enviar un token de acceso Bearer.');
    }

    const claims = await this.tokenService.verifyAccessToken(token);
    const session = await this.sessions.findActive(claims.sid);

    if (!session || session.userId !== claims.sub) {
      throw new UnauthorizedError('La sesión ya no es válida.');
    }

    request.user = await this.getPrincipal.execute(claims.sub);

    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const header = request.headers.authorization;

    if (!header) {
      return null;
    }

    const [scheme, token] = header.split(' ');

    return scheme?.toLowerCase() === 'bearer' && token ? token : null;
  }
}
