import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private inviteDataSubject = new BehaviorSubject<any>(null); // Default value is null
  inviteData$ = this.inviteDataSubject.asObservable();

  updateInviteData(data: any) {
    this.inviteDataSubject.next(data);
  }

  getCurrentData() {
    return this.inviteDataSubject.value; // Get the last emitted value
  }
}
