import type { Guide } from '../../domain/entities/guide.entity';
import type { GuideStatus } from '../../domain/enums/guide-status.enum';
import { toGuideDetailModel, toGuideSummaryModel } from './guide-view.model';
import type { GuideDetailModel, GuideSummaryModel } from './guide-view.model';

export interface GuideManagementSummaryModel extends GuideSummaryModel {
  status: GuideStatus;
}

export interface GuideManagementDetailModel extends GuideDetailModel {
  status: GuideStatus;
  searchKeywords: string;
}

export function toGuideManagementSummaryModel(guide: Guide): GuideManagementSummaryModel {
  return { ...toGuideSummaryModel(guide), status: guide.status };
}

export function toGuideManagementDetailModel(guide: Guide): GuideManagementDetailModel {
  return {
    ...toGuideDetailModel(guide),
    status: guide.status,
    searchKeywords: guide.searchKeywords,
  };
}