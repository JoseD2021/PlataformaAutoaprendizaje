import { RefreshToken } from '../../src/modules/auth/domain/entities/refresh-token.entity';
import { InvalidTokenError } from '../../src/modules/auth/application/errors/auth.errors';
import { RefreshTokenRepository } from '../../src/modules/auth/domain/repositories/refresh-token.repository';
import { RoleDefinition } from '../../src/modules/users/domain/entities/role-definition.entity';
import { User } from '../../src/modules/users/domain/entities/user.entity';
import { DEFAULT_ROLES } from '../../src/modules/users/domain/constants/default-roles';
import { Permission } from '../../src/modules/users/domain/enums/permission.enum';
import { Role } from '../../src/modules/users/domain/enums/role.enum';
import {
  PaginatedUsers,
  PaginationOptions,
  UserRepository,
} from '../../src/modules/users/domain/repositories/user.repository';
import { RoleRepository } from '../../src/modules/users/domain/repositories/role.repository';
import { PasswordHasher } from '../../src/shared/application/ports/password-hasher.port';
import { TokenHasher } from '../../src/shared/application/ports/token-hasher.port';
import {
  AccessTokenClaims,
  IssuedToken,
  RefreshTokenClaims,
  TokenService,
} from '../../src/shared/application/ports/token-service.port';

export class InMemoryUserRepository extends UserRepository {
  private readonly users = new Map<string, User>();

  constructor(seed: User[] = []) {
    super();
    seed.forEach((user) => this.users.set(user.id, user));
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();

    return [...this.users.values()].find((user) => user.email === normalized) ?? null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);

    return user;
  }

  async paginate(options: PaginationOptions): Promise<PaginatedUsers> {
    const all = [...this.users.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const start = (options.page - 1) * options.limit;

    return {
      items: all.slice(start, start + options.limit),
      total: all.length,
    };
  }

  async countByRole(role: string): Promise<number> {
    return [...this.users.values()].filter((user) => user.role === role).length;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  get all(): User[] {
    return [...this.users.values()];
  }
}

export class InMemoryRoleRepository extends RoleRepository {
  private readonly roles = new Map<Role, RoleDefinition>();

  constructor(seed: RoleDefinition[] = defaultRoles()) {
    super();
    seed.forEach((role) => this.roles.set(role.role, role));
  }

  async findAll(): Promise<RoleDefinition[]> {
    return [...this.roles.values()];
  }

  async findByRole(role: Role): Promise<RoleDefinition | null> {
    return this.roles.get(role) ?? null;
  }

  async save(roleDefinition: RoleDefinition): Promise<RoleDefinition> {
    this.roles.set(roleDefinition.role, roleDefinition);

    return roleDefinition;
  }

  async delete(role: Role): Promise<void> {
    this.roles.delete(role);
  }
}

export class InMemoryRefreshTokenRepository extends RefreshTokenRepository {
  private readonly tokens = new Map<string, RefreshToken>();

  async findById(id: string): Promise<RefreshToken | null> {
    return this.tokens.get(id) ?? null;
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    this.tokens.set(refreshToken.id, refreshToken);

    return refreshToken;
  }

  async revokeAllForUser(userId: string): Promise<void> {
    for (const token of this.tokens.values()) {
      if (token.userId === userId) {
        token.revoke();
      }
    }
  }

  get all(): RefreshToken[] {
    return [...this.tokens.values()];
  }
}

export class FakePasswordHasher extends PasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return `hashed:${plainPassword}`;
  }

  async compare(plainPassword: string, passwordHash: string): Promise<boolean> {
    return passwordHash === `hashed:${plainPassword}`;
  }
}

export class FakeTokenHasher extends TokenHasher {
  hash(token: string): string {
    return `hash:${token}`;
  }

  matches(token: string, tokenHash: string): boolean {
    return this.hash(token) === tokenHash;
  }
}

export class FakeTokenService extends TokenService {
  private sequence = 0;

  constructor(
    private readonly accessTtl = 900,
    private readonly refreshTtl = 604_800,
  ) {
    super();
  }

  async signAccessToken(input: { userId: string; role: Role }): Promise<IssuedToken> {
    return this.issue(`access.${input.userId}.${input.role}.${++this.sequence}`, this.accessTtl);
  }

  async signRefreshToken(input: { userId: string; sessionId: string }): Promise<IssuedToken> {
    return this.issue(
      `refresh.${input.userId}.${input.sessionId}.${++this.sequence}`,
      this.refreshTtl,
    );
  }

  async verifyAccessToken(token: string): Promise<AccessTokenClaims> {
    const [type, sub, role] = token.split('.');

    if (type !== 'access' || !sub || !role) {
      throw new InvalidTokenError();
    }

    return { sub, role: role as Role, type: 'access' };
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenClaims> {
    const [type, sub, sid] = token.split('.');

    if (type !== 'refresh' || !sub || !sid) {
      throw new InvalidTokenError();
    }

    return { sub, sid, type: 'refresh' };
  }

  private issue(token: string, expiresIn: number): IssuedToken {
    return {
      token,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    };
  }
}

export function defaultRoles(): RoleDefinition[] {
  return DEFAULT_ROLES.map(
    (role) =>
      new RoleDefinition(role.role, role.name, role.rank, [...role.permissions], new Date()),
  );
}

export function makeUser(overrides: Partial<Parameters<typeof User.create>[0]> = {}): User {
  return User.create({
    id: 'user-1',
    email: 'usuario@clena.local',
    passwordHash: 'hashed:Password123',
    fullName: 'Usuario de Prueba',
    role: Role.USUARIO,
    ...overrides,
  });
}

export function makeRole(
  role: Role,
  rank: number,
  permissions: Permission[] = [],
): RoleDefinition {
  return new RoleDefinition(role, role, rank, permissions, new Date());
}
