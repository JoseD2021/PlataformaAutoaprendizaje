import { ResolveHelpRequestUseCase } from './resolve-help-request.use-case';
import { HelpRequestNotFoundError } from '../errors/help-request.errors';
import { HelpRequestStatus } from '../../domain/enums/help-request-status.enum';
import { InMemoryHelpRequestRepository, makeHelpRequest } from '../../../../../test/support/fakes';

describe('ResolveHelpRequestUseCase', () => {
  it('marca la solicitud como atendida por el miembro del personal', async () => {
    const helpRequest = makeHelpRequest({ id: 'h1' });
    const repository = new InMemoryHelpRequestRepository([helpRequest]);
    const useCase = new ResolveHelpRequestUseCase(repository);

    await useCase.execute({ helpRequestId: 'h1', resolvedBy: 'staff-1' });

    const saved = await repository.findById('h1');
    expect(saved?.status).toBe(HelpRequestStatus.RESOLVED);
    expect(saved?.resolvedBy).toBe('staff-1');
  });

  it('lanza HelpRequestNotFoundError si no existe', async () => {
    const useCase = new ResolveHelpRequestUseCase(new InMemoryHelpRequestRepository());

    await expect(
      useCase.execute({ helpRequestId: 'no-existe', resolvedBy: 'staff-1' }),
    ).rejects.toBeInstanceOf(HelpRequestNotFoundError);
  });
});
