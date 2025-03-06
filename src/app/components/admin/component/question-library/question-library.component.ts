import { Component, Output, EventEmitter, Input } from '@angular/core';
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
            <div class="relative flex-1 max-w-2xl">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearch()"
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="Search questions by topic, title, or description..."
              >
            </div>

            <!-- Filter Bar -->
            <div class="flex items-center gap-4">
              <!-- Question Types Dropdown -->
              <div class="relative group">
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
              <div class="relative group">
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
        </div>

        <!-- Question List -->
        <div class="flex-1 overflow-auto p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let question of filteredQuestions"
                 class="relative border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                 [class.border-[#4CAF50]]="isSelected(question.id)">
              <!-- Selection Checkbox -->
              <div class="absolute top-4 right-4">
                <input type="checkbox"
                       [checked]="isSelected(question.id)"
                       (change)="toggleSelection(question)"
                       class="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]">
              </div>

              <!-- Question Content -->
              <div class="pr-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">{{question.title}}</h3>
                <p class="text-gray-600 text-sm mb-4">{{question.description}}</p>
                
                <!-- Tags -->
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let tech of question.technologies"
                        class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                    {{tech}}
                  </span>
                </div>

                <!-- Categories -->
                <div class="flex flex-wrap gap-2 mt-2">
                  <span *ngFor="let category of question.categories"
                        class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">
                    {{category}}
                  </span>
                </div>

                <!-- Difficulty -->
                <span [class]="getDifficultyClass(question.difficulty)" class="mt-3 inline-block">
                  {{question.difficulty}}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t bg-gray-50 p-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            {{selectedQuestions.length}} questions selected
          </div>
          <div class="flex gap-2">
            <button 
              (click)="close()"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button 
              (click)="addSelectedQuestions()"
              [disabled]="selectedQuestions.length === 0"
              class="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#43A047] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Add Selected Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuestionLibraryComponent {
  @Input() existingQuestionIds: string[] = [];
  @Output() questionsSelected = new EventEmitter<QuestionType[]>();
  @Output() closed = new EventEmitter<void>();

  searchQuery = '';
  selectedQuestions: QuestionType[] = [];
  difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];
  selectedDifficulty = '';

  questionTypes = ['Multiple Choice', 'Programming', 'Design', 'Database', 'System Design'];
  libraries = ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Security'];

  selectedTypes: { [key: string]: boolean } = {};
  selectedLibraries: { [key: string]: boolean } = {};

  showDropdowns = {
    types: false,
    libraries: false
  };

  questions: QuestionType[] = [
    {
      id: 1,
      title: "RESTful API Design",
      description: "Design a scalable REST API for a social media platform with user authentication and post management.",
      difficulty: "Intermediate",
      score: 85,
      technologies: ["Python", "FastAPI", "REST"],
      categories: ["Backend", "API Design"]
    },
    {
      id: 2,
      title: "React Component Architecture",
      description: "Create a reusable component library following React best practices and design patterns.",
      difficulty: "Basic",
      score: 75,
      technologies: ["React", "TypeScript", "Styled Components"],
      categories: ["Frontend", "Component Design"]
    },
    {
      id: 3,
      title: "Database Optimization",
      description: "Optimize database queries and implement caching strategies for a high-traffic e-commerce platform.",
      difficulty: "Advanced",
      score: 95,
      technologies: ["PostgreSQL", "Redis", "SQL"],
      categories: ["Database", "Performance"]
    },
    {
      id: 4,
      title: "Authentication System",
      description: "Implement a secure authentication system with JWT, OAuth, and role-based access control.",
      difficulty: "Intermediate",
      score: 88,
      technologies: ["Node.js", "JWT", "OAuth"],
      categories: ["Security", "Backend"]
    },
    {
      id: 5,
      title: "Microservices Architecture",
      description: "Design and implement a microservices-based system with service discovery and load balancing.",
      difficulty: "Advanced",
      score: 92,
      technologies: ["Docker", "Kubernetes", "gRPC"],
      categories: ["System Design", "Microservices"]
    },
    {
      id: 6,
      title: "State Management",
      description: "Implement global state management using Redux/MobX with proper error handling and side effects.",
      difficulty: "Intermediate",
      score: 82,
      technologies: ["Redux", "MobX", "JavaScript"],
      categories: ["Frontend", "State Management"]
    },
    {
      id: 7,
      title: "Testing Strategies",
      description: "Write comprehensive test suites using modern testing frameworks and methodologies.",
      difficulty: "Basic",
      score: 78,
      technologies: ["Jest", "React Testing Library", "Cypress"],
      categories: ["Testing", "Quality Assurance"]
    },
    {
      id: 8,
      title: "CI/CD Pipeline",
      description: "Set up a complete CI/CD pipeline with automated testing, deployment, and monitoring.",
      difficulty: "Advanced",
      score: 90,
      technologies: ["Jenkins", "GitHub Actions", "AWS"],
      categories: ["DevOps", "Automation"]
    },
    {
      id: 9,
      title: "Real-time Chat System",
      description: "Build a scalable real-time chat system with WebSocket integration and message persistence.",
      difficulty: "Intermediate",
      score: 85,
      technologies: ["WebSocket", "Node.js", "MongoDB"],
      categories: ["Real-time", "Full Stack"]
    },
    {
      id: 10,
      title: "Mobile Responsive Design",
      description: "Create a fully responsive web application with modern CSS frameworks and best practices.",
      difficulty: "Basic",
      score: 72,
      technologies: ["CSS", "Tailwind", "Responsive Design"],
      categories: ["Frontend", "UI/UX"]
    }
  ];

  get filteredQuestions(): QuestionType[] {
    let filtered = [...this.questions];

    // Filter out existing questions
    if (this.existingQuestionIds.length > 0) {
      filtered = filtered.filter(q => !this.existingQuestionIds.includes(q.id.toString()));
    }

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

    // Apply difficulty filter
    if (this.selectedDifficulty) {
      filtered = filtered.filter(q => q.difficulty === this.selectedDifficulty);
    }

    // Apply question type filters
    const activeTypes = Object.entries(this.selectedTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type);
    if (activeTypes.length > 0) {
      filtered = filtered.filter(q => 
        q.categories.some(c => activeTypes.includes(c))
      );
    }

    // Apply library filters
    const activeLibraries = Object.entries(this.selectedLibraries)
      .filter(([_, selected]) => selected)
      .map(([lib]) => lib);
    if (activeLibraries.length > 0) {
      filtered = filtered.filter(q => 
        q.categories.some(c => activeLibraries.includes(c))
      );
    }

    return filtered;
  }

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

  toggleDropdown(type: 'types' | 'libraries') {
    this.showDropdowns[type] = !this.showDropdowns[type];
    // Close other dropdown
    const other = type === 'types' ? 'libraries' : 'types';
    this.showDropdowns[other] = false;
  }

  toggleDifficulty(level: string) {
    this.selectedDifficulty = this.selectedDifficulty === level ? '' : level;
    this.applyFilters();
  }

  getDifficultyButtonClass(level: string): string {
    const isSelected = this.selectedDifficulty === level;
    const baseClasses = 'border ';
    
    switch (level) {
      case 'Basic':
        return baseClasses + (isSelected 
          ? 'bg-green-50 text-green-600 border-green-200'
          : 'text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-600');
      case 'Intermediate':
        return baseClasses + (isSelected
          ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
          : 'text-gray-600 border-gray-200 hover:bg-yellow-50 hover:text-yellow-600');
      case 'Advanced':
        return baseClasses + (isSelected
          ? 'bg-red-50 text-red-600 border-red-200'
          : 'text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600');
      default:
        return baseClasses + 'text-gray-600 border-gray-200';
    }
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

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    // Filters are automatically applied through the filteredQuestions getter
  }

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
    this.selectedDifficulty = '';
    this.selectedTypes = {};
    this.selectedLibraries = {};
    this.applyFilters();
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

  addSelectedQuestions() {
    this.questionsSelected.emit(this.selectedQuestions);
    this.close();
  }

  close() {
    this.closed.emit();
  }
}