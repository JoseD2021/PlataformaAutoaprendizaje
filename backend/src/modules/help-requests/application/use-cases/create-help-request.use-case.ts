import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import {
  GUIDE_REPOSITORY,
  GuideRepository,
} from '../../../guides/domain/repositories/guide.repository';
import { GuideStatus } from '../../../guides/domain/enums/guide-status.enum';
import { HelpRequest } from '../../domain/entities/help-request.entity';
import {
  HELP_REQUEST_REPOSITORY,
  HelpRequestRepository,
} from '../../domain/repositories/help-request.repository';
import { toHelpRequestModel, type HelpRequestModel } from '../models/help-request-view.model';

export interface CreateHelpRequestInput {
  stationNumber?: number | null;
  guideId?: string | null;
  stepNumber?: number | null;
  /** Usuario con sesión iniciada; vacío si pide ayuda sin cuenta. */
  requester?: { id: string; fullName: string } | null;
}

@Injectable()
export class CreateHelpRequestUseCase {
  constructor(
    @Inject(HELP_REQUEST_REPOSITORY) private readonly helpRequests: HelpRequestRepository,
    @Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository,
  ) {}

  async execute(input: CreateHelpRequestInput): Promise<HelpRequestModel> {
    const stationNumber = input.stationNumber ?? null;
    const userId = input.requester?.id ?? null;

    // Si el mismo puesto o el mismo usuario ya tiene un aviso pendiente, no se crea otro.
    const pending = await this.helpRequests.findPendingByStationOrUser(stationNumber, userId);

    if (pending) {
      return toHelpRequestModel(pending);
    }

    // La guía es solo contexto para la asistente: si no existe o no está publicada se ignora.
    const guide = input.guideId ? await this.guides.findById(input.guideId) : null;
    const validGuide = guide && guide.status === GuideStatus.PUBLISHED ? guide : null;
    const stepNumber =
      validGuide && input.stepNumber && input.stepNumber <= validGuide.totalSteps
        ? input.stepNumber
        : null;

    const helpRequest = HelpRequest.create({
      id: randomUUID(),
      stationNumber,
      guideId: validGuide?.id ?? null,
      guideTitle: validGuide?.title ?? null,
      stepNumber,
      userId,
      requesterName: input.requester?.fullName ?? null,
    });

    await this.helpRequests.save(helpRequest);

    return toHelpRequestModel(helpRequest);
  }
}
