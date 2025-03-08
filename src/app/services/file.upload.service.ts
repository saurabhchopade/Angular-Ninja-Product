import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private apiUrl = "http://localhost:8080/api/full-stack/upload";

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append("file", file);

    const req = new HttpRequest("POST", this.apiUrl, formData, {
      reportProgress: true,
      responseType: "json",
    });

    return this.http.request(req);
  }

  uploadMultipleFiles(
    files: File[],
    notes: string,
  ): Observable<HttpEvent<any>> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("files", file);
    });

    formData.append("notes", notes);

    const req = new HttpRequest("POST", `${this.apiUrl}/multiple`, formData, {
      reportProgress: true,
      responseType: "json",
    });

    return this.http.request(req);
  }

  saveProgress(files: string[], notes: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-progress`, {
      files,
      notes,
    });
  }

  getProgress(): Observable<any> {
    return this.http.get(`${this.apiUrl}/progress`);
  }

  validateFile(file: File): { valid: boolean; message?: string } {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return {
        valid: false,
        message: `File "${file.name}" exceeds the 10MB size limit.`,
      };
    }

    // Check file type
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!["zip", "rar", "gz"].includes(fileExt || "")) {
      return {
        valid: false,
        message: `File "${file.name}" is not an accepted format. Please use .zip, .rar, or .tar.gz files.`,
      };
    }

    return { valid: true };
  }
}
