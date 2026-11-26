import { CreateHelpRequestUseCase } from './create-help-request.use-case';
import { GuideStatus } from '../../../guides/domain/enums/guide-status.enum';
import { HelpRequestStatus } from '../../domain/enums/help-request-status.enum';
import {
  InMemoryGuideRepository,
  InMemoryHelpRequestRepository,
  makeGuide,
  makeGuideStep,
  makeHelpRequest,
} from '../../../../../test/support/fakes';

function setup(seed = [makeGuide({ id: 'enviar-correo-foto', title: 'Enviar un correo con una foto', steps: [makeGuideStep({ position: 1 }), makeGuideStep({ id: 'p2', position: 2 })] })]) {
  const helpRequests = new InMemoryHelpRequestRepository();
  const useCase = new CreateHelpRequestUseCase(helpRequests, new InMemoryGuideRepository(seed));

  return { helpRequests, useCase };
}

describe('CreateHelpRequestUseCase', () => {
  it('crea una solicitud anónima solo con el puesto', async () => {
    const { helpRequests, useCase } = setup();

    const result = await useCase.execute({ stationNumber: 5 });

    expect(result.stationNumber).toBe(5);
    expect(result.requesterName).toBeNull();
    expect(result.status).toBe(HelpRequestStatus.PENDING);
    expect(helpRequests.all).toHaveLength(1);
  });

  it('guarda el título de la guía, el paso y el nombre del usuario', async () => {
    const { useCase } = setup();

    const result = await useCase.execute({
      guideId: 'enviar-correo-foto',
      stepNumber: 2,
      requester: { id: 'user-1', fullName: 'Ana Pérez' },
    });

    expect(result.guideTitle).toBe('Enviar un correo con una foto');
    expect(result.stepNumber).toBe(2);
    expect(result.requesterName).toBe('Ana Pérez');
  });

  it('permite pedir ayuda sin puesto, sin guía y sin sesión', async () => {
    const { useCase } = setup();

    const result = await useCase.execute({});

    expect(result.stationNumber).toBeNull();
    expect(result.guideId).toBeNull();
  });

  it('ignora la guía si no existe o es un borrador', async () => {
    const { useCase } = setup([makeGuide({ id: 'borrador', status: GuideStatus.DRAFT })]);

    const borrador = await useCase.execute({ guideId: 'borrador', stepNumber: 1 });
    const inexistente = await useCase.execute({ guideId: 'no-existe' });

    expect(borrador.guideId).toBeNull();
    expect(borrador.stepNumber).toBeNull();
    expect(inexistente.guideId).toBeNull();
  });

  it('ignora un paso mayor que los pasos de la guía', async () => {
    const { useCase } = setup();

    const result = await useCase.execute({ guideId: 'enviar-correo-foto', stepNumber: 9 });

    expect(result.guideId).toBe('enviar-correo-foto');
    expect(result.stepNumber).toBeNull();
  });

  it('no duplica el aviso si el puesto ya tiene uno pendiente', async () => {
    const { helpRequests, useCase } = setup();
    const existing = makeHelpRequest({ stationNumber: 5 });
    await helpRequests.save(existing);

    const result = await useCase.execute({ stationNumber: 5 });

    expect(result.id).toBe(existing.id);
    expect(helpRequests.all).toHaveLength(1);
  });

  it('no duplica el aviso si el usuario ya tiene uno pendiente', async () => {
    const { helpRequests, useCase } = setup();
    const requester = { id: 'user-1', fullName: 'Ana Pérez' };
    const first = await useCase.execute({ requester });

    const second = await useCase.execute({ stationNumber: 3, requester });

    expect(second.id).toBe(first.id);
    expect(helpRequests.all).toHaveLength(1);
  });

  it('crea un aviso nuevo si el anterior del puesto ya fue atendido', async () => {
    const { helpRequests, useCase } = setup();
    const resolved = makeHelpRequest({ stationNumber: 5 });
    resolved.resolve('staff-1');
    await helpRequests.save(resolved);

    const result = await useCase.execute({ stationNumber: 5 });

    expect(result.id).not.toBe(resolved.id);
    expect(helpRequests.all).toHaveLength(2);
  });
});
