export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  searchDifficultyLevel: string[];
  searchQuestionType: string[];
  search: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
