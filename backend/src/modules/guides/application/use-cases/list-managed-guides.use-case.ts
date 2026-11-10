import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import type { GuideStatus } from '../../domain/enums/guide-status.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { assertGuidePermission, type GuideActor } from '../models/guide-actor';
import {
  toGuideManagementSummaryModel,
  type GuideManagementSummaryModel,
} from '../models/guide-management.model';

export interface ListManagedGuidesInput {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
  status?: GuideStatus;
}

export interface ListManagedGuidesResult {
  items: GuideManagementSummaryModel[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListManagedGuidesUseCase {
  constructor(@Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository) {}

  async execute(input: ListManagedGuidesInput, actor: GuideActor): Promise<ListManagedGuidesResult> {
    assertGuidePermission(actor, Permission.GUIDES_MANAGE);

    const result = await this.guides.paginate(
      {
        categoryId: input.categoryId?.trim() || undefined,
        search: input.search?.trim() || undefined,
        status: input.status,
      },
      { page: input.page, limit: input.limit },
    );

    return {
      items: result.items.map(toGuideManagementSummaryModel),
      total: result.total,
      page: input.page,
      limit: input.limit,
    };
  }
}