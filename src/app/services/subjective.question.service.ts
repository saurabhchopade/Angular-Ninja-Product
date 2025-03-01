import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectiveQuestion } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8080/api/questions/find/fetch-subjective';

  constructor(private http: HttpClient) {}

  fetchSubjectiveQuestions(assessmentId: number, sectionId: number, candidateId: number): Observable<any> {
    const body = { assessmentId, sectionId, candidateId };
    return this.http.post<any>(this.apiUrl, body);
  }
}