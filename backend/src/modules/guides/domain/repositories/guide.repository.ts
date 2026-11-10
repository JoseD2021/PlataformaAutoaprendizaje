import type { Guide } from '../entities/guide.entity';
import type { GuideStatus } from '../enums/guide-status.enum';
import { GuideSearchCriteria, GuideSearchPage } from './guide-search.types';

export interface GuideFilters {
  categoryId?: string;
  search?: string;
  status?: GuideStatus;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedGuides {
  items: Guide[];
  total: number;
}

export abstract class GuideRepository {
  abstract findById(id: string): Promise<Guide | null>;
  abstract existsById(id: string): Promise<boolean>;
  abstract save(guide: Guide): Promise<Guide>;
  abstract paginate(filters: GuideFilters, options: PaginationOptions): Promise<PaginatedGuides>;
  abstract delete(id: string): Promise<void>;
  abstract search(criteria: GuideSearchCriteria): Promise<GuideSearchPage>;
}

export const GUIDE_REPOSITORY = Symbol('GUIDE_REPOSITORY');