import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { take } from "rxjs/operators";
import { Assessment } from "../component/create-assessment-modal/create-assessment-modal.component";
import { JobRole } from "../component/create-assessment-modal/create-assessment-modal.component";
import { TestPublishDetails } from "../types/test-publish.type";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AssessmentDataService {
  private jobRoles: JobRole[] = [];
  private assessments: Assessment[] = [];
  private test: TestPublishDetails[] = [];

  private jobRolesSubject = new BehaviorSubject<JobRole[]>(this.jobRoles);
  private assessmentsSubject = new BehaviorSubject<Assessment[]>(this.assessments);
  private testPublishDetailsSubject = new BehaviorSubject<TestPublishDetails[]>(this.test);

  jobRoles$ = this.jobRolesSubject.asObservable();
  assessments$ = this.assessmentsSubject.asObservable();
  test$ = this.testPublishDetailsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // JobRole methods
  addJobRole(jobRole: JobRole): void {
    this.jobRoles.push(jobRole);
    this.jobRolesSubject.next(this.jobRoles);
  }

  getJobRoles(): JobRole[] {
    return this.jobRoles;
  }

  // Assessment methods
  addTestPublishDetails(testPublishDetails: TestPublishDetails): void {
    console.log("Publish Data In Data Service - ", testPublishDetails);
    this.test.push(testPublishDetails);
    this.testPublishDetailsSubject.next(this.test);
    this.checkAndCombineData();
  }

  addAssessment(assessment: Assessment): void {
    console.log("Assessment Data In Data Service - ", assessment);
    this.assessments.push(assessment);
    this.assessmentsSubject.next(this.assessments);
    this.checkAndCombineData();
  }

  getAssessments(): Assessment[] {
    return this.assessments;
  }

  private checkAndCombineData() {
    combineLatest([this.testPublishDetailsSubject, this.assessmentsSubject])
      .pipe(take(1))
      .subscribe(([testDetails, assessments]) => {
        if (testDetails.length > 0 && assessments.length > 0) {
          const combinedData = this.combineData(testDetails[0], assessments[0]);
          console.log("Combined Data:", combinedData);

          this.createAssessment(combinedData);
          // You can now call your API or perform other actions with the combined data
        }
      });
  }

  private combineData(testDetails: TestPublishDetails, assessment: Assessment): any {
    return {
      assessmentName: testDetails.name,
      assessmentType: 'Technical', // You can modify this as needed
      assessmentStatus: 'Active', // You can modify this as needed
      assessmentStartTime: assessment.startDate,
      assessmentEndTime:assessment.endDate,
      
      duration: '1 hr 30 mins', // You can modify this as needed
      assessmentAccess: testDetails.isAccessEnabled,
      difficultyLevel: 'Hard', // You can modify this as needed
      aiPoweredQuestion: false, // You can modify this as needed
      jobRoleDto: {
        name: assessment.jobRole,
        minExperience: 2, // You can modify this as needed
        maxExperience: 5, // You can modify this as needed
        tags: assessment.skills,
      },
      assessmentSectionDto: testDetails.sections.map((section: any) => ({
        name: section.title,
        description: section.questions[0].description,
        sequenceNo: section.id,
        minRandomQuestions: section.minRandomQuestions,
        questionIds: section.questions.map((question: any) => question.id),
      })),
      assessmentSettingDto: {
        testDescription: testDetails.settings.testDescription,
        testInstruction: testDetails.settings.testInstruction,
        enableAudioProctoring: testDetails.settings.enableAudioProctoring,
        enableSmartBrowser: testDetails.settings.enableSmartBrowser,
        idVerification: testDetails.settings.idVerification,
        enableRandomQuestionShuffling:
          testDetails.settings.enableRandomQuestionShuffling,
        disableSubmissionResults: testDetails.settings.disableSubmissionResults,
        disableCopyPasteInCodeEditor:
          testDetails.settings.disableCopyPasteInCodeEditor,
        takeCandidateSnapshots: testDetails.settings.takeCandidateSnapshots,
        restrictFullScreenMode: testDetails.settings.restrictFullScreenMode,
        logoutOnLeavingTest: testDetails.settings.logoutOnLeavingTest,
        restrictTestAccessForIP: testDetails.settings.restrictTestAccessForIP,
        emailReport: testDetails.settings.emailReport,
        plagiarismReport: testDetails.settings.plagiarismReport,
        detailedAssessmentReport: testDetails.settings.detailedAssessmentReport,
        slackReport: testDetails.settings.slackReport,
        candidateSelfAssessmentReport:
          testDetails.settings.candidateSelfAssessmentReport,
        showQuestions: testDetails.settings.showQuestions,
        showCandidateAnswers: testDetails.settings.showCandidateAnswers,
        showCorrectAnswers: testDetails.settings.showCorrectAnswers,
        autoReminder: testDetails.settings.autoReminder,
        enableChatGPTInAssessments:
          testDetails.settings.enableChatGPTInAssessments,
      },
      assessmentAdminDto: testDetails.admins.map((admin: any) => ({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      })),
    };
  }


  
  private createAssessment(data: any) {
    this.http
      .post('http://localhost:8080/api/assessment/create', data)
      .subscribe(
        (response) => {
          console.log('Assessment created successfully:', response);
        },
        (error) => {
          console.error('Error creating assessment:', error);
        }
      );
  }  
}