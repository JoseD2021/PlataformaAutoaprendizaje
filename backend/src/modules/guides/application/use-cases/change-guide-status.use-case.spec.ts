import { Permission } from '../../../users/domain/enums/permission.enum';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { CannotManageGuideError, InvalidGuideError } from '../../domain/errors/guide.errors';
import { GuideNotFoundError } from '../errors/guide.errors';
import { ChangeGuideStatusUseCase } from './change-guide-status.use-case';
import { InMemoryGuideRepository, makeGuide } from '../../../../../test/support/fakes';

const actor = { permissions: [Permission.GUIDES_MANAGE] };

describe('ChangeGuideStatusUseCase', () => {
  it('publica una guía en borrador que tiene pasos', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'borrador', status: GuideStatus.DRAFT }),
    ]);

    const result = await new ChangeGuideStatusUseCase(guides).execute(
      'borrador',
      GuideStatus.PUBLISHED,
      actor,
    );

    expect(result.status).toBe(GuideStatus.PUBLISHED);
    expect((await guides.findById('borrador'))?.status).toBe(GuideStatus.PUBLISHED);
  });

  it('despublica una guía publicada', async () => {
    const guides = new InMemoryGuideRepository([makeGuide({ id: 'publicada' })]);

    const result = await new ChangeGuideStatusUseCase(guides).execute(
      'publicada',
      GuideStatus.DRAFT,
      actor,
    );

    expect(result.status).toBe(GuideStatus.DRAFT);
  });

  it('no publica una guía sin pasos', async () => {
    const guides = new InMemoryGuideRepository([
      makeGuide({ id: 'vacia', status: GuideStatus.DRAFT, steps: [] }),
    ]);

    await expect(
      new ChangeGuideStatusUseCase(guides).execute('vacia', GuideStatus.PUBLISHED, actor),
    ).rejects.toBeInstanceOf(InvalidGuideError);
  });

  it('rechaza una guía que no existe', async () => {
    await expect(
      new ChangeGuideStatusUseCase(new InMemoryGuideRepository()).execute(
        'no-existe',
        GuideStatus.PUBLISHED,
        actor,
      ),
    ).rejects.toBeInstanceOf(GuideNotFoundError);
  });

  it('rechaza al actor sin permiso', async () => {
    const guides = new InMemoryGuideRepository([makeGuide({ id: 'publicada' })]);

    await expect(
      new ChangeGuideStatusUseCase(guides).execute('publicada', GuideStatus.DRAFT, {
        permissions: [],
      }),
    ).rejects.toBeInstanceOf(CannotManageGuideError);
  });
});