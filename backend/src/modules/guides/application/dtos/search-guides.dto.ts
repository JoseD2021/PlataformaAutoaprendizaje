export interface SearchGuidesHitDto {
  id: string;
  title: string;    
  estimatedMinutes: number;
  categoryName: string;
}

export interface SearchGuidesInput {
  q: string;
  categoryId?: string;
  page: number;
  limit: number;
}

export interface SearchGuidesOutput {
  items: SearchGuidesHitDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}