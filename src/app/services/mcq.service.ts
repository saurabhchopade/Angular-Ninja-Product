import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class McqService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Fetch questions and options for a specific assessment and section
  fetchQuestions(assessmentId: number, sectionId: number): Observable<any> {
    const url = `${this.baseUrl}/questionAndOption/find/assessment/${assessmentId}/section/${sectionId}`;
    return this.http.get(url);
  }

  // Save the selected answer to the server
  saveAnswer(questionId: number, optionId: number): Observable<any> {
    console.log(`Question ID: ${questionId}, Option ID: ${optionId}`);
    const url = `${this.baseUrl}/saveAnswer`;
    const payload = { questionId, optionId };
    return this.http.post(url, payload);
  }
  
}