import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class McqAnswerService {
  private baseUrl = 'http://localhost:8080/api/questionAndOption';

  constructor(private http: HttpClient) {}

  // Add MCQ answer to the server
  addAnswer(answerData: {
    assessmentId: number;
    candidateId: number;
    sectionId: number;
    questionId: number;
    mcqOption: number;
    candidateAssessmentSessionId:number
  }): Observable<any> {
    const url = `${this.baseUrl}/saveMcq`;
    return this.http.post(url, answerData);
  }
}