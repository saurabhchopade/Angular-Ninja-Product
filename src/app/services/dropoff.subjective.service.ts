import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, interval } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DropOffService {
  private apiUrl = "http://localhost:8080/api/subjective-questions/drop-off-answer";

  constructor(private http: HttpClient) {}

  pushDropOffAnswer(
    questionId: number,
    assessmentId: number,
    sectionId: number,
    candidateId: number,
    answer: string,
    candidateAssessmentSessionId: number,
  ): Observable<any> {
    const body = {
      questionId,
      assessmentId,
      sectionId,
      candidateId,
      answer,
      candidateAssessmentSessionId,
    };
    return this.http.post<any>(this.apiUrl, body);
  }

  startPeriodicPush(
    questionId: number,
    assessmentId: number,
    sectionId: number,
    candidateId: number,
    answer: string,
    candidateAssessmentSessionId: number,
  ): void {
    interval(30000)
      .pipe(
        switchMap(() =>
          this.pushDropOffAnswer(
            questionId,
            assessmentId,
            sectionId,
            candidateId,
            answer,
            candidateAssessmentSessionId,
          ),
        ),
      )
      .subscribe((response) => {
        console.log("Drop-off answer pushed:", response);
      });
  }
}
