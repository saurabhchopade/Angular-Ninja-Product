import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SubmitTestService {
  private submitUrl = "http://localhost:8080/assessment/submit";

  constructor(private http: HttpClient) {}

  submitAssessment(inviteId: number, email: string): Observable<any> {
    const body = {
      inviteId: inviteId,
      email: email,
    };
    return this.http.post(this.submitUrl, body);
  }
}
