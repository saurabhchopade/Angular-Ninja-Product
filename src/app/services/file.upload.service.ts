import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpEventType } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FullstackFileUploadService {
  private apiUrl = "http://localhost:8080/api/full-stack/upload"; // Updated URL for file upload

  constructor(private http: HttpClient) {}

  // Fetch full-stack questions
  fetchFullStackQuestions(
    assessmentId: number,
    candidateId: number,
    sectionId: number
  ): Observable<any> {
    const url = `${this.apiUrl}/fetch-fullstack-questions`;
    const body = { assessmentId, candidateId, sectionId };
    return this.http.post(url, body);
  }

  // Upload files with full-stack metadata
  uploadFiles(
    files: File[],
    questionId: number,
    assessmentId: number,
    sectionId: number,
    candidateId: number
  ): Observable<HttpEvent<any>> {
    const formData = new FormData();

    // Append files to FormData
    files.forEach((file) => {
      formData.append("file", file, file.name);
    });

    // Append full-stack metadata as a JSON string
 

    return this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: "events",
    });
  }
}