import { Inject, Injectable } from '@nestjs/common';
import {
  HELP_REQUEST_REPOSITORY,
  HelpRequestRepository,
} from '../../domain/repositories/help-request.repository';
import { toHelpRequestModel, type HelpRequestModel } from '../models/help-request-view.model';

@Injectable()
export class ListPendingHelpRequestsUseCase {
  constructor(
    @Inject(HELP_REQUEST_REPOSITORY) private readonly helpRequests: HelpRequestRepository,
  ) {}

  async execute(): Promise<HelpRequestModel[]> {
    const pending = await this.helpRequests.listPending();

    return pending.map(toHelpRequestModel);
  }
}
