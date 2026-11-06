import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PASSWORD_HASHER, PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { User } from '../../../users/domain/entities/user.entity';
import { Role } from '../../../users/domain/enums/role.enum';
import { ROLE_REPOSITORY, RoleRepository } from '../../../users/domain/repositories/role.repository';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { Email } from '../../../users/domain/value-objects/email.vo';
import { EmailAlreadyInUseError, RoleNotFoundError } from '../../../users/application/errors/user.errors';

export interface RegisterUserInput {
  email: string;
  password: string;
  fullName: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(ROLE_REPOSITORY) private readonly roles: RoleRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = Email.create(input.email);
    const role = Role.USUARIO;
    const roleDefinition = await this.roles.findByRole(role);

    if (!roleDefinition) {
      throw new RoleNotFoundError(role);
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
