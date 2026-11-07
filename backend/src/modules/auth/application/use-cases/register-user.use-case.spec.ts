import { RegisterUserUseCase } from './register-user.use-case';
import { Role } from '../../../users/domain/enums/role.enum';
import { EmailAlreadyInUseError, RoleNotFoundError } from '../../../users/application/errors/user.errors';
import {
  FakePasswordHasher,
  InMemoryRoleRepository,
  InMemoryUserRepository,
  makeRole,
  makeUser,
} from '../../../../../test/support/fakes';

describe('RegisterUserUseCase', () => {
  let users: InMemoryUserRepository;
  let roles: InMemoryRoleRepository;
  let passwordHasher: FakePasswordHasher;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    roles = new InMemoryRoleRepository();
    passwordHasher = new FakePasswordHasher();
    useCase = new RegisterUserUseCase(users, roles, passwordHasher);
  });

  it('registra un usuario común por defecto y cifra la contraseña', async () => {
    const user = await useCase.execute({
      email: '  NUEVO@CLENA.LOCAL ',
      password: 'Password123',
      fullName: '  Nuevo Usuario  ',
    });

    expect(user.email).toBe('nuevo@clena.local');
    expect(user.fullName).toBe('Nuevo Usuario');
    expect(user.role).toBe(Role.USUARIO);
    expect(user.passwordHash).toBe('hashed:Password123');
    expect(user.isActive).toBe(true);
    expect(users.all).toHaveLength(1);
  });

  it('rechaza un correo ya registrado', async () => {
    users = new InMemoryUserRepository([makeUser()]);
    useCase = new RegisterUserUseCase(users, roles, passwordHasher);

    await expect(
      useCase.execute({
        email: 'usuario@clena.local',
        password: 'Password123',
        fullName: 'Otro Usuario',
      }),
    ).rejects.toThrow(EmailAlreadyInUseError);
  });

  it('rechaza el registro si no existe la definición del rol usuario', async () => {
    roles = new InMemoryRoleRepository([makeRole(Role.ADMINISTRADOR, 30)]);
    useCase = new RegisterUserUseCase(users, roles, passwordHasher);

    await expect(
      useCase.execute({
        email: 'nuevo@clena.local',
        password: 'Password123',
        fullName: 'Nuevo Usuario',
      }),
    ).rejects.toThrow(RoleNotFoundError);
  });
});
