import { CreateUserUseCase } from './create-user.use-case';
import { Role } from '../../domain/enums/role.enum';
import { CannotAssignRoleError } from '../../domain/errors/user.errors';
import { EmailAlreadyInUseError, RoleNotFoundError } from '../errors/user.errors';
import {
  FakePasswordHasher,
  InMemoryRoleRepository,
  InMemoryUserRepository,
  makeRole,
  makeUser,
} from '../../../../../test/support/fakes';

describe('CreateUserUseCase', () => {
  let users: InMemoryUserRepository;
  let roles: InMemoryRoleRepository;
  let passwordHasher: FakePasswordHasher;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    roles = new InMemoryRoleRepository();
    passwordHasher = new FakePasswordHasher();
    useCase = new CreateUserUseCase(users, roles, passwordHasher);
  });

  it('crea un usuario común por defecto y cifra la contraseña', async () => {
    const user = await useCase.execute(
      {
        email: '  NUEVO@CLENA.LOCAL ',
        password: 'Password123',
        fullName: '  Nuevo Usuario  ',
      },
      { id: 'admin-1', roleRank: 30 },
    );

    expect(user.email).toBe('nuevo@clena.local');
    expect(user.fullName).toBe('Nuevo Usuario');
    expect(user.role).toBe(Role.USUARIO);
    expect(user.passwordHash).toBe('hashed:Password123');
    expect(users.all).toHaveLength(1);
  });

  it('permite crear usuarios con un rol inferior o igual al del actor', async () => {
    const user = await useCase.execute(
      {
        email: 'clena@clena.local',
        password: 'Password123',
        fullName: 'Personal CLENA',
        role: Role.PERSONAL_CLENA,
      },
      { id: 'admin-1', roleRank: 30 },
    );

    expect(user.role).toBe(Role.PERSONAL_CLENA);
  });

  it('rechaza un correo ya registrado', async () => {
    users = new InMemoryUserRepository([makeUser()]);
    useCase = new CreateUserUseCase(users, roles, passwordHasher);

    await expect(
      useCase.execute(
        {
          email: 'usuario@clena.local',
          password: 'Password123',
          fullName: 'Otro Usuario',
        },
        { id: 'admin-1', roleRank: 30 },
      ),
    ).rejects.toThrow(EmailAlreadyInUseError);
  });

  it('impide asignar un rol superior al del actor', async () => {
    await expect(
      useCase.execute(
        {
          email: 'nuevo@clena.local',
          password: 'Password123',
          fullName: 'Nuevo Usuario',
          role: Role.ADMINISTRADOR,
        },
        { id: 'clena-1', roleRank: 20 },
      ),
    ).rejects.toThrow(CannotAssignRoleError);
  });

  it('rechaza un rol que no existe en las definiciones', async () => {
    roles = new InMemoryRoleRepository([makeRole(Role.USUARIO, 10)]);
    useCase = new CreateUserUseCase(users, roles, passwordHasher);

    await expect(
      useCase.execute(
        {
          email: 'nuevo@clena.local',
          password: 'Password123',
          fullName: 'Nuevo Usuario',
          role: Role.PERSONAL_CLENA,
        },
        { id: 'admin-1', roleRank: 30 },
      ),
    ).rejects.toThrow(RoleNotFoundError);
  });
});
