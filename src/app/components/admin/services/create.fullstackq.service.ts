import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FullStackQuestionRequest } from "../types/fullstack-question.type";

@Injectable({
  providedIn: "root",
})
export class FullStackQuestionService {
  private apiUrl = "http://localhost:8080/api/question";

  constructor(private http: HttpClient) {}

  // Method to create a full-stack question
  createFullStackQuestion(
    question: FullStackQuestionRequest
  ): Observable<any> {
    const url = `${this.apiUrl}/create-fullstack-question`;
    return this.http.post(url, question);
  }
}