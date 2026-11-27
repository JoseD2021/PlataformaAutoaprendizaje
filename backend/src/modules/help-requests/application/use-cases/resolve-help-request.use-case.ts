import { Inject, Injectable } from '@nestjs/common';
import {
  HELP_REQUEST_REPOSITORY,
  HelpRequestRepository,
} from '../../domain/repositories/help-request.repository';
import { HelpRequestNotFoundError } from '../errors/help-request.errors';

export interface ResolveHelpRequestInput {
  helpRequestId: string;
  resolvedBy: string;
}

@Injectable()
export class ResolveHelpRequestUseCase {
  constructor(
    @Inject(HELP_REQUEST_REPOSITORY) private readonly helpRequests: HelpRequestRepository,
  ) {}

  async execute(input: ResolveHelpRequestInput): Promise<void> {
    const helpRequest = await this.helpRequests.findById(input.helpRequestId);

    if (!helpRequest) {
      throw new HelpRequestNotFoundError();
    }

    helpRequest.resolve(input.resolvedBy);
    await this.helpRequests.save(helpRequest);
  }
}
