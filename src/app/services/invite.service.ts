import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class InviteService {
  private baseUrl = "http://localhost:8080/api/invite/find/";

  constructor(private http: HttpClient) {}

  checkInviteStatus(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}`).pipe(
      map((response: any) => {
        if (response.code !== 200 || response.status !== "SUCCESS") {
          throw new Error("Invalid invitation");
        }
        // Store invite data in local storage
        this.storeInviteData(response.data);
        return response;
      }),
      catchError((error) => {
        console.error("Error validating invitation:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Store invite data (email, name, inviteId, startTime, and endTime) in local storage.
   */
  storeInviteData(data: any): void {
    const inviteData = {
      email: data.candidateDto.candidateEmail,
      name: data.candidateDto.candidateFullName,
      inviteId: data.inviteDto.inviteId,
      startTime: data.assessmentDto.assessmentStartTime, // Add startTime
      endTime: data.assessmentDto.assessmentEndTime, // Add endTime
      assessmentName:data.assessmentDto.assessmentName,
      assessmentType:data.assessmentDto.assessmentType,
      duration:data.assessmentDto.duration,
      difficultyLevel:data.assessmentDto.difficultyLevel,
      assessmentStatus: data.assessmentDto.assessmentStatus,
      candidateFullName:data.candidateDto.candidateFullName
    };
    localStorage.setItem("inviteData", JSON.stringify(inviteData));
  }

  /**
   * Retrieve invite data (email, name, inviteId, startTime, and endTime) from local storage.
   */
  getInviteData(): {
    email: string;
    name: string;
    inviteId: number;
    startTime: string;
    endTime: string;
    assessmentName:string;
    assessmentType:string;
    duration:string;
    difficultyLevel:string;
    assessmentStatus:string;
    candidateFullName:string
  } | null {
    const inviteData = localStorage.getItem("inviteData");
    if (inviteData) {
      return JSON.parse(inviteData);
    }
    return null;
  }

  /**
   * Clear invite data from local storage.
   */
  clearInviteData(): void {
    localStorage.removeItem("inviteData");
  }
}
