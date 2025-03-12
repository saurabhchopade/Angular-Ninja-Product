import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpEventType } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FullstackFileUploadService {
  private apiUrl = "http://localhost:8080/api/full-stack/upload"; // API endpoint for file upload

  constructor(private http: HttpClient) {}

  // Upload a single file with full-stack metadata
  uploadFile(
    file: File,
    questionId: number,
    assessmentId: number,
    sectionId: number,
    candidateId: number
  ): Observable<HttpEvent<any>> {
    const formData = new FormData();

    // Append the file to FormData
    formData.append("file", file, file.name);

    // Append full-stack metadata as a JSON string with explicit Content-Type
    const fullStackMetadata = {
      questionId,
      assessmentId,
      sectionId,
      candidateId,
    };
    const metadataBlob = new Blob([JSON.stringify(fullStackMetadata)], {
      type: "application/json", // Explicitly set Content-Type
    });
    formData.append("fullStack", metadataBlob);

    // Make the HTTP POST request
    return this.http.post(this.apiUrl, formData, {
      reportProgress: true, // Enable progress tracking
      observe: "events", // Observe the full HTTP event
    });
  }
}