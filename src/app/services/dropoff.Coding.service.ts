import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DropOffAnswerService {
  private apiUrl = "http://localhost:8080/api/questions/coding/drop-off-answer";

  constructor(private http: HttpClient) {}

  dropOffAnswer(answerData: any): Observable<any> {
    return this.http.post(this.apiUrl, answerData);
  }
}
