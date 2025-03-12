import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionRequest, QuestionResponse } from '../models/fullstack.question.model';

@Injectable({
  providedIn: 'root'
})
export class FullStackQuestionService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  fetchFullstackQuestions(request: QuestionRequest): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(
      `${this.baseUrl}/question/fetch-fullstack-questions`,
      request
    );
  }
}