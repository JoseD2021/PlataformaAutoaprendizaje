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

import { Guide } from '../../src/modules/guides/domain/entities/guide.entity';
import { GuideStep } from '../../src/modules/guides/domain/entities/guide-step.entity';
import { GuideImage } from '../../src/modules/guides/domain/entities/guide-image.entity';
import { GuideStatus } from '../../src/modules/guides/domain/enums/guide-status.enum';
import {
  GuideFilters,
  GuideRepository,
  PaginatedGuides,
  PaginationOptions as GuidePaginationOptions,
} from '../../src/modules/guides/domain/repositories/guide.repository';
import { GuideImageRepository } from '../../src/modules/guides/domain/repositories/guide-image.repository';
import { RoomRule } from '../../src/modules/room-info/domain/entities/room-rule.entity';
import { ScheduleEntry } from '../../src/modules/room-info/domain/entities/schedule-entry.entity';
import { RoomInfoRepository } from '../../src/modules/room-info/domain/repositories/room-info.repository';
import { CategoryLookup } from '../../src/modules/guides/application/ports/category-lookup.port';
import { Favorite } from '../../src/modules/favorites/domain/entities/favorite.entity';
import { FavoriteRepository } from '../../src/modules/favorites/domain/repositories/favorite.repository';


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

export class InMemoryGuideRepository extends GuideRepository {
  private readonly guides = new Map<string, Guide>();

  constructor(seed: Guide[] = []) {
    super();
    seed.forEach((guide) => this.guides.set(guide.id, guide));
  }

  async findById(id: string): Promise<Guide | null> {
    return this.guides.get(id) ?? null;
  }

  async existsById(id: string): Promise<boolean> {
    return this.guides.has(id);
  }

  async save(guide: Guide): Promise<Guide> {
    this.guides.set(guide.id, guide);

    return guide;
  }

  async paginate(
    filters: GuideFilters,
    options: GuidePaginationOptions,
  ): Promise<PaginatedGuides> {
    const search = filters.search?.toLowerCase();

    const filtered = [...this.guides.values()]
      .filter((guide) => !filters.categoryId || guide.categoryId === filters.categoryId)
      .filter((guide) => !filters.status || guide.status === filters.status)
      .filter((guide) => !search || guide.title.toLowerCase().includes(search))
      .sort(
        (a, b) =>
          Number(b.isMostRequested) - Number(a.isMostRequested) ||
          a.title.localeCompare(b.title),
      );
    const start = (options.page - 1) * options.limit;

    return {
      items: filtered.slice(start, start + options.limit),
      total: filtered.length,
    };
  }

  async delete(id: string): Promise<void> {
    this.guides.delete(id);
  }

  get all(): Guide[] {
    return [...this.guides.values()];
  }
}

export class InMemoryGuideImageRepository extends GuideImageRepository {
  private readonly images = new Map<string, GuideImage>();

  constructor(seed: GuideImage[] = []) {
    super();
    seed.forEach((image) => this.images.set(image.id, image));
  }

  async save(image: GuideImage): Promise<GuideImage> {
    this.images.set(image.id, image);

    return image;
  }

  async findById(id: string): Promise<GuideImage | null> {
    return this.images.get(id) ?? null;
  }

  get all(): GuideImage[] {
    return [...this.images.values()];
  }
}

export class InMemoryFavoriteRepository extends FavoriteRepository {
  private readonly favorites: Favorite[] = [];

  constructor(seed: Favorite[] = []) {
    super();
    this.favorites.push(...seed);
  }

  async exists(userId: string, guideId: string): Promise<boolean> {
    return this.favorites.some((f) => f.userId === userId && f.guideId === guideId);
  }

  async add(favorite: Favorite): Promise<void> {
    const already = await this.exists(favorite.userId, favorite.guideId);

    if (!already) {
      this.favorites.push(favorite);
    }
  }

  async remove(userId: string, guideId: string): Promise<void> {
    const index = this.favorites.findIndex(
      (f) => f.userId === userId && f.guideId === guideId,
    );

    if (index >= 0) {
      this.favorites.splice(index, 1);
    }
  }

  async listGuideIdsByUser(userId: string): Promise<string[]> {
    return this.favorites
      .filter((f) => f.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((f) => f.guideId);
  }

  get all(): Favorite[] {
    return [...this.favorites];
  }
}

export class FakeCategoryLookup extends CategoryLookup {
  constructor(private readonly bySlug: Record<string, string> = {}) {
    super();
  }

  async findIdBySlug(slug: string): Promise<string | null> {
    return this.bySlug[slug] ?? null;
  }

  async existsById(id: string): Promise<boolean> {
    return Object.values(this.bySlug).includes(id);
  }
}

export class InMemoryRoomInfoRepository extends RoomInfoRepository {
  private schedules: ScheduleEntry[];
  private rules: RoomRule[];

  constructor(seed: { schedules?: ScheduleEntry[]; rules?: RoomRule[] } = {}) {
    super();
    this.schedules = [...(seed.schedules ?? [])];
    this.rules = [...(seed.rules ?? [])];
  }

  async findSchedules(): Promise<ScheduleEntry[]> {
    return [...this.schedules].sort((a, b) => a.order - b.order);
  }

  async findRules(): Promise<RoomRule[]> {
    return [...this.rules].sort((a, b) => a.order - b.order);
  }

  async countSchedules(): Promise<number> {
    return this.schedules.length;
  }

  async countRules(): Promise<number> {
    return this.rules.length;
  }

  async saveSchedules(entries: ScheduleEntry[]): Promise<void> {
    this.schedules.push(...entries);
  }

  async saveRules(rules: RoomRule[]): Promise<void> {
    this.rules.push(...rules);
  }

  async replaceAll(schedules: ScheduleEntry[], rules: RoomRule[]): Promise<void> {
    this.schedules = [...schedules];
    this.rules = [...rules];
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

export function makeGuideStep(
  overrides: Partial<Parameters<typeof GuideStep.create>[0]> = {},
): GuideStep {
  return GuideStep.create({
    id: 'step-1',
    position: 1,
    shortTitle: 'Redactar',
    action: 'Haz clic en el botón Redactar',
    description: 'Está arriba a la izquierda y tiene un lápiz dibujado.',
    ...overrides,
  });
}

export function makeGuide(overrides: Partial<Parameters<typeof Guide.create>[0]> = {}): Guide {
  return Guide.create({
    id: 'enviar-correo-foto',
    title: 'Enviar un correo con una foto',
    categoryId: 'correo',
    estimatedMinutes: 3,
    status: GuideStatus.PUBLISHED,
    steps: [makeGuideStep()],
    ...overrides,
  });
}

export function makeGuideImage(
  overrides: Partial<Parameters<typeof GuideImage.create>[0]> = {},
): GuideImage {
  return GuideImage.create({
    id: '8d9b7d6e-4b1a-4f3e-9c2a-1b2c3d4e5f60',
    fileName: 'paso-1.png',
    mimeType: 'image/png',
    data: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
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

export function makeScheduleEntry(
  overrides: Partial<Parameters<typeof ScheduleEntry.create>[0]> = {},
): ScheduleEntry {
  return ScheduleEntry.create({
    id: 'schedule-1',
    days: 'Lunes a viernes',
    hours: '8:00 a.m. a 5:00 p.m.',
    order: 1,
    ...overrides,
  });
}

export function makeFavorite(
  overrides: Partial<Parameters<typeof Favorite.create>[0]> = {},
): Favorite {
  return Favorite.create({
    userId: 'user-1',
    guideId: 'enviar-correo-foto',
    ...overrides,
  });
}

export function makeRoomRule(
  overrides: Partial<Parameters<typeof RoomRule.create>[0]> = {},
): RoomRule {
  return RoomRule.create({
    id: 'rule-1',
    text: 'Pide ayuda a un monitor si te pierdes.',
    order: 1,
    ...overrides,
  });
}