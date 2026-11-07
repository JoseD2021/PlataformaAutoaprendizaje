import { Inject, Injectable } from '@nestjs/common';
import { GuideStatus } from '../../domain/enums/guide-status.enum';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import type { GuideSummaryModel } from '../models/guide-view.model';
import { toGuideSummaryModel } from '../models/guide-view.model';

export interface ListGuidesInput {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}

export interface ListGuidesResult {
  items: GuideSummaryModel[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListGuidesUseCase {
  constructor(@Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository) {}

  async execute(input: ListGuidesInput): Promise<ListGuidesResult> {
    const result = await this.guides.paginate(
      {
        categoryId: input.categoryId?.trim() || undefined,
        search: input.search?.trim() || undefined,
        status: GuideStatus.PUBLISHED,
      },
      { page: input.page, limit: input.limit },
    );

    return {
      items: result.items.map(toGuideSummaryModel),
      total: result.total,
      page: input.page,
      limit: input.limit,
    };
  }
}