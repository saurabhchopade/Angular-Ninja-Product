import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  FullStackQuestion,
  Framework,
  ProjectSetup,
} from "../../types/fullstack-question.type";

@Component({
  selector: "app-create-fullstack-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
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
            Create Full Stack Question
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
                      [(ngModel)]="question.difficulty"
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
                <div class="border rounded-lg">
                  <!-- Rich Text Toolbar -->
                  <div class="flex items-center gap-1 p-2 border-b bg-gray-50">
                    <button
                      *ngFor="let tool of editorTools"
                      class="p-1.5 rounded hover:bg-gray-200 transition-colors"
                      [title]="tool.label"
                    >
                      <span class="material-icons text-gray-600 text-lg">{{
                        tool.icon
                      }}</span>
                    </button>
                  </div>
                  <!-- Editor Area -->
                  <textarea
                    [(ngModel)]="question.problemStatement"
                    rows="8"
                    class="w-full p-3 focus:outline-none"
                    placeholder="Enter the problem statement..."
                  ></textarea>
                </div>
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

          <!-- Step 2: Framework Selection -->
          <div *ngIf="currentStep === 1">
            <div class="space-y-8">
              <!-- Frontend Frameworks -->
              <div>
                <h3 class="text-lg font-medium text-gray-800 mb-4">
                  Frontend Framework
                </h3>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    *ngFor="let framework of availableFrontendFrameworks"
                    (click)="selectFrontendFramework(framework)"
                    class="p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                    [class.border-green-500]="isSelectedFrontend(framework)"
                    [class.bg-green-50]="isSelectedFrontend(framework)"
                  >
                    <div class="font-medium">{{ framework.name }}</div>
                    <div class="text-sm text-gray-500">
                      v{{ framework.version }}
                    </div>
                  </button>
                  <!-- Custom Framework Option -->
                  <button
                    (click)="toggleCustomFrontend()"
                    class="p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                    [class.border-green-500]="showCustomFrontend"
                    [class.bg-green-50]="showCustomFrontend"
                  >
                    <div class="font-medium">Custom Framework</div>
                    <div class="text-sm text-gray-500">Specify your own</div>
                  </button>
                </div>
                <!-- Custom Framework Input -->
                <div *ngIf="showCustomFrontend" class="mt-4 space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Framework Name</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="customFrontend.name"
                      class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter framework name..."
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Version</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="customFrontend.version"
                      class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter version..."
                    />
                  </div>
                  <button
                    (click)="addCustomFrontend()"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Framework
                  </button>
                </div>
              </div>

              <!-- Backend Frameworks -->
              <div>
                <h3 class="text-lg font-medium text-gray-800 mb-4">
                  Backend Framework
                </h3>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    *ngFor="let framework of availableBackendFrameworks"
                    (click)="selectBackendFramework(framework)"
                    class="p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                    [class.border-green-500]="isSelectedBackend(framework)"
                    [class.bg-green-50]="isSelectedBackend(framework)"
                  >
                    <div class="font-medium">{{ framework.name }}</div>
                    <div class="text-sm text-gray-500">
                      v{{ framework.version }}
                    </div>
                  </button>
                  <!-- Custom Framework Option -->
                  <button
                    (click)="toggleCustomBackend()"
                    class="p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                    [class.border-green-500]="showCustomBackend"
                    [class.bg-green-50]="showCustomBackend"
                  >
                    <div class="font-medium">Custom Framework</div>
                    <div class="text-sm text-gray-500">Specify your own</div>
                  </button>
                </div>
                <!-- Custom Framework Input -->
                <div *ngIf="showCustomBackend" class="mt-4 space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Framework Name</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="customBackend.name"
                      class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter framework name..."
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Version</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="customBackend.version"
                      class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter version..."
                    />
                  </div>
                  <button
                    (click)="addCustomBackend()"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Framework
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Project Setup -->
          <div *ngIf="currentStep === 2">
            <div class="space-y-6">
              <div class="grid grid-cols-3 gap-4">
                <!-- Upload ZIP -->
                <button
                  (click)="selectProjectType('zip')"
                  class="p-6 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
                  [class.border-green-500]="
                    question.projectSetup.type === 'zip'
                  "
                  [class.bg-green-50]="question.projectSetup.type === 'zip'"
                >
                  <span class="material-icons text-4xl mb-2 text-gray-600"
                    >folder_zip</span
                  >
                  <div class="font-medium">Upload ZIP</div>
                  <p class="text-sm text-gray-500 mt-1">
                    Upload your project files
                  </p>
                </button>

                <!-- GitHub URL -->
                <button
                  (click)="selectProjectType('github')"
                  class="p-6 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
                  [class.border-green-500]="
                    question.projectSetup.type === 'github'
                  "
                  [class.bg-green-50]="question.projectSetup.type === 'github'"
                >
                  <span class="material-icons text-4xl mb-2 text-gray-600"
                    >code</span
                  >
                  <div class="font-medium">GitHub URL</div>
                  <p class="text-sm text-gray-500 mt-1">Import from GitHub</p>
                </button>

                <!-- Sample Project -->
                <button
                  (click)="selectProjectType('sample')"
                  class="p-6 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
                  [class.border-green-500]="
                    question.projectSetup.type === 'sample'
                  "
                  [class.bg-green-50]="question.projectSetup.type === 'sample'"
                >
                  <span class="material-icons text-4xl mb-2 text-gray-600"
                    >description</span
                  >
                  <div class="font-medium">Sample Project</div>
                  <p class="text-sm text-gray-500 mt-1">Use a template</p>
                </button>
              </div>

              <!-- Project URL Input -->
              <div *ngIf="question.projectSetup.type === 'github'">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >GitHub Repository URL</label
                >
                <input
                  type="text"
                  [(ngModel)]="question.projectSetup.url"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://github.com/username/repository"
                />
              </div>

              <!-- ZIP File Upload -->
              <div
                *ngIf="question.projectSetup.type === 'zip'"
                class="border-2 border-dashed rounded-lg p-8 text-center"
              >
                <span class="material-icons text-4xl text-gray-400 mb-2"
                  >upload_file</span
                >
                <p class="text-gray-600">
                  Drag and drop your project ZIP file here, or click to browse
                </p>
                <input type="file" class="hidden" accept=".zip" />
              </div>

              <!-- Sample Project Selection -->
              <div
                *ngIf="question.projectSetup.type === 'sample'"
                class="space-y-4"
              >
                <h3 class="text-lg font-medium text-gray-800">
                  Choose a Sample Project
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    *ngFor="let sample of sampleProjects"
                    class="p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                  >
                    <div class="font-medium">{{ sample.name }}</div>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ sample.description }}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center"
        >
          <button
            (click)="saveDraft()"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Save as Draft
          </button>
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
export class CreateFullStackModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() published = new EventEmitter<FullStackQuestion>();
  @Output() drafted = new EventEmitter<FullStackQuestion>();

  isVisible = false;
  currentStep = 0;
  steps = ["Description", "Framework Selection", "Project Setup"];
  difficultyLevels = ["Basic", "Intermediate", "Advanced"];
  newTag = "";
  showCustomFrontend = false;
  showCustomBackend = false;

  editorTools = [
    { icon: "format_bold", label: "Bold" },
    { icon: "format_italic", label: "Italic" },
    { icon: "format_underlined", label: "Underline" },
    { icon: "format_list_bulleted", label: "Bullet List" },
    { icon: "format_list_numbered", label: "Numbered List" },
    { icon: "code", label: "Code Block" },
  ];

  availableFrontendFrameworks: Framework[] = [
    { name: "React", version: "18.2.0", isCustom: false },
    { name: "Angular", version: "19.0.0", isCustom: false },
    { name: "Vue", version: "3.4.0", isCustom: false },
    { name: "Svelte", version: "4.2.0", isCustom: false },
  ];

  availableBackendFrameworks: Framework[] = [
    { name: "Node.js/Express", version: "4.18.0", isCustom: false },
    { name: "Spring Boot", version: "3.2.0", isCustom: false },
    { name: "Django", version: "5.0.0", isCustom: false },
    { name: "Flask", version: "3.0.0", isCustom: false },
  ];

  sampleProjects = [
    {
      name: "E-commerce Platform",
      description:
        "A basic e-commerce setup with product listing and cart functionality",
    },
    {
      name: "Task Management",
      description: "Project management tool with task creation and assignment",
    },
    {
      name: "Blog Platform",
      description: "Simple blogging platform with posts and comments",
    },
    {
      name: "Chat Application",
      description: "Real-time chat application with websocket integration",
    },
  ];

  customFrontend: Framework = {
    name: "",
    version: "",
    isCustom: true,
  };

  customBackend: Framework = {
    name: "",
    version: "",
    isCustom: true,
  };

  question: FullStackQuestion = {
    difficulty: "Basic",
    title: "",
    problemStatement: "",
    maxScore: 100,
    tags: [],
    frontendFrameworks: [],
    backendFrameworks: [],
    projectSetup: {
      type: "sample",
      frontendFramework: this.availableFrontendFrameworks[0],
      backendFramework: this.availableBackendFrameworks[0],
    },
  };

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
      difficulty: "Basic",
      title: "",
      problemStatement: "",
      maxScore: 100,
      tags: [],
      frontendFrameworks: [],
      backendFrameworks: [],
      projectSetup: {
        type: "sample",
        frontendFramework: this.availableFrontendFrameworks[0],
        backendFramework: this.availableBackendFrameworks[0],
      },
    };
    this.newTag = "";
    this.showCustomFrontend = false;
    this.showCustomBackend = false;
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

  selectFrontendFramework(framework: Framework) {
    this.question.projectSetup.frontendFramework = framework;
    this.showCustomFrontend = false;
  }

  selectBackendFramework(framework: Framework) {
    this.question.projectSetup.backendFramework = framework;
    this.showCustomBackend = false;
  }

  isSelectedFrontend(framework: Framework): boolean {
    return this.question.projectSetup.frontendFramework.name === framework.name;
  }

  isSelectedBackend(framework: Framework): boolean {
    return this.question.projectSetup.backendFramework.name === framework.name;
  }

  toggleCustomFrontend() {
    this.showCustomFrontend = !this.showCustomFrontend;
    if (this.showCustomFrontend) {
      this.customFrontend = { name: "", version: "", isCustom: true };
    }
  }

  toggleCustomBackend() {
    this.showCustomBackend = !this.showCustomBackend;
    if (this.showCustomBackend) {
      this.customBackend = { name: "", version: "", isCustom: true };
    }
  }

  addCustomFrontend() {
    if (this.customFrontend.name && this.customFrontend.version) {
      this.question.projectSetup.frontendFramework = { ...this.customFrontend };
      this.showCustomFrontend = false;
    }
  }

  addCustomBackend() {
    if (this.customBackend.name && this.customBackend.version) {
      this.question.projectSetup.backendFramework = { ...this.customBackend };
      this.showCustomBackend = false;
    }
  }

  selectProjectType(type: "zip" | "github" | "sample") {
    this.question.projectSetup.type = type;
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
    switch (this.currentStep) {
      case 0:
        return (
          this.question.title.trim() !== "" &&
          this.question.problemStatement.trim() !== "" &&
          this.question.maxScore > 0
        );
      case 1:
        return (
          this.question.projectSetup.frontendFramework !== null &&
          this.question.projectSetup.backendFramework !== null
        );
      default:
        return true;
    }
  }

  get isComplete(): boolean {
    return (
      this.question.title.trim() !== "" &&
      this.question.problemStatement.trim() !== "" &&
      this.question.maxScore > 0 &&
      this.question.projectSetup.frontendFramework !== null &&
      this.question.projectSetup.backendFramework !== null &&
      ((this.question.projectSetup.type === "github" &&
        this.question.projectSetup.url?.trim() !== "") ||
        this.question.projectSetup.type === "sample" ||
        this.question.projectSetup.type === "zip")
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

  saveDraft() {
    this.drafted.emit({ ...this.question });
  }

  publish() {
    if (this.isComplete) {
      this.published.emit({ ...this.question });
      this.close();
    }
  }
}
