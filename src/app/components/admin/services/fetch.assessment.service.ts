import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssessmentSearchResponse {
  code: number;
  status: string;
  message: string;
  data: {
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    list: Assessment[];
  };
}

export interface Assessment {
  assessmentId: number;
  assessmentName: string;
  assessmentType: string;
  assessmentStatus: string;
  assessmentStartTime: string;
  assessmentEndTime: string;
  duration: string;
  assessmentAccess: boolean;
  difficultyLevel: string;
  jobRoleDto: any;
  testLink: string;
  practiceLink: string;
  aiPoweredQuestion: boolean;
  assessmentSectionDto: any;
  assessmentSettingDto: any;
  assessmentAdminDto: any;
}

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private apiUrl = 'http://localhost:8080/api/assessment/search';

  constructor(private http: HttpClient) {}

  searchAssessments(
    pageNumber: number,
    pageSize: number,
    searchCommonString: string
  ): Observable<AssessmentSearchResponse> {
    const requestBody = {
      pageNumber,
      pageSize,
      searchCommonString,
    };

    return this.http.post<AssessmentSearchResponse>(this.apiUrl, requestBody);
  }
}