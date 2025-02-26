import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private baseUrl = 'http://localhost:8080/invite/find/';

  constructor(private http: HttpClient) {}

  checkInviteStatus(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}`).pipe(
      map((response: any) => {
        if (response.code !== 200 || response.status !== 'success') {
          throw new Error('Invalid invitation');
        }
        return response;
      }),
      catchError(error => {
        console.error('Error validating invitation:', error);
        return throwError(() => error);
      })
    );
  }
}