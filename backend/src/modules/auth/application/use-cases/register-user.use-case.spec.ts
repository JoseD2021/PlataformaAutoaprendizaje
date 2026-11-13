import { RegisterUserUseCase } from './register-user.use-case';
import { Role } from '../../../users/domain/enums/role.enum';
import { EmailAlreadyInUseError, RoleNotFoundError } from '../../../users/application/errors/user.errors';
import { CURRENT_PRIVACY_TERMS } from '../../../privacy/domain/privacy-terms';
import {
  PrivacyTermsNotAcceptedError,
  PrivacyTermsVersionMismatchError,
} from '../errors/auth.errors';
import {
  FakePasswordHasher,
  InMemoryRoleRepository,
  InMemoryUserRepository,
  makeRole,
  makeUser,
} from '../../../../../test/support/fakes';

const TERMS_ACCEPTED = {
  privacyTermsAccepted: true,
  privacyTermsVersion: CURRENT_PRIVACY_TERMS.version,
};

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
      ...TERMS_ACCEPTED,
    });

    expect(user.email).toBe('nuevo@clena.local');
    expect(user.fullName).toBe('Nuevo Usuario');
    expect(user.role).toBe(Role.USUARIO);
    expect(user.passwordHash).toBe('hashed:Password123');
    expect(user.isActive).toBe(true);
    expect(user.privacyTermsAcceptedAt).toBeInstanceOf(Date);
    expect(user.privacyTermsVersion).toBe(CURRENT_PRIVACY_TERMS.version);
    expect(users.all).toHaveLength(1);
  });

  it('rechaza el registro si no se acepta el aviso de privacidad', async () => {
    await expect(
      useCase.execute({
        email: 'nuevo@clena.local',
        password: 'Password123',
        fullName: 'Nuevo Usuario',
        privacyTermsAccepted: false,
        privacyTermsVersion: CURRENT_PRIVACY_TERMS.version,
      }),
    ).rejects.toThrow(PrivacyTermsNotAcceptedError);

    expect(users.all).toHaveLength(0);
  });

  it('rechaza el registro si la versión aceptada del aviso no es la vigente', async () => {
    await expect(
      useCase.execute({
        email: 'nuevo@clena.local',
        password: 'Password123',
        fullName: 'Nuevo Usuario',
        privacyTermsAccepted: true,
        privacyTermsVersion: '0.9',
      }),
    ).rejects.toThrow(PrivacyTermsVersionMismatchError);

    expect(users.all).toHaveLength(0);
  });

  it('rechaza un correo ya registrado', async () => {
    users = new InMemoryUserRepository([makeUser()]);
    useCase = new RegisterUserUseCase(users, roles, passwordHasher);

    await expect(
      useCase.execute({
        email: 'usuario@clena.local',
        password: 'Password123',
        fullName: 'Otro Usuario',
        ...TERMS_ACCEPTED,
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
        ...TERMS_ACCEPTED,
      }),
    ).rejects.toThrow(RoleNotFoundError);
  });
});
