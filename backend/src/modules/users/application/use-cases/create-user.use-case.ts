import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PASSWORD_HASHER, PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/enums/role.enum';
import { CannotAssignRoleError } from '../../domain/errors/user.errors';
import { ROLE_REPOSITORY, RoleRepository } from '../../domain/repositories/role.repository';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';
import { EmailAlreadyInUseError, RoleNotFoundError } from '../errors/user.errors';

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role?: Role;
}

export interface CreateUserActor {
  id: string;
  roleRank: number;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput, actor: CreateUserActor): Promise<User> {
    const email = Email.create(input.email);
    const role = input.role ?? Role.USUARIO;
    const roleDefinition = await this.roles.findByRole(role);

    if (!roleDefinition) {
      throw new RoleNotFoundError(role);
    }

    if (roleDefinition.rank > actor.roleRank) {
      throw new CannotAssignRoleError(role);
    }

    if (await this.users.existsByEmail(email.value)) {
      throw new EmailAlreadyInUseError(email.value);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = User.create({
      id: randomUUID(),
      email: email.value,
      passwordHash,
      fullName: input.fullName,
      role,
    });

    return this.users.save(user);
  }
}
