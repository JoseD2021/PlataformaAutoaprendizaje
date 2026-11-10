import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotManageGuideError } from '../../domain/errors/guide.errors';
import { GuideNotFoundError } from '../errors/guide.errors';
import { DeleteGuideUseCase } from './delete-guide.use-case';
import { InMemoryGuideRepository, makeGuide } from '../../../../../test/support/fakes';

const actor = { permissions: [Permission.GUIDES_MANAGE] };

describe('DeleteGuideUseCase', () => {
  it('elimina la guía', async () => {
    const guides = new InMemoryGuideRepository([makeGuide({ id: 'a-borrar' })]);

    await new DeleteGuideUseCase(guides).execute('a-borrar', actor);

    expect(guides.all).toHaveLength(0);
  });

  it('rechaza una guía que no existe', async () => {
    await expect(
      new DeleteGuideUseCase(new InMemoryGuideRepository()).execute('no-existe', actor),
    ).rejects.toBeInstanceOf(GuideNotFoundError);
  });

  it('rechaza al actor sin permiso y no borra nada', async () => {
    const guides = new InMemoryGuideRepository([makeGuide({ id: 'a-borrar' })]);

    await expect(
      new DeleteGuideUseCase(guides).execute('a-borrar', { permissions: [] }),
    ).rejects.toBeInstanceOf(CannotManageGuideError);
    expect(guides.all).toHaveLength(1);
  });
});