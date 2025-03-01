import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class McqService {
  private baseUrl = 'http://localhost:8080/api/questionAndOption';

  constructor(private http: HttpClient) {
    // Listen to the beforeunload event to clear local storage or perform cleanup
    window.addEventListener('beforeunload', () => this.clearLocalStorage());
  }

  // Fetch questions and options for a specific assessment, candidate, and section
  fetchQuestions(assessmentId: number, candidateId: number, sectionId: number): Observable<any> {
    const url = `${this.baseUrl}/fetch_mcq`;
    const payload = { assessmentId, candidateId, sectionId };
    return this.http.post(url, payload);
  }

  // Clear local storage data
  private clearLocalStorage() {
    localStorage.clear(); // Clears all data in localStorage
    console.log('Local storage cleared on page refresh.');
  }
}