import type { HelpRequest } from '../../domain/entities/help-request.entity';
import type { HelpRequestStatus } from '../../domain/enums/help-request-status.enum';

export interface HelpRequestModel {
  id: string;
  stationNumber: number | null;
  guideId: string | null;
  guideTitle: string | null;
  stepNumber: number | null;
  requesterName: string | null;
  status: HelpRequestStatus;
  createdAt: Date;
}

export function toHelpRequestModel(helpRequest: HelpRequest): HelpRequestModel {
  return {
    id: helpRequest.id,
    stationNumber: helpRequest.stationNumber,
    guideId: helpRequest.guideId,
    guideTitle: helpRequest.guideTitle,
    stepNumber: helpRequest.stepNumber,
    requesterName: helpRequest.requesterName,
    status: helpRequest.status,
    createdAt: helpRequest.createdAt,
  };
}
