import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Assessment } from '../component/create-assessment-modal/create-assessment-modal.component';
import { JobRole } from '../component/create-assessment-modal/create-assessment-modal.component';


@Injectable({
  providedIn: 'root'
})
export class AssessmentDataService {
  private jobRoles: JobRole[] = [];
  private assessments: Assessment[] = [];

  private jobRolesSubject = new BehaviorSubject<JobRole[]>(this.jobRoles);
  private assessmentsSubject = new BehaviorSubject<Assessment[]>(this.assessments);

  jobRoles$ = this.jobRolesSubject.asObservable();
  assessments$ = this.assessmentsSubject.asObservable();

  constructor() {}

  // JobRole methods
  addJobRole(jobRole: JobRole): void {
    this.jobRoles.push(jobRole);
    this.jobRolesSubject.next(this.jobRoles);
  }

  getJobRoles(): JobRole[] {
    return this.jobRoles;
  }

  // Assessment methods
  addAssessment(assessment: Assessment): void {
    console.log('DataService - ',assessment)
    this.assessments.push(assessment);
    this.assessmentsSubject.next(this.assessments);
  }

  getAssessments(): Assessment[] {
    return this.assessments;
  }
}