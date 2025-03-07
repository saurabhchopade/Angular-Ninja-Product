import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectiveQuestion } from '../types/subjective.question';

@Injectable({
  providedIn: 'root'
})
export class SubjectiveQuestionService {
  private apiUrl = 'http://localhost:8080/api/question';

  constructor(private http: HttpClient) {}

  createSubjectiveQuestion(question: SubjectiveQuestion): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-subjective-question`, question);
  }
}