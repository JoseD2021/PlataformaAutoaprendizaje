import { SearchQuery } from '../value-objects/search-query.vo';

export interface GuideSearchHit {
  id: string;
  title: string;
  estimatedMinutes: number;
  categoryName: string;
  score: number;
}

export interface GuideSearchCriteria {
  query: SearchQuery;
  categoryId?: string;
  page: number;
  limit: number;
}

export interface GuideSearchPage {
  items: GuideSearchHit[];
  total: number;
}