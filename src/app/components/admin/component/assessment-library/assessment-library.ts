import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { QuestionType } from '../../types/question.type';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestType } from '../../types/test.type';
import { TestCardComponent } from "../test-card/test-card.component";
import { QuestionTypeModalComponent, QuestionTypeOption } from "../question-type/question-type-modal.component";
import { CreateSubjectiveModalComponent, SubjectiveQuestion } from '../create-subjective-modal/create-subjective-modal.component';
import { CreateProgrammingModalComponent } from '../create-programming-modal/create-programming-modal.component';
import { ProgrammingQuestion } from '../../types/programming-question.type';
import { CreateMCQModalComponent } from '../create-mcq-modal/create-mcq-modal.component';
import { MCQQuestion } from '../../types/mcq-question.type';
import { FullStackQuestion } from '../../types/fullstack-question.type';
import { CreateFullStackModalComponent } from '../create-fullstack-modal/create-fullstack-modal.component';
import { CandidateInviteData } from '../../types/candidate.type';
import { InviteCandidatesModalComponent } from '../invite-candidates-modal/invite-candidates-modal.component';
import { AssessmentReportComponent } from '../assessment-report/assessment-report.component';
import { CreateAssessmentModalComponent } from '../create-assessment-modal/create-assessment-modal.component';
import { TestPublishComponent } from '../test-publish/test-publish.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    QuestionCardComponent,
    TestCardComponent,
    QuestionTypeModalComponent,
    CreateSubjectiveModalComponent,
    CreateProgrammingModalComponent,
    CreateMCQModalComponent,
    CreateFullStackModalComponent,
    InviteCandidatesModalComponent,
    AssessmentReportComponent,
    CreateAssessmentModalComponent,
    TestPublishComponent
  ],
  template: `
    <div class="flex h-screen bg-gray-50">
      <app-sidebar />
      
      <main class="flex-1 overflow-auto">
        <ng-container *ngIf="!showPublishPage">
          <div class="p-8">
            <!-- Search and Create Button -->
            <div class="flex justify-between items-center mb-8">
              <div class="relative flex-1 max-w-2xl">
                <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  [placeholder]="activeTab === 'assessments' ? 'Search assessments...' : 'Search questions by topic, title, or description...'"
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                >
              </div>
              <button 
                (click)="onCreateClick()"
                class="flex items-center px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow ml-4">
                <span class="material-icons mr-2">add</span>
                Create {{activeTab === 'assessments' ? 'Assessment' : 'Question'}}
              </button>
            </div>

            <!-- Library Filters - Only visible in library tab -->
            <div *ngIf="activeTab === 'library'" class="flex items-center space-x-4 mb-6">
              <div class="flex items-center space-x-2">
                <span class="material-icons text-gray-500">filter_list</span>
                <select class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]">
                  <option>All Question Types</option>
                  <option>Multiple Choice</option>
                  <option>Coding</option>
                  <option>Design</option>
                </select>
              </div>
              <select class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]">
                <option>All Libraries</option>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Security</option>
              </select>
              <div class="flex items-center space-x-2">
                <span *ngFor="let level of difficultyLevels"
                      [class]="getDifficultyColor(level)">
                  {{level}}
                </span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">
              <!-- Tabs -->
              <div class="flex space-x-4 mb-6">
                <button *ngFor="let tab of tabs"
                        (click)="activeTab = tab.toLowerCase()"
                        [class]="getTabClass(tab.toLowerCase())">
                  {{tab}}
                </button>
              </div>

              <!-- Content -->
              <ng-container *ngIf="activeTab === 'assessments'">
                <ng-container *ngIf="!showingReport">
                  <!-- Cards Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <app-test-card *ngFor="let test of tests"
                                  [test]="test"
                                  (viewReport)="onViewReport($event)"
                                  (invite)="onInvite($event)"
                                  (archive)="onArchive($event)">
                    </app-test-card>
                  </div>
                </ng-container>
                
                <ng-container *ngIf="showingReport">
                  <div class="flex items-center mb-6">
                    <button 
                      (click)="showingReport = false"
                      class="flex items-center text-gray-600 hover:text-gray-800">
                      <span class="material-icons mr-1">arrow_back</span>
                      Back to Assessments
                    </button>
                  </div>
                  <app-assessment-report [testId]="selectedTestId"></app-assessment-report>
                </ng-container>
              </ng-container>

              <ng-container *ngIf="activeTab === 'library'">
                <!-- Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <app-question-card *ngFor="let question of questions"
                                  [question]="question">
                  </app-question-card>
                </div>
              </ng-container>
            </div>
          </div>
        </ng-container>

        <!-- Test Publish Page -->
        <app-test-publish *ngIf="showPublishPage"></app-test-publish>
      </main>

      <app-question-type-modal
        #questionTypeModal
        (typeSelected)="onQuestionTypeSelected($event)"
      ></app-question-type-modal>
      
      <app-create-subjective-modal
        #createSubjectiveModal
        (published)="onQuestionPublished($event)"
        (drafted)="onQuestionDrafted($event)"
      ></app-create-subjective-modal>

      <app-create-programming-modal
        #createProgrammingModal
        (published)="onProgrammingQuestionPublished($event)"
        (drafted)="onProgrammingQuestionDrafted($event)"
      ></app-create-programming-modal>

      <app-create-mcq-modal
        #createMCQModal
        (published)="onMCQQuestionPublished($event)"
        (drafted)="onMCQQuestionDrafted($event)"
      ></app-create-mcq-modal>

      <app-create-fullstack-modal
        #createFullStackModal
        (published)="onFullStackQuestionPublished($event)"
        (drafted)="onFullStackQuestionDrafted($event)"
      ></app-create-fullstack-modal>

      <app-invite-candidates-modal
        #inviteCandidatesModal
        [testId]="selectedTestId"
        (invitesSent)="onInvitesSent($event)"
      ></app-invite-candidates-modal>

      <app-create-assessment-modal
        #createAssessmentModal
        (published)="onAssessmentPublished($event)"
        (drafted)="onAssessmentDrafted($event)"
      ></app-create-assessment-modal>
    </div>
  `
})
export class AssessmentLibraryComponent {
  @ViewChild('questionTypeModal') questionTypeModal!: QuestionTypeModalComponent;
  @ViewChild('createSubjectiveModal') createSubjectiveModal!: CreateSubjectiveModalComponent;
  @ViewChild('createProgrammingModal') createProgrammingModal!: CreateProgrammingModalComponent;
  @ViewChild('createMCQModal') createMCQModal!: CreateMCQModalComponent;
  @ViewChild('createFullStackModal') createFullStackModal!: CreateFullStackModalComponent;
  @ViewChild('inviteCandidatesModal') inviteCandidatesModal!: InviteCandidatesModalComponent;
  @ViewChild('createAssessmentModal') createAssessmentModal!: CreateAssessmentModalComponent;
  
  activeTab: string = 'assessments';
  tabs = ['Assessments', 'Library'];
  difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];
  selectedTestId: number = 0;
  showingReport: boolean = false;
  showPublishPage: boolean = false;

  questions: QuestionType[] = [
    {
      id: 1,
      title: "RESTful API Design",
      description: "Design a scalable REST API for a social media platform with user authentication and post management.",
      difficulty: "Intermediate",
      score: 85,
      technologies: ["Python", "FastAPI"],
      categories: ["Full Stack", "Backend"]
    },
    {
      id: 2,
      title: "Security Analysis",
      description: "Perform a security assessment of a web application and identify potential vulnerabilities.",
      difficulty: "Advanced",
      score: 92,
      technologies: ["CyberOps", "Security"],
      categories: ["Security", "Analysis"]
    },
    {
      id: 3,
      title: "Frontend Development",
      description: "Create a responsive dashboard using React and modern CSS techniques.",
      difficulty: "Basic",
      score: 78,
      technologies: ["React", "TypeScript"],
      categories: ["Frontend", "UI/UX"]
    }
  ];

  tests: TestType[] = [
    {
      id: 1,
      name: "Frontend Developer Assessment",
      inviteType: "Invite Only",
      duration: "1 hr 30 mins",
      testDate: "Feb 15th, 2025, 12:00 PM IST",
      endDate: "Feb 15th, 2025, 11:59 PM IST",
      invitedCount: 50,
      completedCount: 35,
      status: "Active"
    },
    {
      id: 2,
      name: "Backend Engineering Test",
      inviteType: "Public",
      duration: "2 hrs",
      testDate: "Feb 20th, 2025, 10:00 AM IST",
      invitedCount: 100,
      completedCount: 75,
      status: "Active"
    },
    {
      id: 3,
      name: "DevOps Assessment",
      inviteType: "Invite Only",
      duration: "1 hr",
      testDate: "Feb 10th, 2025, 3:00 PM IST",
      endDate: "Feb 10th, 2025, 6:00 PM IST",
      invitedCount: 25,
      completedCount: 25,
      status: "Completed"
    }
  ];

  getDifficultyColor(difficulty: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm ';
    switch (difficulty) {
      case 'Basic': return baseClasses + 'bg-green-100 text-green-800';
      case 'Intermediate': return baseClasses + 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return baseClasses + 'bg-red-100 text-red-800';
      default: return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }

  getTabClass(tab: string): string {
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors ';
    return baseClasses + (this.activeTab === tab
      ? 'bg-[#4CAF50] text-white'
      : 'text-gray-600 hover:bg-gray-100');
  }

  onCreateClick() {
    if (this.activeTab === 'library') {
      this.questionTypeModal.show();
    } else {
      this.createAssessmentModal.show();
    }
  }

  onQuestionTypeSelected(type: QuestionTypeOption) {
    if (type === 'subjective') {
      this.createSubjectiveModal.show();
    } else if (type === 'programming') {
      this.createProgrammingModal.show();
    } else if (type === 'mcq') {
      this.createMCQModal.show();
    } else if (type === 'fullstack') {
      this.createFullStackModal.show();
    }
  }

  onQuestionPublished(question: SubjectiveQuestion) {
    console.log('Published subjective question:', question);
  }

  onQuestionDrafted(question: SubjectiveQuestion) {
    console.log('Saved subjective draft:', question);
  }

  onProgrammingQuestionPublished(question: ProgrammingQuestion) {
    console.log('Published programming question:', question);
  }

  onProgrammingQuestionDrafted(question: ProgrammingQuestion) {
    console.log('Saved programming draft:', question);
  }

  onMCQQuestionPublished(question: MCQQuestion) {
    console.log('Published MCQ question:', question);
  }

  onMCQQuestionDrafted(question: MCQQuestion) {
    console.log('Saved MCQ draft:', question);
  }

  onFullStackQuestionPublished(question: FullStackQuestion) {
    console.log('Published full stack question:', question);
  }

  onFullStackQuestionDrafted(question: FullStackQuestion) {
    console.log('Saved full stack draft:', question);
  }

  onViewReport(id: number) {
    this.selectedTestId = id;
    this.showingReport = true;
  }

  onInvite(id: number) {
    this.selectedTestId = id;
    this.inviteCandidatesModal.show();
  }

  onInvitesSent(data: CandidateInviteData) {
    console.log('Invites sent:', data);
  }

  onArchive(id: number) {
    console.log('Archive test:', id);
  }

  onAssessmentPublished(assessment: any) {
    console.log('Published assessment:', assessment);
    this.showPublishPage = true;
  }

  onAssessmentDrafted(assessment: any) {
    console.log('Saved assessment draft:', assessment);
  }
}