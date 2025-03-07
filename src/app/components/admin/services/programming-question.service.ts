import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgrammingQuestion } from '../types/programming-question.type';

@Injectable({
  providedIn: 'root',
})
export class ProgrammingQuestionService {
  private apiUrl = 'http://localhost:8080/api/question/create-coding-question';

  constructor(private http: HttpClient) {}

  createQuestion(question: ProgrammingQuestion): Observable<any> {
    return this.http.post(this.apiUrl, question);
  }
}