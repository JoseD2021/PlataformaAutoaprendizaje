import { ListPendingHelpRequestsUseCase } from './list-pending-help-requests.use-case';
import { InMemoryHelpRequestRepository, makeHelpRequest } from '../../../../../test/support/fakes';

describe('ListPendingHelpRequestsUseCase', () => {
  it('devuelve solo las pendientes, de la más antigua a la más reciente', async () => {
    const reciente = makeHelpRequest({ id: 'reciente', stationNumber: 2, now: new Date('2026-11-26T15:10:00Z') });
    const antigua = makeHelpRequest({ id: 'antigua', stationNumber: 1, now: new Date('2026-11-26T15:00:00Z') });
    const atendida = makeHelpRequest({ id: 'atendida', stationNumber: 3 });
    atendida.resolve('staff-1');
    const useCase = new ListPendingHelpRequestsUseCase(
      new InMemoryHelpRequestRepository([reciente, antigua, atendida]),
    );

    const result = await useCase.execute();

    expect(result.map((h) => h.id)).toEqual(['antigua', 'reciente']);
  });
});
