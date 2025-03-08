import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Question {
  id: number;
  title: string;
  problemStatement: string;
  difficultyLevel: string;
  type: string;
  maxScore: number;
  tags: string[];
}

export interface QuestionData {
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  list: Question[];
  totalCount: number;
  questionTypeCounts: { [key: string]: number };
}

export interface QuestionResponse {
  code: number;
  status: string;
  message: string;
  data: QuestionData;
  timestamp: string;
}

@Injectable({
  providedIn: "root",
})
export class QuestionService {
  private apiUrl = "http://localhost:8080/api/question/fetch-questions";

  constructor(private http: HttpClient) {}

  fetchQuestions(
    pageNumber: number,
    pageSize: number,
    sortField: string,
    sortOrder: string,
    searchDifficultyLevels: string[],
    searchQuestionType: string[],
    searchQuery: string,
  ): Observable<QuestionResponse> {
    // Create the request body object
    const requestBody = {
      pageNumber,
      pageSize,
      sortField,
      sortOrder,
      searchDifficultyLevels,
      searchQuestionType,
      search: searchQuery,
    };

    // Send the request body in the POST request
    return this.http.post<QuestionResponse>(this.apiUrl, requestBody);
  }
}
