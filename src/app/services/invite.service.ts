import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  StartAssessmentResponse,
  InviteDto,
  AssessmentDto,
  CandidateDto,
  AssessmentSection,
  CandidateAssessmentSessionDto,
} from "../models/start.test.model"; // Adjust the import path

@Injectable({
  providedIn: "root",
})
export class InviteService {
  private baseUrl = "http://localhost:8080/api/invite/find/";
  private startAssessmentUrl = "http://localhost:8080/api/assessment/start";

  constructor(private http: HttpClient) {}

  /**
   * Check the status of an invite by ID.
   */
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
   * Start the assessment by sending the inviteId and email.
   */
  startAssessment(inviteId: number, email: string): Observable<StartAssessmentResponse> {
    const requestBody = {
      inviteId: inviteId,
      email: email,
    };

    return this.http.post<StartAssessmentResponse>(this.startAssessmentUrl, requestBody).pipe(
      map((response) => {
        if (response.code !== 200 || response.status !== "SUCCESS") {
          throw new Error("Failed to start assessment");
        }
        // Store assessment data in local storage
        this.storeAssessmentData(response.data);
        return response;
      }),
      catchError((error) => {
        console.error("Error starting assessment:", error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Store invite data in local storage.
   */
  storeInviteData(data: any): void {
    const inviteData = {
      email: data.candidateDto.candidateEmail,
      name: data.candidateDto.candidateFullName,
      inviteId: data.inviteDto.inviteId,
      startTime: data.assessmentDto.assessmentStartTime,
      endTime: data.assessmentDto.assessmentEndTime,
      assessmentName: data.assessmentDto.assessmentName,
      assessmentType: data.assessmentDto.assessmentType,
      duration: data.assessmentDto.duration,
      difficultyLevel: data.assessmentDto.difficultyLevel,
      assessmentStatus: data.assessmentDto.assessmentStatus,
      candidateFullName: data.candidateDto.candidateFullName,
    };
    localStorage.setItem("inviteData", JSON.stringify(inviteData));
  }

  /**
   * Store assessment data in local storage.
   */
  storeAssessmentData(data: StartAssessmentResponse['data']): void {
    localStorage.setItem("assessmentData", JSON.stringify(data));
  }

  /**
   * Retrieve invite data from local storage.
   */
  getInviteData(): {
    email: string;
    name: string;
    inviteId: number;
    startTime: string;
    endTime: string;
    assessmentName: string;
    assessmentType: string;
    duration: string;
    difficultyLevel: string;
    assessmentStatus: string;
    candidateFullName: string;
  } | null {
    const inviteData = localStorage.getItem("inviteData");
    if (inviteData) {
      return JSON.parse(inviteData);
    }
    return null;
  }

  /**
   * Retrieve assessment data from local storage.
   */
  getAssessmentData(): StartAssessmentResponse['data'] | null {
    const assessmentData = localStorage.getItem("assessmentData");
    if (assessmentData) {
      return JSON.parse(assessmentData);
    }
    return null;
  }

  /**
   * Clear all data from local storage.
   */
  clearData(): void {
    localStorage.removeItem("inviteData");
    localStorage.removeItem("assessmentData");
  }
}