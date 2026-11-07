import { ListRolesUseCase } from './list-roles.use-case';
import { Role } from '../../domain/enums/role.enum';
import { InMemoryRoleRepository, makeRole } from '../../../../../test/support/fakes';

describe('ListRolesUseCase', () => {
  it('devuelve los roles ordenados por jerarquía ascendente', async () => {
    const roles = new InMemoryRoleRepository([
      makeRole(Role.ADMINISTRADOR, 30),
      makeRole(Role.USUARIO, 10),
      makeRole(Role.PERSONAL_CLENA, 20),
    ]);
    const useCase = new ListRolesUseCase(roles);

    const result = await useCase.execute();

    expect(result.map((role) => role.role)).toEqual([
      Role.USUARIO,
      Role.PERSONAL_CLENA,
      Role.ADMINISTRADOR,
    ]);
  });
});
