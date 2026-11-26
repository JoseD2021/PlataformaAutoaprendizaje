import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotManageGuideError } from '../../domain/errors/guide.errors';
import {
  GuideAlreadyMostRequestedError,
  GuideNotFoundError,
} from '../errors/guide.errors';
import { ChangeGuideMostRequestedUseCase } from './cambiar-mas-pedida-guia.use-case';
import { InMemoryGuideRepository, makeGuide } from '../../../../../test/support/fakes';

const actor = { permissions: [Permission.GUIDES_MANAGE] };

describe('ChangeGuideMostRequestedUseCase', () => {
  it('desmarca la guía indicada', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'guia-1', isMostRequested: true }),
    ]);

    await new ChangeGuideMostRequestedUseCase(guides).execute('guia-1', false, actor);

    expect((await guides.findById('guia-1'))?.isMostRequested).toBe(false);
  });

  it('rechaza marcar si ya hay otra más pedida en la misma categoría', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'guia-1', categoryId: 'cat-correo' }),
      makeGuide({ id: 'guia-2', categoryId: 'cat-correo', isMostRequested: true }),
    ]);

    await expect(
      new ChangeGuideMostRequestedUseCase(guides).execute('guia-1', true, actor),
    ).rejects.toBeInstanceOf(GuideAlreadyMostRequestedError);
  });

  it('permite volver a marcar la misma guía', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'guia-1', categoryId: 'cat-correo', isMostRequested: true }),
    ]);

    await expect(
      new ChangeGuideMostRequestedUseCase(guides).execute('guia-1', true, actor),
    ).resolves.toMatchObject({ id: 'guia-1', isMostRequested: true });
  });

  it('rechaza una guía que no existe', async () => {
    await expect(
      new ChangeGuideMostRequestedUseCase(new InMemoryGuideRepository()).execute(
        'no-existe',
        false,
        actor,
      ),
    ).rejects.toBeInstanceOf(GuideNotFoundError);
  });

  it('rechaza al actor sin permiso', async () => {
    const guides = new InMemoryGuideRepository([makeGuide({ id: 'guia-1' })]);

    await expect(
      new ChangeGuideMostRequestedUseCase(guides).execute('guia-1', false, { permissions: [] }),
    ).rejects.toBeInstanceOf(CannotManageGuideError);
  });
});
