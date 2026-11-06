import { Role } from '../enums/role.enum';
import { InvalidEmailError, InvalidUserError } from '../errors/user.errors';
import { makeUser } from '../../../../../test/support/fakes';

describe('User', () => {
  describe('create', () => {
    it('normaliza el correo y el nombre completo', () => {
      const user = makeUser({ email: '  USUARIO@CLENA.LOCAL  ', fullName: '  Ana Pérez  ' });

      expect(user.email).toBe('usuario@clena.local');
      expect(user.fullName).toBe('Ana Pérez');
      expect(user.isActive).toBe(true);
    });

    it('rechaza un correo inválido', () => {
      expect(() => makeUser({ email: 'correo-invalido' })).toThrow(InvalidEmailError);
    });

    it('rechaza un nombre demasiado corto', () => {
      expect(() => makeUser({ fullName: 'A' })).toThrow(InvalidUserError);
    });

    it('exige un hash de contraseña', () => {
      expect(() => makeUser({ passwordHash: '' })).toThrow(InvalidUserError);
    });
  });

  describe('changeRole', () => {
    it('cambia el rol y actualiza la fecha de modificación', () => {
      const createdAt = new Date('2026-01-01T00:00:00.000Z');
      const changedAt = new Date('2026-02-01T00:00:00.000Z');
      const user = makeUser({ createdAt, updatedAt: createdAt });

      user.changeRole(Role.PERSONAL_CLENA, changedAt);

      expect(user.role).toBe(Role.PERSONAL_CLENA);
      expect(user.updatedAt).toEqual(changedAt);
    });

    it('no modifica la fecha si el rol es el mismo', () => {
      const user = makeUser({ role: Role.USUARIO });

      user.changeRole(Role.USUARIO);

      expect(user.updatedAt).toEqual(user.createdAt);
    });
  });
});
