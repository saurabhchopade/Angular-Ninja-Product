import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { MCQQuestion } from "../types/mcq-question.type";

@Injectable({
  providedIn: "root",
})
export class MCQQuestionService {
  private apiUrl = "http://localhost:8080/api/question/create-mcq";

  constructor(private http: HttpClient) {}

  createMCQ(question: MCQQuestion): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(this.apiUrl, question, { headers });
  }
}
