import { HelpRequest } from './help-request.entity';
import { HelpRequestStatus } from '../enums/help-request-status.enum';
import { InvalidHelpRequestError } from '../errors/help-request.errors';

describe('HelpRequest', () => {
  it('se crea pendiente y sin datos opcionales', () => {
    const helpRequest = HelpRequest.create({ id: 'h1' });

    expect(helpRequest.status).toBe(HelpRequestStatus.PENDING);
    expect(helpRequest.stationNumber).toBeNull();
    expect(helpRequest.guideId).toBeNull();
    expect(helpRequest.requesterName).toBeNull();
  });

  it.each([0, -1, 1000, 2.5])('rechaza el puesto %p', (stationNumber) => {
    expect(() => HelpRequest.create({ id: 'h1', stationNumber })).toThrow(InvalidHelpRequestError);
  });

  it('rechaza un paso sin guía', () => {
    expect(() => HelpRequest.create({ id: 'h1', stepNumber: 2 })).toThrow(InvalidHelpRequestError);
  });

  it('rechaza un paso menor que 1', () => {
    expect(() => HelpRequest.create({ id: 'h1', guideId: 'g', stepNumber: 0 })).toThrow(
      InvalidHelpRequestError,
    );
  });

  it('resolve la marca como atendida y guarda quién y cuándo', () => {
    const helpRequest = HelpRequest.create({ id: 'h1' });
    const now = new Date('2026-11-26T15:00:00Z');

    helpRequest.resolve('staff-1', now);

    expect(helpRequest.status).toBe(HelpRequestStatus.RESOLVED);
    expect(helpRequest.resolvedBy).toBe('staff-1');
    expect(helpRequest.resolvedAt).toEqual(now);
  });

  it('resolver dos veces no cambia a quien la atendió primero', () => {
    const helpRequest = HelpRequest.create({ id: 'h1' });

    helpRequest.resolve('staff-1');
    helpRequest.resolve('staff-2');

    expect(helpRequest.resolvedBy).toBe('staff-1');
  });
});
