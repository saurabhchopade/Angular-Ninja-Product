import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AssessmentDataService } from "../../services/assessment.data.service";

export interface JobRole {
  id: string;
  title: string;
  skills: string[];
}

export interface Assessment {
  name: string;
  jobRole: string;
  skills: string[];
  experienceLevel: string;
  duration: string;
  startDate: string;
  endDate: string;
  tags: string[];
  isAutomatic: boolean;
}

@Component({
  selector: "app-create-assessment-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Create a test</h2>
            <p class="text-sm text-gray-500 mt-1">{{ getStepSubtitle() }}</p>
          </div>
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
              [class.bg-blue-500]="currentStep > i"
              [class.bg-gray-300]="currentStep <= i"
            ></div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6 h-[calc(100%-200px)] overflow-y-auto">
          <!-- Step 1: Job Role -->
          <div *ngIf="currentStep === 0">
            <div class="space-y-6">
              <!-- Role Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Select Job Role</label
                >
                <div class="relative">
                  <span
                    class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >search</span
                  >
                  <input
                    type="text"
                    [(ngModel)]="assessment.jobRole"
                    class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search job roles..."
                  />
                </div>
              </div>

              <!-- Popular Roles -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Popular Roles</label
                >
                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let role of popularRoles"
                    (click)="selectRole(role)"
                    class="px-3 py-1.5 rounded-full text-sm border transition-colors"
                    [class.border-blue-500]="assessment.jobRole === role.title"
                    [class.text-blue-700]="assessment.jobRole === role.title"
                    [class.border-gray-200]="assessment.jobRole !== role.title"
                    [class.text-gray-700]="assessment.jobRole !== role.title"
                  >
                    {{ role.title }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Skill Selection -->
          <div *ngIf="currentStep === 1">
            <div class="space-y-6">
              <!-- Selection Method -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4"
                  >How would you like to add questions?</label
                >
                <div class="space-y-3">
                  <label
                    class="flex items-center p-4 border rounded-lg cursor-pointer"
                    [class.border-blue-500]="assessment.isAutomatic"
                    [class.bg-blue-50]="assessment.isAutomatic"
                  >
                    <input
                      type="radio"
                      [value]="true"
                      [(ngModel)]="assessment.isAutomatic"
                      class="text-blue-500 focus:ring-blue-500"
                    />
                    <span class="ml-3">
                      <span class="block font-medium text-gray-800"
                        >Automatically</span
                      >
                      <span class="text-sm text-gray-500"
                        >AI-powered question selection based on skills</span
                      >
                    </span>
                  </label>

                  <label
                    class="flex items-center p-4 border rounded-lg cursor-pointer"
                    [class.border-blue-500]="!assessment.isAutomatic"
                    [class.bg-blue-50]="!assessment.isAutomatic"
                  >
                    <input
                      type="radio"
                      [value]="false"
                      [(ngModel)]="assessment.isAutomatic"
                      class="text-blue-500 focus:ring-blue-500"
                    />
                    <span class="ml-3">
                      <span class="block font-medium text-gray-800"
                        >Manual</span
                      >
                      <span class="text-sm text-gray-500"
                        >Select questions yourself</span
                      >
                    </span>
                  </label>
                </div>
              </div>

              <!-- Recommended Skills -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <label class="block text-sm font-medium text-gray-700"
                    >Recommended Skills</label
                  >
                  <button
                    class="text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1"
                  >
                    <span class="material-icons text-base">upload_file</span>
                    Import from JD
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let skill of recommendedSkills"
                    (click)="toggleSkill(skill)"
                    class="px-3 py-1.5 rounded-full text-sm border transition-colors"
                    [class.border-blue-500]="isSkillSelected(skill)"
                    [class.text-blue-700]="isSkillSelected(skill)"
                    [class.bg-blue-50]="isSkillSelected(skill)"
                    [class.border-gray-200]="!isSkillSelected(skill)"
                    [class.text-gray-700]="!isSkillSelected(skill)"
                  >
                    {{ skill }}
                  </button>
                  <button
                    (click)="showSkillInput = true"
                    class="px-3 py-1.5 rounded-full text-sm border border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    <span class="material-icons text-base">add</span>
                    Add Skill
                  </button>
                </div>
                <div *ngIf="showSkillInput" class="mt-3 flex gap-2">
                  <input
                    type="text"
                    [(ngModel)]="newSkill"
                    (keyup.enter)="addSkill()"
                    class="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter skill name"
                  />
                  <button
                    (click)="addSkill()"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Experience & Duration -->
          <div *ngIf="currentStep === 2">
            <div class="space-y-6">
              <!-- Test Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Test Name</label
                >
                <input
                  type="text"
                  [(ngModel)]="assessment.name"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [placeholder]="assessment.jobRole || 'Enter test name'"
                />
              </div>

              <!-- Experience Level -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4"
                  >Experience Level</label
                >
                <div class="grid grid-cols-2 gap-3">
                  <button
                    *ngFor="let level of experienceLevels"
                    (click)="selectExperience(level)"
                    class="p-4 border rounded-lg text-left transition-colors"
                    [class.border-blue-500]="
                      assessment.experienceLevel === level
                    "
                    [class.bg-blue-50]="assessment.experienceLevel === level"
                  >
                    <span class="block font-medium text-gray-800">{{
                      level
                    }}</span>
                    <span class="text-sm text-gray-500">{{
                      getExperienceDescription(level)
                    }}</span>
                  </button>
                </div>
              </div>

              <!-- Test Schedule -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4"
                  >Test Schedule</label
                >
                <div class="grid grid-cols-2 gap-4">
                  <!-- Start Date & Time -->
                  <div>
                    <label class="block text-sm text-gray-600 mb-2"
                      >Start Date & Time</label
                    >
                    <input
                      type="datetime-local"
                      [(ngModel)]="assessment.startDate"
                      class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [min]="getCurrentDateTime()"
                    />
                  </div>

                  <!-- End Date & Time -->
                  <div>
                    <label class="block text-sm text-gray-600 mb-2"
                      >End Date & Time</label
                    >
                    <input
                      type="datetime-local"
                      [(ngModel)]="assessment.endDate"
                      class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [min]="assessment.startDate || getCurrentDateTime()"
                    />
                  </div>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                  Candidates can take the test anytime between the start and end
                  date within the specified duration.
                </p>
              </div>

              <!-- Test Duration -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Test Duration</label
                >
                <select
                  [(ngModel)]="assessment.duration"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="90">1 Hour 30 Minutes</option>
                  <option value="120">2 Hours</option>
                  <option value="180">3 Hours</option>
                </select>
                <p class="text-sm text-gray-500 mt-2">
                  Once started, candidates must complete the test within this
                  duration.
                </p>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Tags</label
                >
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    *ngFor="let tag of assessment.tags; let i = index"
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
                    class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag..."
                  />
                  <button
                    (click)="addTag()"
                    class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Review -->
          <div *ngIf="currentStep === 3">
            <div class="space-y-6">
              <div
                *ngFor="let section of reviewSections"
                class="bg-gray-50 rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-medium text-gray-800">
                      {{ section.title }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ section.description }}
                    </p>
                  </div>
                  <button
                    (click)="editSection(section.step)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <span class="material-icons">edit</span>
                  </button>
                </div>
                <div [ngSwitch]="section.type">
                  <!-- Role Display -->
                  <div *ngSwitchCase="'role'" class="text-gray-700">
                    {{ assessment.jobRole }}
                  </div>

                  <!-- Skills Display -->
                  <div *ngSwitchCase="'skills'" class="flex flex-wrap gap-2">
                    <span
                      *ngFor="let skill of assessment.skills"
                      class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {{ skill }}
                    </span>
                  </div>

                  <!-- Settings Display -->
                  <div
                    *ngSwitchCase="'settings'"
                    class="space-y-2 text-gray-700"
                  >
                    <div>Experience: {{ assessment.experienceLevel }}</div>
                    <div>Duration: {{ assessment.duration }} minutes</div>
                    <div class="flex flex-wrap gap-2">
                      <span
                        *ngFor="let tag of assessment.tags"
                        class="px-2 py-1 bg-gray-200 rounded-full text-sm"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
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
              *ngIf="currentStep < 3"
              (click)="nextStep()"
              [disabled]="!canProceed"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              *ngIf="currentStep === 3"
              (click)="publish()"
              [disabled]="!isComplete"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreateAssessmentModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() published = new EventEmitter<Assessment>();
  @Output() drafted = new EventEmitter<Assessment>();

  isVisible = false;
  currentStep = 0;
  steps = ["Job Role", "Skills", "Settings", "Review"];
  showSkillInput = false;
  newSkill = "";
  newTag = "";

  experienceLevels = [
    "0 - 4 years",
    "5 - 8 years",
    "9 - 12 years",
    "13 - 16 years",
  ];

  popularRoles: JobRole[] = [
    {
      id: "1",
      title: "Backend Developer",
      skills: ["Java", "Spring Boot", "SQL", "REST API"],
    },
    {
      id: "2",
      title: "Frontend Developer",
      skills: ["React", "TypeScript", "CSS", "HTML"],
    },
    {
      id: "3",
      title: "Full Stack Developer",
      skills: ["JavaScript", "Node.js", "React", "MongoDB"],
    },
    {
      id: "4",
      title: "DevOps Engineer",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    },
  ];

  recommendedSkills = [
    "Java",
    "Spring Boot",
    "SQL",
    "REST API",
    "Microservices",
    "Docker",
  ];

  reviewSections = [
    {
      title: "Job Role",
      description: "Selected position and requirements",
      type: "role",
      step: 0,
    },
    {
      title: "Skills & Questions",
      description: "Required skills and question selection method",
      type: "skills",
      step: 1,
    },
    {
      title: "Test Settings",
      description: "Experience level, duration, and tags",
      type: "settings",
      step: 2,
    },
  ];

  assessment: Assessment = {
    name: "Sample Backend Developer",
    jobRole: "Sample Forntend",
    skills: ["Sample Java"],
    experienceLevel: "Sample experence",
    duration: "Sample 90",
    startDate: "Sample",
    endDate: "123",
    tags: ["123"],
    isAutomatic: true,
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
    this.assessment = {
      name: "",
      jobRole: "",
      skills: [],
      experienceLevel: "",
      duration: "90",
      startDate: "",
      endDate: "",
      tags: [],
      isAutomatic: true,
    };
    this.newSkill = "";
    this.newTag = "";
    this.showSkillInput = false;
  }

  getStepSubtitle(): string {
    switch (this.currentStep) {
      case 0:
        return "Select job role";
      case 1:
        return "How would you like to add questions?";
      case 2:
        return "Set experience level & duration";
      case 3:
        return "Review your test";
      default:
        return "";
    }
  }

  getStepNumberClass(index: number): string {
    const baseClasses =
      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ";
    if (this.currentStep > index) {
      return baseClasses + "bg-blue-500 text-white";
    }
    if (this.currentStep === index) {
      return baseClasses + "bg-blue-500 text-white";
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

  selectRole(role: JobRole) {
    this.assessment.jobRole = role.title;
    this.assessment.skills = [...role.skills];
  }

  toggleSkill(skill: string) {
    const index = this.assessment.skills.indexOf(skill);
    if (index === -1) {
      this.assessment.skills.push(skill);
    } else {
      this.assessment.skills.splice(index, 1);
    }
  }

  isSkillSelected(skill: string): boolean {
    return this.assessment.skills.includes(skill);
  }

  addSkill() {
    if (this.newSkill.trim()) {
      this.assessment.skills.push(this.newSkill.trim());
      this.newSkill = "";
      this.showSkillInput = false;
    }
  }

  selectExperience(level: string) {
    this.assessment.experienceLevel = level;
  }

  getExperienceDescription(level: string): string {
    switch (level) {
      case "0 - 4 years":
        return "Entry to Mid Level";
      case "5 - 8 years":
        return "Senior Level";
      case "9 - 12 years":
        return "Lead Level";
      case "13 - 16 years":
        return "Principal Level";
      default:
        return "";
    }
  }

  getCurrentDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  addTag() {
    if (this.newTag.trim()) {
      this.assessment.tags.push(this.newTag.trim());
      this.newTag = "";
    }
  }

  removeTag(index: number) {
    this.assessment.tags.splice(index, 1);
  }

  editSection(step: number) {
    this.currentStep = step;
  }

  get canProceed(): boolean {
    switch (this.currentStep) {
      case 0:
        return this.assessment.jobRole.trim() !== "";
      case 1:
        return this.assessment.skills.length > 0;
      case 2:
        return (
          this.assessment.experienceLevel !== "" &&
          this.assessment.duration !== "" &&
          this.assessment.startDate !== "" &&
          this.assessment.endDate !== "" &&
          new Date(this.assessment.startDate) <
            new Date(this.assessment.endDate)
        );
      default:
        return true;
    }
  }

  get isComplete(): boolean {
    return (
      this.assessment.jobRole.trim() !== "" &&
      this.assessment.skills.length > 0 &&
      this.assessment.experienceLevel !== "" &&
      this.assessment.duration !== "" &&
      this.assessment.startDate !== "" &&
      this.assessment.endDate !== "" &&
      new Date(this.assessment.startDate) < new Date(this.assessment.endDate)
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
    this.drafted.emit({ ...this.assessment });
  }

  publish() {
    if (this.isComplete) {
      this.published.emit({ ...this.assessment });
      this.close();
    }
  }
}
