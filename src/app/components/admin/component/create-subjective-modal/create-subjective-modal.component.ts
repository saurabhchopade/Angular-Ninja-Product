import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SubjectiveQuestionService } from "../../services/create.subjective.service";
import { SubjectiveQuestion } from "../../types/subjective.question";

@Component({
  selector: "app-create-subjective-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div
      *ngIf="isVisible"
      class="fixed inset-0 bg-black/30 z-50 flex justify-end"
      (click)="close()"
    >
      <div
        class="w-full max-w-3xl bg-white shadow-2xl h-full transform transition-transform duration-300"
        [class.translate-x-0]="isVisible"
        [class.translate-x-full]="!isVisible"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-xl font-semibold text-gray-800">
            Create Subjective Question
          </h2>
          <button
            (click)="close()"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Step Navigation -->
        <div class="flex items-center px-6 py-4 border-b bg-gray-50">
          <div
            *ngFor="let step of steps; let i = index"
            class="flex items-center"
          >
            <div [class]="getStepNumberClass(i)">{{ i + 1 }}</div>
            <span [class]="getStepTextClass(i)">{{ step }}</span>
            <div
              *ngIf="i < steps.length - 1"
              class="w-16 h-px mx-2"
              [class.bg-green-500]="currentStep > i"
              [class.bg-gray-300]="currentStep <= i"
            ></div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6 h-[calc(100%-200px)] overflow-y-auto">
          <!-- Step 1: Description -->
          <div *ngIf="currentStep === 0">
            <div class="space-y-6">
              <!-- Difficulty Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Difficulty Level</label
                >
                <div class="flex gap-4">
                  <label
                    *ngFor="let level of difficultyLevels"
                    class="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      [value]="level"
                      [(ngModel)]="question.difficultyLevel"
                      class="text-green-500 focus:ring-green-500"
                    />
                    <span>{{ level }}</span>
                  </label>
                </div>
              </div>

              <!-- Problem Statement -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Problem Statement</label
                >
                <textarea
                  [(ngModel)]="question.problemStatement"
                  rows="6"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter the problem statement..."
                ></textarea>
              </div>

              <!-- Maximum Score -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Maximum Score</label
                >
                <input
                  type="number"
                  [(ngModel)]="question.maxScore"
                  class="w-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Tags</label
                >
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    *ngFor="let tag of question.tags; let i = index"
                    class="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center"
                  >
                    {{ tag }}
                    <button
                      (click)="removeTag(i)"
                      class="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <span class="material-icons text-sm">close</span>
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    [(ngModel)]="newTag"
                    (keyup.enter)="addTag()"
                    class="rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add a tag..."
                  />
                  <button
                    (click)="addTag()"
                    class="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Evaluation -->
          <div *ngIf="currentStep === 1">
            <div class="space-y-6">
              <!-- Must Include Keywords -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Must Include Keywords</label
                >
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    *ngFor="let keyword of question.mustInclude; let i = index"
                    class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center"
                  >
                    {{ keyword }}
                    <button
                      (click)="removeMustInclude(i)"
                      class="ml-1 text-green-600 hover:text-green-800"
                    >
                      <span class="material-icons text-sm">close</span>
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    [(ngModel)]="newMustInclude"
                    (keyup.enter)="addMustInclude()"
                    class="rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add required keyword..."
                  />
                  <button
                    (click)="addMustInclude()"
                    class="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <!-- Optional Keywords -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Optional Keywords</label
                >
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    *ngFor="let keyword of question.optional; let i = index"
                    class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                  >
                    {{ keyword }}
                    <button
                      (click)="removeOptional(i)"
                      class="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <span class="material-icons text-sm">close</span>
                    </button>
                  </span>
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    [(ngModel)]="newOptional"
                    (keyup.enter)="addOptional()"
                    class="rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add optional keyword..."
                  />
                  <button
                    (click)="addOptional()"
                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Evaluation Criteria For AI</label
                >
                <textarea
                  [(ngModel)]="question.evaluationCriteria"
                  rows="10"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter evaluation criteria..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Step 3: Solution Template -->
          <div *ngIf="currentStep === 2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Solution Template</label
              >
              <textarea
                [(ngModel)]="question.sampleAnswer"
                rows="10"
                class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter solution template..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center"
        >
          <div>
            <button
              (click)="saveDraft()"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mr-2"
            >
              Save as Draft
            </button>
          </div>
          <div class="flex gap-2">
            <button
              *ngIf="currentStep > 0"
              (click)="previousStep()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              *ngIf="currentStep < 2"
              (click)="nextStep()"
              [disabled]="!canProceed"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              *ngIf="currentStep === 2"
              (click)="publish()"
              [disabled]="!isComplete"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreateSubjectiveModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() published = new EventEmitter<SubjectiveQuestion>();
  @Output() drafted = new EventEmitter<SubjectiveQuestion>();

  isVisible = false;
  currentStep = 0;
  steps = ["Description", "Evaluation", "Solution Template"];
  difficultyLevels = ["Basic", "Intermediate", "Advanced"];
  newTag = "";
  newMustInclude = "";
  newOptional = "";

  question: SubjectiveQuestion = {
    type: "SUBJECTIVE",
    title: "Subjective Question",
    problemStatement:
      "Explain the advantages and disadvantages of using Microservices architecture in a large-scale application. Provide real-world examples to support your answer",
    difficultyLevel: "Intermediate",
    maxScore: 10,
    tags: ["Architecture", "Microservices", "Design Patterns"],
    visibility: "PUBLIC",
    createdBy: "user_789",
    aiEvaluationEnabled: true,
    evaluationMode: "AUTO_KEYWORD",
    mustInclude: ["List", "Map", "Set"],
    optional: ["ArrayList", "HashMap", "HashSet"],
    negativeKeywords: ["stream", "ArrayDeque"],
    scoringWeights: {
      mustInclude: 10,
      optional: 5,
      negativeKeywords: -2,
    },
    expectedResponseFormat: "text",
    minWords: 20,
    maxWords: 100,
    sampleAnswer: "Collections used to store different data in Java",
    evaluationCriteria: "assess based on question readiblity and all",
  };

  constructor(private questionService: SubjectiveQuestionService) {}

  show() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.closed.emit();
    this.resetForm();
  }

  resetForm() {
    this.currentStep = 0;
    this.question = {
      type: "SUBJECTIVE",
      title: "Explain SQL Query",
      problemStatement: "Write create, update, delete queries",
      difficultyLevel: "Basic",
      maxScore: 10,
      tags: ["Architecture", "Microservices", "Design Patterns"],
      visibility: "PUBLIC",
      createdBy: "user_789",
      aiEvaluationEnabled: true,
      evaluationMode: "AUTO_KEYWORD",
      mustInclude: ["List", "Map", "Set"],
      optional: ["ArrayList", "HashMap", "HashSet"],
      negativeKeywords: ["stream", "ArrayDeque"],
      scoringWeights: {
        mustInclude: 10,
        optional: 5,
        negativeKeywords: -2,
      },
      expectedResponseFormat: "text",
      minWords: 20,
      maxWords: 100,
      sampleAnswer: "Collections used to store different data in Java",
      evaluationCriteria: "assess based on question and all",
    };
    this.newTag = "";
  }

  addTag() {
    if (
      this.newTag.trim() &&
      !this.question.tags.includes(this.newTag.trim())
    ) {
      this.question.tags.push(this.newTag.trim());
      this.newTag = "";
    }
  }

  removeTag(index: number) {
    this.question.tags.splice(index, 1);
  }

  getStepNumberClass(index: number): string {
    const baseClasses =
      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ";
    if (this.currentStep > index) {
      return baseClasses + "bg-green-500 text-white";
    }
    if (this.currentStep === index) {
      return baseClasses + "bg-green-500 text-white";
    }
    return baseClasses + "bg-gray-200 text-gray-500";
  }

  getStepTextClass(index: number): string {
    const baseClasses = "ml-2 text-sm font-medium ";
    if (this.currentStep >= index) {
      return baseClasses + "text-gray-900";
    }
    return baseClasses + "text-gray-500";
  }

  get canProceed(): boolean {
    if (this.currentStep === 0) {
      return (
        this.question.problemStatement.trim() !== "" &&
        this.question.maxScore > 0
      );
    }
    if (this.currentStep === 1) {
      return this.question.evaluationCriteria.trim() !== "";
    }
    return true;
  }

  get isComplete(): boolean {
    return (
      this.question.problemStatement.trim() !== "" &&
      this.question.maxScore > 0 &&
      this.question.evaluationCriteria.trim() !== "" &&
      this.question.sampleAnswer.trim() !== ""
    );
  }

  nextStep() {
    if (this.currentStep < 2 && this.canProceed) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  addMustInclude() {
    if (
      this.newMustInclude.trim() &&
      !this.question.mustInclude.includes(this.newMustInclude.trim())
    ) {
      this.question.mustInclude.push(this.newMustInclude.trim());
      this.newMustInclude = "";
    }
  }

  removeMustInclude(index: number) {
    this.question.mustInclude.splice(index, 1);
  }

  addOptional() {
    if (
      this.newOptional.trim() &&
      !this.question.optional.includes(this.newOptional.trim())
    ) {
      this.question.optional.push(this.newOptional.trim());
      this.newOptional = "";
    }
  }

  removeOptional(index: number) {
    this.question.optional.splice(index, 1);
  }

  saveDraft() {
    this.drafted.emit({ ...this.question });
    this.close();
  }

  publish() {
    if (this.isComplete) {
      this.questionService.createSubjectiveQuestion(this.question).subscribe(
        (response) => {
          console.log("Question published successfully", response);
          this.published.emit({ ...this.question });
          this.close();
        },
        (error) => {
          console.error("Error publishing question", error);
        },
      );
    }
  }
}

export { SubjectiveQuestion };
