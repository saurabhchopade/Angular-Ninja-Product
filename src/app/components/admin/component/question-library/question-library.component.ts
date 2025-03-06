import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionType } from '../../types/question.type';

@Component({
  selector: 'app-question-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center overflow-hidden">
      <div class="bg-white w-[90vw] h-[90vh] rounded-xl shadow-2xl flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">Question Library</h2>
            <p class="text-sm text-gray-500 mt-1">Select questions to add to your test</p>
          </div>
          <button 
            (click)="close()"
            class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Search and Filters -->
        <div class="border-b">
          <div class="p-6 space-y-4">
            <!-- Search -->
            <div class="flex gap-4">
              <div class="flex-1 relative">
                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onSearch()"
                  class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  placeholder="Search questions by keyword, title, or content..."
                >
                <!-- Search Suggestions -->
                <div *ngIf="searchSuggestions.length > 0" 
                     class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                  <div *ngFor="let suggestion of searchSuggestions"
                       (click)="selectSuggestion(suggestion)"
                       class="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    {{ suggestion }}
                  </div>
                </div>
              </div>

              <!-- Advanced Filters Toggle -->
              <button 
                (click)="showAdvancedFilters = !showAdvancedFilters"
                class="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <span class="material-icons">tune</span>
                Advanced Filters
                <span class="material-icons text-sm" [class.rotate-180]="showAdvancedFilters">
                  expand_more
                </span>
              </button>
            </div>

            <!-- Advanced Filters -->
            <div *ngIf="showAdvancedFilters" class="grid grid-cols-4 gap-4">
              <!-- Question Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select 
                  [(ngModel)]="filters.type"
                  (ngModelChange)="applyFilters()"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4CAF50]">
                  <option value="">All Types</option>
                  <option value="mcq">Multiple Choice</option>
                  <option value="programming">Programming</option>
                  <option value="subjective">Subjective</option>
                  <option value="fullstack">Full Stack</option>
                </select>
              </div>

              <!-- Difficulty -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select 
                  [(ngModel)]="filters.difficulty"
                  (ngModelChange)="applyFilters()"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4CAF50]">
                  <option value="">All Levels</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <!-- Date Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <select 
                  [(ngModel)]="filters.dateRange"
                  (ngModelChange)="applyFilters()"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4CAF50]">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <!-- Usage -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Usage</label>
                <select 
                  [(ngModel)]="filters.usage"
                  (ngModelChange)="applyFilters()"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4CAF50]">
                  <option value="">Any Usage</option>
                  <option value="unused">Never Used</option>
                  <option value="used">Previously Used</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            <!-- Active Filters -->
            <div *ngIf="hasActiveFilters" class="flex flex-wrap gap-2">
              <div *ngFor="let filter of activeFilters"
                   class="px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-sm flex items-center">
                {{ filter.label }}
                <button (click)="removeFilter(filter.key)"
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
        </div>

        <!-- Question List -->
        <div class="flex-1 overflow-hidden flex">
          <!-- Questions Grid -->
          <div class="flex-1 overflow-auto p-6">
            <div class="grid grid-cols-2 gap-4">
              <div *ngFor="let question of filteredQuestions"
                   class="relative border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                   [class.bg-[#4CAF50]]="isSelected(question.id)"
                   [class.border-[#4CAF50]]="isSelected(question.id)">
                <!-- Checkbox -->
                <div class="absolute top-4 right-4">
                  <input 
                    type="checkbox"
                    [checked]="isSelected(question.id)"
                    (change)="toggleSelection(question)"
                    class="w-5 h-5 rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]">
                </div>

                <!-- Content -->
                <div class="pr-8">
                  <div class="flex items-start gap-3 mb-3">
                    <h3 class="text-lg font-semibold text-gray-800 flex-1">
                      {{ question.title }}
                    </h3>
                    <span [class]="getDifficultyClass(question.difficulty)">
                      {{ question.difficulty }}
                    </span>
                  </div>

                  <p class="text-gray-600 text-sm mb-4">
                    {{ question.description }}
                  </p>

                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let tech of question.technologies"
                          class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {{ tech }}
                    </span>
                  </div>

                  <!-- Preview Button -->
                  <button 
                    (click)="previewQuestion(question)"
                    class="mt-4 text-[#4CAF50] hover:text-[#43A047] text-sm font-medium flex items-center gap-1">
                    <span class="material-icons text-base">visibility</span>
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Selection Sidebar -->
          <div class="w-80 border-l bg-gray-50 flex flex-col">
            <div class="p-4 border-b bg-white">
              <h3 class="font-medium text-gray-800">Selected Questions</h3>
              <p class="text-sm text-gray-500">{{ selectedQuestions.length }} questions selected</p>
            </div>

            <div class="flex-1 overflow-auto p-4">
              <div *ngFor="let question of selectedQuestions" 
                   class="bg-white rounded-lg p-4 mb-3 shadow-sm">
                <div class="flex justify-between items-start">
                  <h4 class="font-medium text-gray-800">{{ question.title }}</h4>
                  <button 
                    (click)="toggleSelection(question)"
                    class="text-red-500 hover:text-red-600">
                    <span class="material-icons">close</span>
                  </button>
                </div>
                <span [class]="getDifficultyClass(question.difficulty)" class="mt-2">
                  {{ question.difficulty }}
                </span>
              </div>
            </div>

            <div class="p-4 border-t bg-white">
              <button 
                (click)="addSelectedQuestions()"
                [disabled]="selectedQuestions.length === 0"
                class="w-full py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#43A047] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Add Selected Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Preview Modal -->
    <div *ngIf="previewedQuestion"
         class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
         (click)="previewedQuestion = null">
      <div class="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6"
           (click)="$event.stopPropagation()">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">{{ previewedQuestion.title }}</h3>
            <span [class]="getDifficultyClass(previewedQuestion.difficulty)" class="mt-2">
              {{ previewedQuestion.difficulty }}
            </span>
          </div>
          <button 
            (click)="previewedQuestion = null"
            class="text-gray-400 hover:text-gray-600">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <p class="text-gray-600">{{ previewedQuestion.description }}</p>

          <div class="flex flex-wrap gap-2">
            <span *ngFor="let tech of previewedQuestion.technologies"
                  class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
              {{ tech }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <span *ngFor="let category of previewedQuestion.categories"
                  class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">
              {{ category }}
            </span>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            (click)="previewedQuestion = null"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class QuestionLibraryComponent {
  @Output() questionsSelected = new EventEmitter<QuestionType[]>();
  @Output() closed = new EventEmitter<void>();

  searchQuery = '';
  searchSuggestions: string[] = [];
  showAdvancedFilters = false;
  previewedQuestion: QuestionType | null = null;
  selectedQuestions: QuestionType[] = [];

  filters = {
    type: '',
    difficulty: '',
    dateRange: '',
    usage: ''
  };

  questions: QuestionType[] = [
    // Your existing questions array
  ];

  get filteredQuestions(): QuestionType[] {
    let filtered = [...this.questions];

    // Apply search
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.technologies.some(t => t.toLowerCase().includes(query)) ||
        q.categories.some(c => c.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (this.filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === this.filters.difficulty);
    }

    // Add more filter logic as needed

    return filtered;
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.filters).some(v => v !== '');
  }

  get activeFilters(): Array<{key: string, label: string}> {
    return Object.entries(this.filters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => ({
        key,
        label: `${key}: ${value}`
      }));
  }

  show() {
    // Show the library modal
  }

  close() {
    this.closed.emit();
  }

  onSearch() {
    // Implement search logic and update suggestions
    if (this.searchQuery.length > 2) {
      this.searchSuggestions = this.questions
        .filter(q => q.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
        .map(q => q.title)
        .slice(0, 5);
    } else {
      this.searchSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.searchSuggestions = [];
    this.onSearch();
  }

  applyFilters() {
    // Filters are automatically applied through the filteredQuestions getter
  }

  removeFilter(key: string) {
    (this.filters as any)[key] = '';
  }

  clearFilters() {
    this.filters = {
      type: '',
      difficulty: '',
      dateRange: '',
      usage: ''
    };
  }

  isSelected(id: number): boolean {
    return this.selectedQuestions.some(q => q.id === id);
  }

  toggleSelection(question: QuestionType) {
    const index = this.selectedQuestions.findIndex(q => q.id === question.id);
    if (index === -1) {
      this.selectedQuestions.push(question);
    } else {
      this.selectedQuestions.splice(index, 1);
    }
  }

  previewQuestion(question: QuestionType) {
    this.previewedQuestion = question;
  }

  addSelectedQuestions() {
    this.questionsSelected.emit(this.selectedQuestions);
    this.close();
  }

  getDifficultyClass(difficulty: string): string {
    const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-medium ';
    switch (difficulty) {
      case 'Basic': return baseClasses + 'bg-green-50 text-green-600';
      case 'Intermediate': return baseClasses + 'bg-yellow-50 text-yellow-600';
      case 'Advanced': return baseClasses + 'bg-red-50 text-red-600';
      default: return baseClasses + 'bg-gray-50 text-gray-600';
    }
  }
}