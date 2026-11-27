import { CreateRoleUseCase } from './create-role.use-case';
import { Permission } from '../../domain/enums/permission.enum';
import { Role } from '../../domain/enums/role.enum';
import {
  CannotGrantPermissionsError,
  CannotManageRoleError,
  InvalidRoleError,
  PermissionRankTooHighError,
} from '../../domain/errors/user.errors';
import { RoleAlreadyExistsError } from '../errors/user.errors';
import { InMemoryRoleRepository, makeRole } from '../../../../../test/support/fakes';

describe('CreateRoleUseCase', () => {
  let roles: InMemoryRoleRepository;
  let useCase: CreateRoleUseCase;

  beforeEach(() => {
    roles = new InMemoryRoleRepository();
    useCase = new CreateRoleUseCase(roles);
  });

  it('crea un rol con permisos que el actor posee', async () => {
    const role = await useCase.execute(
      {
        role: '  Colaborador ',
        name: '  Colaborador  ',
        rank: 15,
        permissions: [Permission.FAVORITES_MANAGE],
      },
      { roleRank: 30, permissions: [Permission.FAVORITES_MANAGE] },
    );

    expect(role.role).toBe('colaborador');
    expect(role.name).toBe('Colaborador');
    expect(role.rank).toBe(15);
    expect(role.permissions).toEqual([Permission.FAVORITES_MANAGE]);
    expect(await roles.findByRole('colaborador')).toEqual(role);
  });

  it('rechaza un identificador de rol ya existente', async () => {
    await expect(
      useCase.execute(
        { role: Role.USUARIO, name: 'Otro usuario', rank: 5 },
        { roleRank: 30, permissions: [] },
      ),
    ).rejects.toThrow(RoleAlreadyExistsError);
  });

  it('impide crear roles con jerarquía igual o superior a la del actor', async () => {
    await expect(
      useCase.execute(
        { role: 'supervisor', name: 'Supervisor', rank: 20 },
        { roleRank: 20, permissions: [] },
      ),
    ).rejects.toThrow(CannotManageRoleError);
  });

  it('impide otorgar permisos que el actor no posee', async () => {
    await expect(
      useCase.execute(
        {
          role: 'auditor',
          name: 'Auditor',
          rank: 15,
          permissions: [Permission.FAVORITES_MANAGE],
        },
        { roleRank: 30, permissions: [Permission.ROLES_CREATE] },
      ),
    ).rejects.toThrow(CannotGrantPermissionsError);
  });

  it('impide asignar permisos reservados a rangos superiores', async () => {
    await expect(
      useCase.execute(
        {
          role: 'auxiliar',
          name: 'Auxiliar',
          rank: 1,
          permissions: [Permission.USERS_CREATE],
        },
        { roleRank: 30, permissions: [Permission.USERS_CREATE] },
      ),
    ).rejects.toThrow(PermissionRankTooHighError);
  });

  it('valida el identificador del rol', async () => {
    await expect(
      useCase.execute(
        { role: 'ROL INVALIDO', name: 'Inválido', rank: 5 },
        { roleRank: 30, permissions: [] },
      ),
    ).rejects.toThrow(InvalidRoleError);
  });

  it('no persiste el rol cuando la validación falla', async () => {
    roles = new InMemoryRoleRepository([makeRole(Role.ADMINISTRADOR, 30)]);
    useCase = new CreateRoleUseCase(roles);

    await expect(
      useCase.execute(
        { role: 'invalido!', name: 'Inválido', rank: 5 },
        { roleRank: 30, permissions: [] },
      ),
    ).rejects.toThrow(InvalidRoleError);

    expect(await roles.findAll()).toHaveLength(1);
  });
});
