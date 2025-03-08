import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { QuestionType } from '../../types/question.type';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestType } from '../../types/test.type';
import { TestCardComponent } from '../test-card/test-card.component';
import { QuestionTypeModalComponent, QuestionTypeOption } from '../question-type/question-type-modal.component';
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
import { AssessmentDataService } from '../../services/assessment.data.service';
import { QuestionService, Question, QuestionResponse } from '../../services/fetch.question.service';

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
    TestPublishComponent,
    HttpClientModule
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
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onSearch()"
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
            <div *ngIf="activeTab === 'library'" class="flex items-center gap-4 mb-6">
              <!-- Question Types Dropdown -->
              <div class="relative">
                <button 
                  (click)="toggleDropdown('types')"
                  class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <span class="material-icons text-gray-500">filter_list</span>
                  Question Types
                  <span class="material-icons text-gray-500 text-sm">expand_more</span>
                </button>
                <div *ngIf="showDropdowns.types"
                     class="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                  <div class="p-3 space-y-2">
                    <label *ngFor="let type of questionTypes" class="flex items-center gap-2">
                      <input type="checkbox"
                             [(ngModel)]="selectedTypes[type]"
                             (change)="applyFilters()"
                             class="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]">
                      <span>{{type}}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Libraries Dropdown -->
              <div class="relative">
                <button 
                  (click)="toggleDropdown('libraries')"
                  class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <span class="material-icons text-gray-500">folder</span>
                  Libraries
                  <span class="material-icons text-gray-500 text-sm">expand_more</span>
                </button>
                <div *ngIf="showDropdowns.libraries"
                     class="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                  <div class="p-3 space-y-2">
                    <label *ngFor="let lib of libraries" class="flex items-center gap-2">
                      <input type="checkbox"
                             [(ngModel)]="selectedLibraries[lib]"
                             (change)="applyFilters()"
                             class="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]">
                      <span>{{lib}}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Difficulty Levels -->
              <div class="flex items-center gap-2">
                <button *ngFor="let level of difficultyLevels"
                        (click)="toggleDifficulty(level)"
                        [class]="getDifficultyButtonClass(level)"
                        class="px-3 py-1 rounded-full text-sm transition-colors">
                  {{level}}
                </button>
              </div>

              <!-- Active Filters -->
              <div *ngIf="hasActiveFilters" class="flex flex-wrap gap-2">
                <div *ngFor="let filter of activeFilters"
                     class="px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-sm flex items-center">
                  {{filter}}
                  <button (click)="removeFilter(filter)"
                          class="ml-2 text-[#4CAF50] hover:text-[#43A047]">
                    <span class="material-icons text-sm">close</span>
                  </button>
                </div>
                <button 
                  (click)="clearFilters()"
                  class="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm">
                  Clear all filters
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6">
              <!-- Tabs -->
              <div class="flex space-x-4 mb-6">
                <button *ngFor="let tab of tabs"
                        (click)="activeTab = tab.toLowerCase(); clearFilters()"
                        [class]="getTabClass(tab.toLowerCase())">
                  {{tab}}
                </button>
              </div>

              <!-- Content -->
              <ng-container *ngIf="activeTab === 'assessments'">
                <ng-container *ngIf="!showingReport">
                  <!-- Cards Grid -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <app-test-card *ngFor="let test of filteredTests"
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
                <div class="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm">
                  <!-- Questions Grid with Scrollable Container -->
                  <div class="flex-1 overflow-y-auto p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <app-question-card *ngFor="let question of paginatedQuestions" [question]="question">
                      </app-question-card>
                    </div>
                  </div>

                  <!-- Pagination Controls (Fixed at Bottom) -->
                  <div class="flex justify-between items-center p-4 border-t border-gray-200 bg-white">
                    <button 
                      (click)="previousPage()"
                      [disabled]="currentPage === 0"
                      class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      Previous
                    </button>
                    <span class="text-gray-600">Page {{ currentPage + 1 }}</span>
                    <button 
                      (click)="nextPage()"
                      [disabled]="paginatedQuestions.length < pageSize"
                      class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      Next
                    </button>
                  </div>
                </div>
              </ng-container>
            </div>
          </div>
        </ng-container>

        <!-- Test Publish Page -->
        <app-test-publish 
          *ngIf="showPublishPage"
          (navigate)="handleNavigation($event)">
        </app-test-publish>
      </main>

      <!-- Modals -->
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
  `,
})
export class AssessmentLibraryComponent implements OnInit {
  @ViewChild('questionTypeModal') questionTypeModal!: QuestionTypeModalComponent;
  @ViewChild('createSubjectiveModal') createSubjectiveModal!: CreateSubjectiveModalComponent;
  @ViewChild('createProgrammingModal') createProgrammingModal!: CreateProgrammingModalComponent;
  @ViewChild('createMCQModal') createMCQModal!: CreateMCQModalComponent;
  @ViewChild('createFullStackModal') createFullStackModal!: CreateFullStackModalComponent;
  @ViewChild('inviteCandidatesModal') inviteCandidatesModal!: InviteCandidatesModalComponent;
  @ViewChild('createAssessmentModal') createAssessmentModal!: CreateAssessmentModalComponent;

  activeTab: string = 'library';
  tabs = ['Assessments', 'Library'];
  difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];
  selectedTestId: number = 0;
  showingReport: boolean = false;
  showPublishPage: boolean = false;

  searchQuery = '';
  questionTypes = ['MCQ', 'CODING', 'SUBJECTIVE', 'FULL STACK'];
  libraries = ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Security'];
  selectedTypes: { [key: string]: boolean } = {};
  selectedLibraries: { [key: string]: boolean } = {};
  selectedDifficulty = '';
  showDropdowns = {
    types: false,
    libraries: false,
  };

  questions: Question[] = [];
  cachedQuestions: { [key: number]: Question[] } = {}; // Cache for paginated questions
  currentPage = 0;
  pageSize = 9;
  sortField = '';
  sortOrder = '';
  searchDifficultyLevels: string[] = [];
  searchQuestionType: string[] = [];

  constructor(
    private assessmentDataService: AssessmentDataService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    if (this.cachedQuestions[this.currentPage]) {
      // Use cached questions if available
      this.questions = this.cachedQuestions[this.currentPage];
      return;
    }

    this.questionService
      .fetchQuestions(
        this.currentPage,
        this.pageSize,
        this.sortField,
        this.sortOrder,
        this.searchDifficultyLevels,
        this.searchQuestionType,
        this.searchQuery
      )
      .subscribe((response) => {
        if (response.code === 200 && response.status === 'SUCCESS') {
          this.questions = response.data.list;
          this.cachedQuestions[this.currentPage] = this.questions; // Cache the fetched questions
        } else {
          console.error('Failed to fetch questions:', response.message);
        }
      });
  }

  get paginatedQuestions(): Question[] {
    return this.questions;
  }

  onSearch(): void {
    console.log('Query',this.searchQuery)
    console.log('Query',this.selectedTypes)

    this.currentPage = 0;
    this.cachedQuestions = {}; // Clear cache on new search
    this.fetchQuestions();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.cachedQuestions = {}; 
    this.updateSearchQuestionType()// Clear cache on new filters
    console.log('TYPES', this.searchQuestionType)
    this.fetchQuestions();
  }

  updateSearchQuestionType() {
    this.searchQuestionType = Object.keys(this.selectedTypes)
      .filter(key => this.selectedTypes[key]); // Push only the keys with `true` value
  }
  
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchQuestions();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchQuestions();
  }



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

  // ... other existing methods ...


  // questions: QuestionType[] = [
  //   {
  //     id: 1,
  //     title: "RESTful API Design",
  //     description: "Design a scalable REST API for a social media platform with user authentication and post management.",
  //     difficulty: "Intermediate",
  //     score: 85,
  //     technologies: ["Python", "FastAPI"],
  //     categories: ["Full Stack", "Backend"]
  //   },
  //   {
  //     id: 2,
  //     title: "Security Analysis",
  //     description: "Perform a security assessment of a web application and identify potential vulnerabilities.",
  //     difficulty: "Advanced",
  //     score: 92,
  //     technologies: ["CyberOps", "Security"],
  //     categories: ["Security", "Analysis"]
  //   },
  //   {
  //     id: 3,
  //     title: "Frontend Development",
  //     description: "Create a responsive dashboard using React and modern CSS techniques.",
  //     difficulty: "Basic",
  //     score: 78,
  //     technologies: ["React", "TypeScript"],
  //     categories: ["Frontend", "UI/UX"]
  //   }
  // ];

  // tests: TestType[] = [
  //   {
  //     id: 1,
  //     name: "Frontend Developer Assessment",
  //     inviteType: "Invite Only",
  //     duration: "1 hr 30 mins",
  //     testDate: "Feb 15th, 2025, 12:00 PM IST",
  //     endDate: "Feb 15th, 2025, 11:59 PM IST",
  //     invitedCount: 50,
  //     completedCount: 35,
  //     status: "Active"
  //   },
  //   {
  //     id: 2,
  //     name: "Backend Engineering Test",
  //     inviteType: "Public",
  //     duration: "2 hrs",
  //     testDate: "Feb 20th, 2025, 10:00 AM IST",
  //     invitedCount: 100,
  //     completedCount: 75,
  //     status: "Active"
  //   },
  //   {
  //     id: 3,
  //     name: "DevOps Assessment",
  //     inviteType: "Invite Only",
  //     duration: "1 hr",
  //     testDate: "Feb 10th, 2025, 3:00 PM IST",
  //     endDate: "Feb 10th, 2025, 6:00 PM IST",
  //     invitedCount: 25,
  //     completedCount: 25,
  //     status: "Completed"
  //   }
  // ];

  get filteredTests(): TestType[] {
    if (!this.searchQuery) {
      return this.tests;
    }

    const query = this.searchQuery.toLowerCase();
    return this.tests.filter(test => 
      test.name.toLowerCase().includes(query) ||
      test.inviteType.toLowerCase().includes(query) ||
      test.status.toLowerCase().includes(query) ||
      test.duration.toLowerCase().includes(query) ||
      test.testDate.toLowerCase().includes(query)
    );
  }

  // get filteredQuestions(): QuestionType[] {
  //   let filtered = [...this.questions];

  //   // Apply search
  //   if (this.searchQuery) {
  //     const query = this.searchQuery.toLowerCase();
  //     filtered = filtered.filter(q => 
  //       q.title.toLowerCase().includes(query) ||
  //       q.description.toLowerCase().includes(query) ||
  //       q.technologies.some(t => t.toLowerCase().includes(query)) ||
  //       q.categories.some(c => c.toLowerCase().includes(query))
  //     );
  //   }

  //   // Apply difficulty filter
  //   if (this.selectedDifficulty) {
  //     filtered = filtered.filter(q => q.difficulty === this.selectedDifficulty);
  //   }

  //   // Apply question type filters
  //   const activeTypes = Object.entries(this.selectedTypes)
  //     .filter(([_, selected]) => selected)
  //     .map(([type]) => type);
  //   if (activeTypes.length > 0) {
  //     filtered = filtered.filter(q => 
  //       q.categories.some(c => activeTypes.includes(c))
  //     );
  //   }

  //   // Apply library filters
  //   const activeLibraries = Object.entries(this.selectedLibraries)
  //     .filter(([_, selected]) => selected)
  //     .map(([lib]) => lib);
  //   if (activeLibraries.length > 0) {
  //     filtered = filtered.filter(q => 
  //       q.categories.some(c => activeLibraries.includes(c))
  //     );
  //   }

  //   return filtered;
  // }

  get hasActiveFilters(): boolean {
    return this.selectedDifficulty !== '' ||
           Object.values(this.selectedTypes).some(v => v) ||
           Object.values(this.selectedLibraries).some(v => v);
  }

  get activeFilters(): string[] {
    const filters: string[] = [];
    
    if (this.selectedDifficulty) {
      filters.push(`Difficulty: ${this.selectedDifficulty}`);
    }

    Object.entries(this.selectedTypes)
      .filter(([_, selected]) => selected)
      .forEach(([type]) => filters.push(`Type: ${type}`));

    Object.entries(this.selectedLibraries)
      .filter(([_, selected]) => selected)
      .forEach(([lib]) => filters.push(`Library: ${lib}`));

    return filters;
  }

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

  getDifficultyButtonClass(level: string): string {
    const isSelected = this.searchDifficultyLevels.includes(level);
    const baseClasses = 'px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ';
  
    switch (level) {
      case 'Basic':
        return baseClasses + (isSelected
          ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200' // Darker green for selected state
          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'); // Default grey state
      case 'Intermediate':
        return baseClasses + (isSelected
          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200' // Darker yellow for selected state
          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'); // Default grey state
      case 'Advanced':
        return baseClasses + (isSelected
          ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200' // Darker red for selected state
          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'); // Default grey state
      default:
        return baseClasses + 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'; // Default grey state for unknown levels
    }
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
    this.assessmentDataService.addAssessment(assessment);
    // console.log('Published assessment:', assessment);
    this.showPublishPage = true;
  }

  onAssessmentDrafted(assessment: any) {
    console.log('Saved assessment draft:', assessment);
  }

  handleNavigation(page: string) {
    if (page === 'online-evaluation' || page === 'assessment') {
      this.showPublishPage = false;
    }
  }

  toggleDropdown(type: 'types' | 'libraries') {
    this.showDropdowns[type] = !this.showDropdowns[type];
    // Close other dropdown
    const other = type === 'types' ? 'libraries' : 'types';
    this.showDropdowns[other] = false;
  }

  toggleDifficulty(level: string) {
    if (this.searchDifficultyLevels.includes(level)) {
      // If level already exists, remove it (toggle off)
      this.searchDifficultyLevels = this.searchDifficultyLevels.filter(d => d !== level);
    } else {
      // If level doesn't exist, add it (toggle on)
      this.searchDifficultyLevels.push(level);
    }
  
    console.log("Selected Difficulty Levels:", this.searchDifficultyLevels);
    this.applyFilters();
  }
  // onSearch() {
  //   this.applyFilters();
  // }

  // applyFilters() {
  //   // Filters are automatically applied through the filteredQuestions getter
  // }

  removeFilter(filter: string) {
    const [type, value] = filter.split(': ');
    switch (type) {
      case 'Difficulty':
        this.selectedDifficulty = '';
        break;
      case 'Type':
        this.selectedTypes[value] = false;
        break;
      case 'Library':
        this.selectedLibraries[value] = false;
        break;
    }
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedDifficulty = '';
    this.selectedTypes = {};
    this.selectedLibraries = {};
    this.applyFilters();
  }
}