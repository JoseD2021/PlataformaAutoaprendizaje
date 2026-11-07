export interface RefreshTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface CreateRefreshTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  now?: Date;
}

/**
 * Sesión de refresco de un usuario.
 *
 * El token de refresco nunca se guarda en claro: se persiste su hash. Cada
 * refresh rota el hash dentro de la misma sesión, de modo que un token robado
 * deja de funcionar y la reutilización puede detectarse.
 */
export class RefreshToken {
  private constructor(private props: RefreshTokenProps) {}

  static create(props: CreateRefreshTokenProps): RefreshToken {
    const now = props.now ?? new Date();

    return new RefreshToken({
      id: props.id,
      userId: props.userId,
      tokenHash: props.tokenHash,
      expiresAt: props.expiresAt,
      lastUsedAt: now,
      createdAt: now,
      revokedAt: null,
      ipAddress: props.ipAddress ?? null,
      userAgent: props.userAgent ?? null,
    });
  }

  static rehydrate(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get lastUsedAt(): Date {
    return this.props.lastUsedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get revokedAt(): Date | null {
    return this.props.revokedAt;
  }

  get ipAddress(): string | null | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | null | undefined {
    return this.props.userAgent;
  }

  isActive(now: Date = new Date()): boolean {
    return this.props.revokedAt === null && this.props.expiresAt.getTime() > now.getTime();
  }

  rotate(tokenHash: string, expiresAt: Date, now: Date = new Date()): void {
    this.props.tokenHash = tokenHash;
    this.props.expiresAt = expiresAt;
    this.props.lastUsedAt = now;
  }

  revoke(now: Date = new Date()): void {
    if (this.props.revokedAt === null) {
      this.props.revokedAt = now;
    }
  }
}
