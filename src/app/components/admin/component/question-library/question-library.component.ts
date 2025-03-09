import { Component, Output, EventEmitter, Input, HostListener, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { QuestionType } from "../../types/question.type";
import { Question, QuestionService } from "../../services/fetch.question.service";
import { TruncatePipe } from "../../../../shared/pipes/truncate.pipe";

@Component({
  selector: "app-question-library",
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe],
  template: `
<div class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center overflow-hidden">
  <div class="bg-white w-[90vw] h-[90vh] rounded-xl shadow-2xl flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center p-6 border-b">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Question Library</h2>
        <p class="text-sm text-gray-500 mt-1">Select questions to add to your test</p>
      </div>
      <button (click)="close()" class="text-gray-500 hover:text-gray-700">
        <span class="material-icons">close</span>
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="border-b">
      <div class="p-6 space-y-4">
        <!-- Search -->
        <div class="relative flex-1 max-w-2xl">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            placeholder="Search questions by topic, title, or description..."
          />
        </div>

        <!-- Filter Bar -->
        <div class="flex items-center gap-4">
          <!-- Question Types Dropdown -->
          <div class="relative">
            <button
              (click)="toggleDropdown('types')"
              class="dropdown-button px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <span class="material-icons text-gray-500">filter_list</span>
              Question Types
              <span class="material-icons text-gray-500 text-sm">expand_more</span>
            </button>
            <div
              *ngIf="showDropdowns.types"
              class="dropdown-content absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10"
            >
              <div class="p-3 space-y-2">
                <label *ngFor="let type of questionTypes" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    [(ngModel)]="selectedTypes[type]"
                    (change)="applyFilters()"
                    class="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]"
                  />
                  <span>{{ type }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Libraries Dropdown -->
          <div class="relative">
            <button
              (click)="toggleDropdown('libraries')"
              class="dropdown-button px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <span class="material-icons text-gray-500">folder</span>
              Libraries
              <span class="material-icons text-gray-500 text-sm">expand_more</span>
            </button>
            <div
              *ngIf="showDropdowns.libraries"
              class="dropdown-content absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10"
            >
              <div class="p-3 space-y-2">
                <label *ngFor="let lib of libraries" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    [(ngModel)]="selectedLibraries[lib]"
                    (change)="applyFilters()"
                    class="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]"
                  />
                  <span>{{ lib }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Difficulty Levels -->
          <div class="flex items-center gap-2">
            <button
              *ngFor="let level of difficultyLevels"
              (click)="toggleDifficulty(level)"
              [class]="getDifficultyClass(level)"
              class="px-3 py-1 rounded-full text-sm transition-colors"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <!-- Active Filters -->
        <div *ngIf="hasActiveFilters" class="flex flex-wrap gap-2">
          <div
            *ngFor="let filter of activeFilters"
            class="px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-sm flex items-center"
          >
            {{ filter }}
            <button
              (click)="removeFilter(filter)"
              class="ml-2 text-[#4CAF50] hover:text-[#43A047]"
            >
              <span class="material-icons text-sm">close</span>
            </button>
          </div>
          <button
            (click)="clearFilters()"
            class="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>

    <!-- Question List -->
    <div
      #questionList
      class="flex-1 overflow-auto p-6"
      (scroll)="onScroll($event)"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          *ngFor="let question of questions"
          class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          [class.border-[#4CAF50]]="isSelected(question.id)"
        >
          <!-- Difficulty Strip -->
          <div [class]="getDifficultyStripClass(question.difficultyLevel)"></div>

          <!-- Selection Checkbox -->
          <div class="absolute top-4 right-4">
            <input
              type="checkbox"
              [checked]="isSelected(question.id)"
              (change)="toggleSelection(question)"
              class="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]"
            />
          </div>

          <!-- Content -->
          <div class="pl-4">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {{ question.title }}
                </h3>
              </div>
              <div class="flex flex-col items-end ml-4">
                <span
                  class="px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-sm font-medium whitespace-nowrap"
                >
                  Score: {{ question.maxScore }}
                </span>
                <span [class]="getDifficultyClass(question.difficultyLevel)" class="mt-2">
                  {{ question.difficultyLevel }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              {{ question.problemStatement | truncate: 100 }}
            </p>

            <!-- Footer -->
            <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span
                *ngFor="let category of question.tags"
                class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium border border-purple-100"
              >
                {{ category }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="flex justify-center p-4">
        <span class="text-gray-600">Loading more questions...</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t bg-gray-50 p-4 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        {{ selectedQuestions.length }} questions selected
      </div>
      <div class="flex gap-2">
        <button
          (click)="close()"
          class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          (click)="addSelectedQuestions()"
          [disabled]="selectedQuestions.length === 0"
          class="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#43A047] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Selected Questions
        </button>
      </div>
    </div>
  </div>
</div>
  `,
})
export class QuestionLibraryComponent {
  @Input() existingQuestionIds: string[] = [];
  @Output() questionsSelected = new EventEmitter<QuestionType[]>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('questionList') questionList!: ElementRef; // Reference to the question list container

  searchQuery = '';
  selectedQuestions: QuestionType[] = [];
  difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];
  selectedDifficulty = '';

  questionTypes = ['MCQ', 'CODING', 'SUBJECTIVE', 'FULL STACK'];
  libraries = ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Security'];

  selectedTypes: { [key: string]: boolean } = {};
  selectedLibraries: { [key: string]: boolean } = {};

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

  isLoading = false; // Track loading state
  hasMoreQuestions = true; // Track if more questions are available

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.fetchQuestions();
  }

  // Fetch questions from the API
  fetchQuestions(): void {
    if (this.cachedQuestions[this.currentPage]) {
      // Use cached questions if available
      this.questions = this.cachedQuestions[this.currentPage];
      return;
    }

    this.isLoading = true; // Set loading state

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
          const newQuestions = response.data.list;
          this.questions = [...this.questions, ...newQuestions]; // Append new questions
          this.cachedQuestions[this.currentPage] = newQuestions; // Cache the fetched questions

          // Check if there are more questions to load
          this.hasMoreQuestions = newQuestions.length === this.pageSize;
        } else {
          console.error('Failed to fetch questions:', response.message);
        }
        this.isLoading = false; // Reset loading state
      });
  }
  removeFilter(filter: string) {
    const [type, value] = filter.split(": ");
    switch (type) {
      case "Difficulty":
        this.selectedDifficulty = "";
        break;
      case "Type":
        this.selectedTypes[value] = false;
        break;
      case "Library":
        this.selectedLibraries[value] = false;
        break;
    }
    this.applyFilters();
  }
  // Handle scroll event
  onScroll(event: Event): void {
    const element = this.questionList.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if (atBottom && !this.isLoading && this.hasMoreQuestions) {
      this.currentPage++; // Increment page
      this.fetchQuestions(); // Fetch next set of questions
    }
  }

  // Apply filters
  applyFilters(): void {
    this.currentPage = 0; // Reset to the first page
    this.questions = []; // Clear existing questions
    this.cachedQuestions = {}; // Clear cache
    this.updateSearchQuestionType(); // Clear cache on new filters
    this.fetchQuestions(); // Fetch fresh data
  }

  
  updateSearchQuestionType() {
    this.searchQuestionType = Object.keys(this.selectedTypes).filter(
      (key) => this.selectedTypes[key],
    ); // Push only the keys with `true` value
  }
  // Toggle dropdown visibility
  toggleDropdown(type: 'types' | 'libraries') {
    this.showDropdowns[type] = !this.showDropdowns[type];
    // Close other dropdown
    const other = type === 'types' ? 'libraries' : 'types';
    this.showDropdowns[other] = false;
  }

  // Toggle difficulty filter
  toggleDifficulty(level: string) {
    if (this.searchDifficultyLevels.includes(level)) {
      // If level already exists, remove it (toggle off)
      this.searchDifficultyLevels = this.searchDifficultyLevels.filter(d => d !== level);
    } else {
      // If level doesn't exist, add it (toggle on)
      this.searchDifficultyLevels.push(level);
    }
    this.applyFilters();
  }

  // Check if a question is selected
  isSelected(id: number): boolean {
    return this.selectedQuestions.some((q) => q.id === id);
  }

  // Toggle question selection
  toggleSelection(question: QuestionType) {
    const index = this.selectedQuestions.findIndex((q) => q.id === question.id);
    if (index === -1) {
      this.selectedQuestions.push(question);
    } else {
      this.selectedQuestions.splice(index, 1);
    }
  }

  // Add selected questions and close the modal
  addSelectedQuestions() {
    this.questionsSelected.emit(this.selectedQuestions);
    this.close();
  }

  // Close the modal
  close() {
    this.closed.emit();
  }

  // Handle search
  onSearch(): void {
    console.log("Query", this.selectedTypes);
    this.currentPage = 0; // Reset to the first page
    this.questions = []; // Clear existing questions
    this.cachedQuestions = {}; // Clear cache
    this.fetchQuestions(); // Fetch fresh data
  }

  // Check if there are active filters
  get hasActiveFilters(): boolean {
    return (
      this.selectedDifficulty !== "" ||
      Object.values(this.selectedTypes).some((v) => v) ||
      Object.values(this.selectedLibraries).some((v) => v)
    );
  }

  // Get active filters
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

  // Clear all filters
  clearFilters() {
    this.searchQuery = "";
    this.selectedDifficulty = "";
    this.selectedTypes = {};
    this.selectedLibraries = {};
    this.applyFilters();
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    if (
      !clickedElement.closest('.dropdown-button') &&
      !clickedElement.closest('.dropdown-content')
    ) {
      this.showDropdowns.types = false;
      this.showDropdowns.libraries = false;
    }
  }

  // Get difficulty strip class
  getDifficultyStripClass(difficulty: string): string {
    const baseClasses = "w-1.5 h-full absolute left-0 top-0 ";
    switch (difficulty) {
      case "Basic":
        return baseClasses + "bg-green-500";
      case "Intermediate":
        return baseClasses + "bg-yellow-500";
      case "Advanced":
        return baseClasses + "bg-red-500";
      default:
        return baseClasses + "bg-gray-500";
    }
  }

  // Get difficulty class
  getDifficultyClass(difficulty: string): string {
    const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium ";
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
}