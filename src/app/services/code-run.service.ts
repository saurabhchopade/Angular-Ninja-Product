import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CodeExecutionService {
  private apiUrl = 'http://localhost:8080/api/coding/compile';

  constructor(private http: HttpClient) {}

  executeCode(language_id: number, source_code: string, question_id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      language_id,
      source_code,
      question_id,
    };
    return this.http.post(this.apiUrl, body, { headers });
  }
}