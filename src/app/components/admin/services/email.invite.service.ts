import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface InviteRequest {
  assessmentId: number;
  inviteCandidateRequests: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    tags: string[];
  }[];
}

@Injectable({
  providedIn: "root",
})
export class EmailInviteService {
  private apiUrl = "http://localhost:8080/api/invite";

  constructor(private http: HttpClient) {}

  createInvite(inviteData: InviteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, inviteData);
  }
}