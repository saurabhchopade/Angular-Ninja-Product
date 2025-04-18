import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TestPublishDetails, TestSection } from "../../types/test-publish.type";
import { QuestionLibraryComponent } from "../question-library/question-library.component";
import { QuestionType } from "../../types/question.type";
import { AssessmentDataService } from "../../services/assessment.data.service";

@Component({
  selector: "app-test-publish",
  standalone: true,
  imports: [CommonModule, FormsModule, QuestionLibraryComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-12">
      <!-- Navigation & Header -->
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="py-4">
            <ol class="flex items-center space-x-2 text-sm">
              <li>
                <button
                  (click)="navigateBack('online-evaluation')"
                  class="text-gray-500 hover:text-gray-700"
                >
                  Online Evaluation
                </button>
              </li>
              <li>
                <span class="material-icons text-gray-400 text-base"
                  >chevron_right</span
                >
              </li>
              <li>
                <button
                  (click)="navigateBack('assessment')"
                  class="text-gray-500 hover:text-gray-700"
                >
                  Assessment
                </button>
              </li>
              <li>
                <span class="material-icons text-gray-400 text-base"
                  >chevron_right</span
                >
              </li>
              <li class="text-gray-900 font-medium">{{ test.name }}</li>
            </ol>
          </nav>

          <!-- Header -->
          <div class="py-6 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">{{ test.name }}</h1>
            <div class="flex items-center space-x-4">
              <button
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span class="material-icons mr-2">content_copy</span>
                Copy Link
              </button>
              <button
                class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span class="material-icons mr-2">preview</span>
                Preview
              </button>
              <button (click)="onPublish()"
               class="flex items-center px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#43A047] transition-colors">

                <span class="material-icons mr-2">publish</span>
                Publish
              </button>
            </div>
          </div>

          <!-- Tabs -->
          <div class="flex space-x-8 -mb-px">
            <button
              *ngFor="let tab of tabs"
              (click)="activeTab = tab"
              [class]="getTabClass(tab)"
              class="py-4 px-1 text-sm font-medium border-b-2 transition-colors"
            >
              {{ tab }}
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="col-span-2 space-y-8">
            <!-- Overview Tab Content -->
            <ng-container *ngIf="activeTab === 'Overview'">
              <div
                *ngFor="let section of test.sections; let i = index"
                class="bg-white rounded-xl shadow-sm p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h2 class="text-lg font-semibold text-gray-800">
                      {{ section.title }}
                    </h2>
                    <p class="text-sm text-gray-500">
                      {{ section.questions.length }} questions
                    </p>
                  </div>
                  <div class="flex items-center gap-4">
                    <!-- <button 
                      (click)="deleteSection(i)"
                      class="text-red-500 hover:text-red-600">
                      <span class="material-icons">delete</span>
                    </button> -->
                  </div>
                </div>

                <!-- Question Summary -->
                <!-- <div class="space-y-3">
                  <div
                    class="flex justify-between text-sm text-gray-600 border-b pb-2"
                  >
                    <span>Question Type</span>
                    <span>Count</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">Multiple Choice</span>
                    <span
                      class="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {{ getQuestionTypeCount(section, "MCQ") }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">Programming</span>
                    <span
                      class="px-2 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                    >
                      {{ getQuestionTypeCount(section, "Programming") }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">Subjective</span>
                    <span
                      class="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                    >
                      {{ getQuestionTypeCount(section, "Subjective") }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-700">Full Stack</span>
                    <span
                      class="px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-sm"
                    >
                      {{ getQuestionTypeCount(section, "Full Stack") }}
                    </span>
                  </div>
                </div> -->

                <!-- Difficulty Distribution -->
                <div class="mt-6">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">
                    Difficulty Distribution
                  </h3>
                  <div class="flex gap-4">
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-green-500"></div>
                      <span class="text-sm text-gray-600"
                        >Basic ({{
                          getDifficultyCount(section, "Basic")
                        }})</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span class="text-sm text-gray-600"
                        >Intermediate ({{
                          getDifficultyCount(section, "Intermediate")
                        }})</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-3 h-3 rounded-full bg-red-500"></div>
                      <span class="text-sm text-gray-600"
                        >Advanced ({{
                          getDifficultyCount(section, "Advanced")
                        }})</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>

            <!-- Questions Tab Content -->
            <ng-container *ngIf="activeTab === 'Questions'">
              <!-- Question Sections -->
              <div
                *ngFor="let section of test.sections; let i = index"
                class="bg-white rounded-xl shadow-sm p-6"
                [class.opacity-50]="
                  draggedSectionIndex !== null && draggedSectionIndex !== i
                "
                [class.border-2]="draggedSectionIndex === i"
                [class.border-[#4CAF50]]="draggedSectionIndex === i"
                draggable="true"
                (dragstart)="onDragStart(i)"
                (dragend)="onDragEnd()"
                (dragover)="onDragOver($event, i)"
                (drop)="onDrop(i)"
              >
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center">
                    <span class="material-icons text-gray-400 cursor-move mr-2"
                      >drag_indicator</span
                    >
                    <div>
                      <h2 class="text-lg font-semibold text-gray-800">
                        {{ section.title }}
                      </h2>
                      <p class="text-sm text-gray-500">
                        {{ section.questions.length }} questions
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                      <span class="text-sm text-gray-600 mr-2"
                        >Min. random questions:</span
                      >
                      <select
                        [(ngModel)]="section.minRandomQuestions"
                        class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      >
                        <option [value]="0">00</option>
                        <option
                          *ngFor="let num of [1, 2, 3, 4, 5]"
                          [value]="num"
                        >
                          {{ num.toString().padStart(2, "0") }}
                        </option>
                      </select>
                    </div>
                    <button
                      (click)="openLibrary(i)"
                      class="text-[#4CAF50] hover:text-[#43A047] text-sm font-medium"
                    >
                      Choose from library
                    </button>
                    <button
                      class="text-[#4CAF50] hover:text-[#43A047] text-sm font-medium"
                    >
                      Create new question
                    </button>
                    <button
                      (click)="deleteSection(i)"
                      class="text-red-500 hover:text-red-600"
                    >
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                </div>

                <!-- Questions List -->
                <div class="space-y-4">
                  <div
                    *ngFor="
                      let question of section.questions;
                      let qIndex = index
                    "
                    class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <span
                            class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            {{ question.type || "Question" }}
                          </span>
                          <span
                            [class]="
                              getDifficultyClass(question.difficulty || 'Basic')
                            "
                          >
                            {{ question.difficulty || "Basic" }}
                          </span>
                          <span
                            class="px-2 py-0.5 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-xs"
                          >
                            Score: {{ question.score || 10 }}
                          </span>
                        </div>
                        <h3 class="font-medium text-gray-800 mb-1">
                          {{ question.title }}
                        </h3>
                        <p class="text-sm text-gray-600 line-clamp-2">
                          {{ question.description }}
                        </p>
                        <div class="flex flex-wrap gap-2 mt-2">
                          <span
                            *ngFor="let tag of question.tags"
                            class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2 ml-4">
                        <button class="p-1 text-gray-400 hover:text-gray-600">
                          <span class="material-icons">visibility</span>
                        </button>
                        <button
                          (click)="deleteQuestion(i, qIndex)"
                          class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <span class="material-icons">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add Section Button -->
              <button
                (click)="showCreateSectionModal = true"
                class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-colors flex items-center justify-center"
              >
                <span class="material-icons mr-2">add</span>
                Create New Section
              </button>
            </ng-container>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Test Details -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-6">
                Test Details
              </h2>

              <div class="space-y-4">
                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Assessment ID</span>
                  </div>
                  <div class="text-gray-900">{{ test.id }}</div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Test Name</span>
                    <button class="text-[#4CAF50]">
                      <span class="material-icons">edit</span>
                    </button>
                  </div>
                  <div class="text-gray-900">{{ test.name }}</div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Start Date & Time</span>
                    <button class="text-[#4CAF50]">
                      <span class="material-icons">edit</span>
                    </button>
                  </div>
                  <div class="text-gray-900">{{ test.startDate }}</div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Test Type</span>
                  </div>
                  <div class="text-gray-900">{{ test.type }}</div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Test Access</span>
                    <label
                      class="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        [(ngModel)]="test.isAccessEnabled"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4CAF50]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"
                      ></div>
                    </label>
                  </div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>End Date</span>
                    <button class="text-[#4CAF50]">
                      <span class="material-icons">edit</span>
                    </button>
                  </div>
                  <div class="text-gray-900">
                    {{ test.endDate || "Not set" }}
                  </div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Test Link</span>
                  </div>
                  <div class="text-gray-900 break-all">{{ test.testLink }}</div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Practice Test Link</span>
                  </div>
                  <div class="text-gray-500 break-all">
                    {{ test.practiceLink || "Not available" }}
                  </div>
                </div>

                <div>
                  <div
                    class="flex items-center justify-between text-sm text-gray-500 mb-1"
                  >
                    <span>Tags</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      *ngFor="let tag of test.tags"
                      class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-6">Settings</h2>
              <p class="text-sm text-gray-500 mb-6">
                These are recommended settings that you can edit for the test.
              </p>

              <!-- Cut-off Settings -->
              <div class="mb-6">
                <h3 class="font-medium text-gray-800 mb-2">Cut-off Settings</h3>
                <div class="text-sm text-gray-500">
                  Cut-off settings have not been set. Cut-off settings are
                  disabled.
                </div>
              </div>

              <!-- Proctoring Settings -->
              <div>
                <h3 class="font-medium text-gray-800 mb-4">
                  Proctoring Settings
                </h3>
                <label
                  class="flex items-center space-x-3 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    [(ngModel)]="test.settings.audioProctoring"
                    class="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]"
                  />
                  <span class="text-gray-700">Enable Audio Proctoring</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Section Modal -->
    <div
      *ngIf="showCreateSectionModal"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            Create New Section
          </h2>
          <button
            (click)="showCreateSectionModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Section Title -->
          <div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Section Title
  </label>
  <select
    [(ngModel)]="newSectionTitle"
    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
  >
    <option value="" disabled selected>Select a section title...</option>
    <option *ngFor="let title of predefinedSectionTitles" [value]="title">
      {{ title }}
    </option>
  </select>
</div>

          <!-- Section Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Section Type
            </label>
            <div class="grid grid-cols-2 gap-3">
              <div
                *ngFor="let type of sectionTypes"
                (click)="selectedSectionType = type"
                class="p-4 border rounded-lg text-left transition-colors cursor-pointer"
                [ngClass]="{
                  'border-[#4CAF50]': selectedSectionType === type,
                  'bg-[#4CAF50]/5': selectedSectionType === type,
                }"
              >
                <span class="block font-medium text-gray-800">{{ type }}</span>
                <span class="text-sm text-gray-500">{{
                  getSectionTypeDescription(type)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-8">
          <button
            (click)="showCreateSectionModal = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            (click)="createSection()"
            [disabled]="!canCreateSection"
            class="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#43A047] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Section
          </button>
        </div>
      </div>
    </div>

    <!-- Add Question Library Component -->
    <app-question-library
      #questionLibrary
      *ngIf="showLibrary"
      [existingQuestionIds]="getExistingQuestionIds()"
      (questionsSelected)="onQuestionsSelected($event)"
      (closed)="showLibrary = false"
    ></app-question-library>
  `,
})
export class TestPublishComponent implements OnInit {
  @ViewChild("questionLibrary") questionLibrary!: QuestionLibraryComponent;
  @Output() navigate = new EventEmitter<string>();

    constructor(private assessmentDataService: AssessmentDataService) {}
  
    
  tabs = ["Overview", "Questions"];
  activeTab = "Overview";
  showCreateSectionModal = false;
  predefinedSectionTitles: string[] = [
    "MCQ",
    "CODING",
    "SUBJECTIVE",
    "FULL STACK"
    ];
  newSectionTitle = "";
  selectedSectionType = "";
  draggedSectionIndex: number | null = null;
  showLibrary = false;
  currentSectionIndex: number = -1;
  sectionCounter: number = 1; // Initialize the counter


  sectionTypes = ["Add Questions Manually", "Select from Library"];

  test: TestPublishDetails = {
    id: "1234567890",
    name: "Salesforce Developer Test",
    startDate: "Feb 15th, 2025, 12:00 PM IST",
    endDate: "Feb 15th, 2025, 12:00 PM IST",
    type: "Invite Only",
    isAccessEnabled: true,
    testLink: "https://www.loremipsum.com/salesforce-developer-test-35",
    practiceLink: "https://www.loremipsum.com/practice-test-262576",
    tags: [".NET", "Asynchronous Programming"],
    sections: [],
    settings: {
      testDescription:
        "A Java backend development test covering Spring Boot and Microservices.",
      testInstruction:
        "Complete all sections within the given time. Use a stable internet connection.",
      enableAudioProctoring: false,
      enableSmartBrowser: true,
      idVerification: true,
      enableRandomQuestionShuffling: true,
      disableSubmissionResults: false,
      disableCopyPasteInCodeEditor: true,
      takeCandidateSnapshots: true,
      restrictFullScreenMode: true,
      logoutOnLeavingTest: true,
      restrictTestAccessForIP: false,
      emailReport: true,
      plagiarismReport: true,
      detailedAssessmentReport: true,
      slackReport: false,
      candidateSelfAssessmentReport: false,
      showQuestions: true,
      showCandidateAnswers: false,
      showCorrectAnswers: false,
      autoReminder: true,
      enableChatGPTInAssessments: false,
      audioProctoring: false,
      cutoffEnabled: false,
    },
    admins: [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      },
    ],
  };

  ngOnInit() {
    // Initialize component
    this. setDetails();
  }

  setDetails(): void {
    // Get the assessment data from the service
    const assessments = this.assessmentDataService.getAssessments();

    if (assessments.length > 0) {
      const assessment = assessments[0]; // Use the first assessment for simplicity

      // Map values from the assessment to the test object
      this.test.name = assessment.name;
      this.test.startDate = assessment.startDate;
      this.test.endDate = assessment.endDate;
      this.test.tags = assessment.tags;

      // Update other fields as needed
      this.test.settings.testDescription = `A ${assessment.jobRole} test covering ${assessment.skills.join(', ')}.`;
      this.test.settings.testInstruction = `Complete all sections within ${assessment.duration}. Use a stable internet connection.`;
    }
  }

  getTabClass(tab: string): string {
    return this.activeTab === tab
      ? "text-[#4CAF50] border-[#4CAF50]"
      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300";
  }

  getSectionTypeDescription(type: string): string {
    switch (type) {
      case "Add Questions Manually":
        return "Create and add new questions to this section";
      case "Select from Library":
        return "Choose existing questions from the question library";
      default:
        return "";
    }
  }

  getDifficultyClass(difficulty: string): string {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs ";
    switch (difficulty) {
      case "Basic":
        return baseClasses + "bg-green-50 text-green-600";
      case "Intermediate":
        return baseClasses + "bg-yellow-50 text-yellow-600";
      case "Advanced":
        return baseClasses + "bg-red-50 text-red-600";
      default:
        return baseClasses + "bg-gray-50 text-gray-600";
    }
  }

  getQuestionTypeCount(section: TestSection, type: string): number {
    return section.questions.filter((q) => q.type === type).length;
  }

  getDifficultyCount(section: TestSection, difficulty: string): number {
    return section.questions.filter((q) => q.difficulty === difficulty).length;
  }

  get canCreateSection(): boolean {
    return (
      this.newSectionTitle.trim() !== "" && this.selectedSectionType !== ""
    );
  }

  createSection() {
    if (this.canCreateSection) {
      const newSection: TestSection = {
        id: this.sectionCounter.toString(),
        title: this.newSectionTitle.trim(),
        minRandomQuestions: 0,
        questions: [],
      };

      this.test.sections.push(newSection);
      this.resetSectionModal();
    }
    this.sectionCounter++; // Increment the counter

  }

  resetSectionModal() {
    this.showCreateSectionModal = false;
    this.newSectionTitle = "";
    this.selectedSectionType = "";
  }

  deleteSection(index: number) {
    this.test.sections.splice(index, 1);
  }

  deleteQuestion(sectionIndex: number, questionIndex: number) {
    this.test.sections[sectionIndex].questions.splice(questionIndex, 1);
  }

  onDragStart(index: number) {
    this.draggedSectionIndex = index;
  }

  onDragEnd() {
    this.draggedSectionIndex = null;
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(index: number) {
    if (
      this.draggedSectionIndex !== null &&
      this.draggedSectionIndex !== index
    ) {
      const section = this.test.sections[this.draggedSectionIndex];
      this.test.sections.splice(this.draggedSectionIndex, 1);
      this.test.sections.splice(index, 0, section);
    }
    this.draggedSectionIndex = null;
  }

  openLibrary(sectionIndex: number) {
    this.currentSectionIndex = sectionIndex;
    this.showLibrary = true;
  }

  getExistingQuestionIds(): string[] {
    return this.test.sections.flatMap((section) =>
      section.questions.map((q) => q.id),
    );
  }

  onQuestionsSelected(questions: QuestionType[]) {
    if (this.currentSectionIndex >= 0) {
      // Convert QuestionType to TestQuestion
      const newQuestions = questions.map((q) => ({
        id: q.id.toString(),
        title: q.title,
        description: q.problemStatement,
        tags: [...q.tags, ...q.tags],
        type: q.tags[0],
        difficulty: q.difficultyLevel,
        score: q.maxScore,
      }));

      // Add questions to the current section
      this.test.sections[this.currentSectionIndex].questions.push(
        ...newQuestions,
      );
    }

    this.showLibrary = false;
    this.currentSectionIndex = -1;
  }

  navigateBack(page: string) {
    // console.log("Publish data in Component",this.test)
    // this.assessmentDataService.addTestPublishDetails(this.test);
    this.navigate.emit(page);
  }

  onPublish() {
  this.assessmentDataService.addTestPublishDetails(this.test);
  this.navigate.emit('assessment');
}
}
