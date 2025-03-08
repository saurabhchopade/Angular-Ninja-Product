import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ProgrammingQuestionService } from "../../services/programming-question.service";
import {
  ProgrammingQuestion,
  TestCase,
  CodeSnippet,
} from "../../types/programming-question.type";

@Component({
  selector: "app-create-programming-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div
      *ngIf="isVisible"
      class="fixed inset-0 bg-black/30 z-50 flex justify-end"
      (click)="close()"
    >
      <div
        class="w-full max-w-4xl bg-white shadow-2xl h-full transform transition-transform duration-300"
        [class.translate-x-0]="isVisible"
        [class.translate-x-full]="!isVisible"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-xl font-semibold text-gray-800">
            Create Programming Question
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
            <div class="flex items-center">
              <div [class]="getStepNumberClass(i)">
                {{ i + 1 }}
              </div>
              <span [class]="getStepTextClass(i)">{{ step }}</span>
            </div>
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

              <!-- Problem Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Problem Name</label
                >
                <input
                  type="text"
                  [(ngModel)]="question.title"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter problem name..."
                />
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

          <!-- Step 2: Solution & Test Cases -->
          <div *ngIf="currentStep === 1">
            <div class="space-y-6">
              <!-- Test Cases -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <label class="block text-sm font-medium text-gray-700"
                    >Test Cases</label
                  >
                  <button
                    (click)="addTestCase()"
                    class="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Test Case
                  </button>
                </div>
                <div class="space-y-4">
                  <div
                    *ngFor="let testCase of question.testCases; let i = index"
                    class="border rounded-lg p-4"
                  >
                    <div class="flex justify-between items-start mb-4">
                      <h4 class="font-medium">Test Case {{ i + 1 }}</h4>
                      <button
                        (click)="removeTestCase(i)"
                        class="text-red-500 hover:text-red-700"
                      >
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label class="block text-sm text-gray-600 mb-1"
                          >Input</label
                        >
                        <textarea
                          [(ngModel)]="testCase.inputData"
                          rows="3"
                          class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label class="block text-sm text-gray-600 mb-1"
                          >Output</label
                        >
                        <textarea
                          [(ngModel)]="testCase.expectedOutput"
                          rows="3"
                          class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                        ></textarea>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm text-gray-600 mb-1"
                          >Score Weight</label
                        >
                        <input
                          type="number"
                          [(ngModel)]="testCase.scoreWeight"
                          class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      <div>
                        <label class="block text-sm text-gray-600 mb-1"
                          >Visibility</label
                        >
                        <div class="flex items-center mt-2">
                          <input
                            type="checkbox"
                            [(ngModel)]="testCase.isPublic"
                            class="rounded text-green-500 focus:ring-green-500"
                          />
                          <span class="ml-2 text-sm text-gray-600"
                            >Visible to candidates</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Languages -->
          <div *ngIf="currentStep === 2">
            <div class="space-y-6">
              <!-- Language Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4"
                  >Allowed Languages</label
                >
                <div class="grid grid-cols-3 gap-3">
                  <button
                    *ngFor="let lang of availableLanguages"
                    (click)="toggleLanguage(lang)"
                    [class]="getLanguageButtonClass(lang)"
                  >
                    {{ lang.language }}
                  </button>
                </div>
              </div>

              <!-- Code Snippets -->
              <div class="mt-8">
                <label class="block text-sm font-medium text-gray-700 mb-4"
                  >Code Snippets</label
                >
                <div class="border rounded-lg overflow-hidden">
                  <!-- Language Tabs -->
                  <div class="flex border-b bg-gray-50">
                    <button
                      *ngFor="let template of question.templates"
                      (click)="setActiveSnippetLang(template.languageId)"
                      [class]="getSnippetTabClass(template.languageId)"
                      class="px-4 py-2 text-sm font-medium"
                    >
                      {{ getLanguageName(template.languageId) }}
                    </button>
                  </div>
                  <!-- Code Editor -->
                  <div class="p-4">
                    <textarea
                      *ngIf="activeSnippetLang"
                      [(ngModel)]="getCodeSnippet(activeSnippetLang).snippet"
                      rows="15"
                      class="w-full font-mono text-sm p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Editorial -->
          <div *ngIf="currentStep === 3">
            <div>
              <div
                class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <p class="text-blue-800 text-sm">
                  This section contains the approach to solve the question.
                  Candidates cannot view this section.
                </p>
              </div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Editorial</label
              >
              <textarea
                [(ngModel)]="question.editorial"
                rows="15"
                class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter the solution approach and explanation..."
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
              *ngIf="currentStep < 3"
              (click)="nextStep()"
              [disabled]="!canProceed"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              *ngIf="currentStep === 3"
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
  styles: [
    `
      .notification {
        min-width: 300px;
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow:
          0 4px 6px -1px rgb(0 0 0 / 0.1),
          0 2px 4px -2px rgb(0 0 0 / 0.1);
      }
      .notification.success {
        background-color: #22c55e;
        color: white;
        border-left: 4px solid #166534;
      }
      .notification.error {
        background-color: #ef4444;
        color: white;
        border-left: 4px solid #991b1b;
      }
      .notification.info {
        background-color: #3b82f6;
        color: white;
        border-left: 4px solid #1d4ed8;
      }
      .notification.warning {
        background-color: #eab308;
        color: white;
        border-left: 4px solid #b45309;
      }
      .animate-in {
        animation: slideIn 0.5s ease-out;
      }
      .animate-out {
        animation: slideOut 0.5s ease-out;
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(100%);
        }
      }
    `,
  ],
})
export class CreateProgrammingModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() published = new EventEmitter<ProgrammingQuestion>();
  @Output() drafted = new EventEmitter<ProgrammingQuestion>();

  isVisible = false;
  currentStep = 0;
  steps = ["Description", "Solution & Test Cases", "Languages", "Editorial"];
  difficultyLevels = ["Basic", "Intermediate", "Advanced"];
  newTag = "";
  activeSnippetLang = "";

  availableLanguages = [
    { language: "Python 3", languageId: "71" },
    { language: "Java", languageId: "62" },
  ];

  question: ProgrammingQuestion = {
    id: null,
    type: "CODING",
    title: "",
    problemStatement: "",
    difficultyLevel: "Advanced",
    maxScore: 10,
    negativeScore: 0,
    isDraft: false,
    timeLimit: 2,
    memoryLimit: 256,
    timeBoundSeconds: 60,
    tags: [],
    solutionTemplate: "",
    editorial: "",
    ai_evaluation_enabled: true,
    visibility: "PUBLIC",
    templates: [],
    testCases: [],
  };

  constructor(private programmingQuestionService: ProgrammingQuestionService) {}

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
      id: null,
      type: "CODING",
      title: "",
      problemStatement: "",
      difficultyLevel: "Basic",
      maxScore: 10,
      negativeScore: 0,
      isDraft: false,
      timeLimit: 2,
      memoryLimit: 256,
      timeBoundSeconds: 60,
      tags: [],
      solutionTemplate: "",
      editorial: "",
      ai_evaluation_enabled: true,
      visibility: "PUBLIC",
      templates: [],
      testCases: [],
    };
    this.newTag = "";
    this.activeSnippetLang = "";
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

  addTestCase() {
    this.question.testCases.push({
      inputData: "",
      expectedOutput: "",
      scoreWeight: 1,
      isSample: false,
      timeLimitOverride: 2,
      memoryLimitOverride: 128,
      isPublic: true,
    });
  }

  removeTestCase(index: number) {
    this.question.testCases.splice(index, 1);
  }

  toggleLanguage(lang: { language: string; languageId: string }) {
    const index = this.question.templates.findIndex(
      (t) => t.languageId === lang.languageId,
    );
    if (index === -1) {
      this.question.templates.push({
        languageId: lang.languageId,
        snippet: this.getDefaultSnippet(lang.language),
      });
      if (!this.activeSnippetLang) {
        this.activeSnippetLang = lang.languageId;
      }
    } else {
      this.question.templates.splice(index, 1);
      if (this.activeSnippetLang === lang.languageId) {
        this.activeSnippetLang = this.question.templates[0]?.languageId || "";
      }
    }
  }

  getLanguageButtonClass(lang: {
    language: string;
    languageId: string;
  }): string {
    const isSelected = this.question.templates.some(
      (t) => t.languageId === lang.languageId,
    );
    return `px-4 py-2 rounded-lg border ${
      isSelected
        ? "border-green-500 bg-green-50 text-green-700"
        : "border-gray-300 hover:border-green-500 hover:bg-green-50"
    } transition-colors`;
  }

  setActiveSnippetLang(languageId: string) {
    this.activeSnippetLang = languageId;
  }

  getSnippetTabClass(languageId: string): string {
    return this.activeSnippetLang === languageId
      ? "border-b-2 border-green-500 text-green-700"
      : "text-gray-500 hover:text-gray-700";
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

  getLanguageName(languageId: string): string {
    const language = this.availableLanguages.find(
      (lang) => lang.languageId === languageId,
    );
    return language ? language.language : "Unknown";
  }

  getStepTextClass(index: number): string {
    const baseClasses = "ml-2 text-sm font-medium ";
    if (this.currentStep >= index) {
      return baseClasses + "text-gray-900";
    }
    return baseClasses + "text-gray-500";
  }
  getCodeSnippet(languageId: string): CodeSnippet {
    let snippet = this.question.templates.find(
      (t) => t.languageId === languageId,
    );
    if (!snippet) {
      snippet = {
        languageId,
        snippet: this.getDefaultSnippet(
          this.availableLanguages.find((l) => l.languageId === languageId)
            ?.language || "",
        ),
      };
      this.question.templates.push(snippet);
    }
    return snippet;
  }

  getDefaultSnippet(language: string): string {
    switch (language) {
      case "Python 3":
        return "def solution():\n    # Write your code here\n    pass";
      case "Java":
        return "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}";
      default:
        return "// Write your solution here";
    }
  }

  get canProceed(): boolean {
    switch (this.currentStep) {
      case 0:
        return (
          this.question.title.trim() !== "" &&
          this.question.problemStatement.trim() !== "" &&
          this.question.maxScore > 0
        );
      case 1:
        return (
          this.question.testCases.length > 0 &&
          this.question.testCases.every(
            (tc) =>
              tc.inputData.trim() !== "" && tc.expectedOutput.trim() !== "",
          )
        );
      case 2:
        return this.question.templates.length > 0;
      default:
        return true;
    }
  }

  get isComplete(): boolean {
    return (
      this.question.title.trim() !== "" &&
      this.question.problemStatement.trim() !== "" &&
      this.question.maxScore > 0 &&
      this.question.testCases.length > 0 &&
      this.question.templates.length > 0 &&
      this.question.editorial.trim() !== ""
    );
  }

  nextStep() {
    if (this.currentStep < 3 && this.canProceed) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  saveDraft() {
    this.question.isDraft = true;
    this.programmingQuestionService.createQuestion(this.question).subscribe({
      next: (response) => {
        console.log("Draft saved successfully", response);
        this.drafted.emit({ ...this.question });
      },
      error: (error) => {
        console.error("Error saving draft", error);
      },
    });
  }

  publish() {
    if (this.isComplete) {
      this.question.isDraft = false;
      this.programmingQuestionService.createQuestion(this.question).subscribe({
        next: (response) => {
          this.published.emit({ ...this.question });
          this.close();
          alert("Question Got Published");
          console.log("Question published successfully", response);
        },
        error: (error) => {
          alert("Question is not getting publish: Check with administrator");
          console.error("Error publishing question", error);
        },
      });
    }
  }
}
