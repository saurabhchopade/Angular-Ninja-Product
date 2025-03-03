import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback, FeedbackResponse } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080/api/feedback/create';

  constructor(private http: HttpClient) { }

  submitFeedback(feedback: Feedback): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>(this.apiUrl, feedback);
  }
}