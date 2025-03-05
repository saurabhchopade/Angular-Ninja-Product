import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgrammingQuestion, TestCase, CodeSnippet } from '../../types/programming-question.type';

@Component({
  selector: 'app-create-programming-modal',
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
          <h2 class="text-xl font-semibold text-gray-800">Create Programming Question</h2>
          <button 
            (click)="close()" 
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Step Navigation -->
        <div class="flex items-center px-6 py-4 border-b bg-gray-50">
          <div *ngFor="let step of steps; let i = index" 
               class="flex items-center">
            <div class="flex items-center">
              <div [class]="getStepNumberClass(i)">
                {{i + 1}}
              </div>
              <span [class]="getStepTextClass(i)">{{step}}</span>
            </div>
            <div *ngIf="i < steps.length - 1" 
                 class="w-16 h-px mx-2"
                 [class.bg-green-500]="currentStep > i"
                 [class.bg-gray-300]="currentStep <= i">
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6 h-[calc(100%-200px)] overflow-y-auto">
          <!-- Step 1: Description -->
          <div *ngIf="currentStep === 0">
            <div class="space-y-6">
              <!-- Difficulty Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <div class="flex gap-4">
                  <label *ngFor="let level of difficultyLevels" 
                         class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" 
                           [value]="level" 
                           [(ngModel)]="question.difficulty"
                           class="text-green-500 focus:ring-green-500">
                    <span>{{level}}</span>
                  </label>
                </div>
              </div>

              <!-- Problem Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Problem Name</label>
                <input
                  type="text"
                  [(ngModel)]="question.title"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter problem name..."
                >
              </div>

              <!-- Problem Statement -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Problem Statement</label>
                <textarea
                  [(ngModel)]="question.problemStatement"
                  rows="6"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter the problem statement..."
                ></textarea>
              </div>

              <!-- Maximum Score -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Score</label>
                <input
                  type="number"
                  [(ngModel)]="question.maxScore"
                  class="w-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                >
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span *ngFor="let tag of question.tags; let i = index" 
                        class="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                    {{tag}}
                    <button (click)="removeTag(i)" 
                            class="ml-1 text-gray-500 hover:text-gray-700">
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
                  >
                  <button 
                    (click)="addTag()"
                    class="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Solution & Test Cases -->
          <div *ngIf="currentStep === 1">
            <div class="space-y-6">
              <!-- Sample Input/Output -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sample Input</label>
                  <textarea
                    [(ngModel)]="question.sampleInput"
                    rows="4"
                    class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                    placeholder="Enter sample input..."
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sample Output</label>
                  <textarea
                    [(ngModel)]="question.sampleOutput"
                    rows="4"
                    class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                    placeholder="Enter sample output..."
                  ></textarea>
                </div>
              </div>

              <!-- Sample Explanation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sample Explanation</label>
                <textarea
                  [(ngModel)]="question.sampleExplanation"
                  rows="4"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Explain the sample case..."
                ></textarea>
              </div>

              <!-- Test Cases -->
              <div>
                <div class="flex justify-between items-center mb-4">
                  <label class="block text-sm font-medium text-gray-700">Test Cases</label>
                  <button 
                    (click)="addTestCase()"
                    class="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Add Test Case
                  </button>
                </div>
                <div class="space-y-4">
                  <div *ngFor="let testCase of question.testCases; let i = index" 
                       class="border rounded-lg p-4">
                    <div class="flex justify-between items-start mb-4">
                      <h4 class="font-medium">Test Case {{i + 1}}</h4>
                      <button 
                        (click)="removeTestCase(i)"
                        class="text-red-500 hover:text-red-700">
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">Input</label>
                        <textarea
                          [(ngModel)]="testCase.input"
                          rows="3"
                          class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">Output</label>
                        <textarea
                          [(ngModel)]="testCase.output"
                          rows="3"
                          class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                        ></textarea>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">Score</label>
                        <input
                          type="number"
                          [(ngModel)]="testCase.score"
                          class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          min="1"
                        >
                      </div>
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">Visibility</label>
                        <div class="flex items-center mt-2">
                          <input
                            type="checkbox"
                            [(ngModel)]="testCase.isVisible"
                            class="rounded text-green-500 focus:ring-green-500"
                          >
                          <span class="ml-2 text-sm text-gray-600">Visible to candidates</span>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <label class="block text-sm text-gray-600 mb-1">Explanation (Optional)</label>
                      <textarea
                        [(ngModel)]="testCase.explanation"
                        rows="2"
                        class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="Add explanation for this test case..."
                      ></textarea>
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
                <label class="block text-sm font-medium text-gray-700 mb-4">Allowed Languages</label>
                <div class="grid grid-cols-3 gap-3">
                  <button *ngFor="let lang of availableLanguages"
                          (click)="toggleLanguage(lang)"
                          [class]="getLanguageButtonClass(lang)">
                    {{lang}}
                  </button>
                </div>
              </div>

              <!-- Code Snippets -->
              <div class="mt-8">
                <label class="block text-sm font-medium text-gray-700 mb-4">Code Snippets</label>
                <div class="border rounded-lg overflow-hidden">
                  <!-- Language Tabs -->
                  <div class="flex border-b bg-gray-50">
                    <button *ngFor="let lang of question.allowedLanguages"
                            (click)="setActiveSnippetLang(lang)"
                            [class]="getSnippetTabClass(lang)"
                            class="px-4 py-2 text-sm font-medium">
                      {{lang}}
                    </button>
                  </div>
                  <!-- Code Editor -->
                  <div class="p-4">
                    <textarea
                      *ngIf="activeSnippetLang"
                      [(ngModel)]="getCodeSnippet(activeSnippetLang).code"
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
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p class="text-blue-800 text-sm">
                  This section contains the approach to solve the question. Candidates cannot view this section.
                </p>
              </div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Editorial</label>
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
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center">
          <div>
            <button 
              (click)="saveDraft()"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mr-2">
              Save as Draft
            </button>
          </div>
          <div class="flex gap-2">
            <button 
              *ngIf="currentStep > 0"
              (click)="previousStep()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button 
              *ngIf="currentStep < 3"
              (click)="nextStep()"
              [disabled]="!canProceed"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
            <button 
              *ngIf="currentStep === 3"
              (click)="publish()"
              [disabled]="!isComplete"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreateProgrammingModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() published = new EventEmitter<ProgrammingQuestion>();
  @Output() drafted = new EventEmitter<ProgrammingQuestion>();

  isVisible = false;
  currentStep = 0;
  steps = ['Description', 'Solution & Test Cases', 'Languages', 'Editorial'];
  difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];
  newTag = '';
  activeSnippetLang = '';

  availableLanguages = ['Python 3', 'Python 3.8', 'JavaScript', 'TypeScript', 'Java', 'C#', 'Go'];

  question: ProgrammingQuestion = {
    difficulty: 'Basic',
    title: '',
    problemStatement: '',
    maxScore: 100,
    tags: [],
    sampleInput: '',
    sampleOutput: '',
    sampleExplanation: '',
    testCases: [],
    allowedLanguages: [],
    codeSnippets: [],
    editorial: ''
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
      difficulty: 'Basic',
      title: '',
      problemStatement: '',
      maxScore: 100,
      tags: [],
      sampleInput: '',
      sampleOutput: '',
      sampleExplanation: '',
      testCases: [],
      allowedLanguages: [],
      codeSnippets: [],
      editorial: ''
    };
    this.newTag = '';
    this.activeSnippetLang = '';
  }

  addTag() {
    if (this.newTag.trim() && !this.question.tags.includes(this.newTag.trim())) {
      this.question.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.question.tags.splice(index, 1);
  }

  addTestCase() {
    this.question.testCases.push({
      input: '',
      output: '',
      score: 10,
      isVisible: false,
      explanation: ''
    });
  }

  removeTestCase(index: number) {
    this.question.testCases.splice(index, 1);
  }

  toggleLanguage(lang: string) {
    const index = this.question.allowedLanguages.indexOf(lang);
    if (index === -1) {
      this.question.allowedLanguages.push(lang);
      this.question.codeSnippets.push({
        language: lang,
        code: this.getDefaultSnippet(lang)
      });
      if (!this.activeSnippetLang) {
        this.activeSnippetLang = lang;
      }
    } else {
      this.question.allowedLanguages.splice(index, 1);
      this.question.codeSnippets = this.question.codeSnippets.filter(s => s.language !== lang);
      if (this.activeSnippetLang === lang) {
        this.activeSnippetLang = this.question.allowedLanguages[0] || '';
      }
    }
  }

  getLanguageButtonClass(lang: string): string {
    const isSelected = this.question.allowedLanguages.includes(lang);
    return `px-4 py-2 rounded-lg border ${
      isSelected 
        ? 'border-green-500 bg-green-50 text-green-700' 
        : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
    } transition-colors`;
  }

  setActiveSnippetLang(lang: string) {
    this.activeSnippetLang = lang;
  }

  getSnippetTabClass(lang: string): string {
    return this.activeSnippetLang === lang
      ? 'border-b-2 border-green-500 text-green-700'
      : 'text-gray-500 hover:text-gray-700';
  }

  getCodeSnippet(language: string): CodeSnippet {
    let snippet = this.question.codeSnippets.find(s => s.language === language);
    if (!snippet) {
      snippet = {
        language,
        code: this.getDefaultSnippet(language)
      };
      this.question.codeSnippets.push(snippet);
    }
    return snippet;
  }

  getDefaultSnippet(language: string): string {
    switch (language) {
      case 'Python 3':
      case 'Python 3.8':
        return 'def solution(M, R, D):\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    M = int(input())\n    R = int(input())\n    D = int(input())\n    result = solution(M, R, D)\n    print(result)';
      case 'JavaScript':
      case 'TypeScript':
        return 'function solution(M, R, D) {\n    // Write your code here\n}\n\nconst M = parseInt(readline());\nconst R = parseInt(readline());\nconst D = parseInt(readline());\nconst result = solution(M, R, D);\nconsole.log(result);';
      case 'Java':
        return 'import java.util.*;\n\nclass Solution {\n    public static String solution(int M, int R, int D) {\n        // Write your code here\n        return "";\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int M = scanner.nextInt();\n        int R = scanner.nextInt();\n        int D = scanner.nextInt();\n        String result = solution(M, R, D);\n        System.out.println(result);\n    }\n}';
      case 'C#':
        return 'using System;\n\nclass Solution {\n    static string Solution(int M, int R, int D) {\n        // Write your code here\n        return "";\n    }\n\n    static void Main(string[] args) {\n        int M = int.Parse(Console.ReadLine());\n        int R = int.Parse(Console.ReadLine());\n        int D = int.Parse(Console.ReadLine());\n        string result = Solution(M, R, D);\n        Console.WriteLine(result);\n    }';
      case 'Go':
        return 'package main\n\nimport "fmt"\n\nfunc solution(M, R, D int) string {\n    // Write your code here\n    return ""\n}\n\nfunc main() {\n    var M, R, D int\n    fmt.Scan(&M, &R, &D)\n    result := solution(M, R, D)\n    fmt.Println(result)\n}';
      default:
        return '// Write your solution here';
    }
  }

  getStepNumberClass(index: number): string {
    const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ';
    if (this.currentStep > index) {
      return baseClasses + 'bg-green-500 text-white';
    }
    if (this.currentStep === index) {
      return baseClasses + 'bg-green-500 text-white';
    }
    return baseClasses + 'bg-gray-200 text-gray-500';
  }

  getStepTextClass(index: number): string {
    const baseClasses = 'ml-2 text-sm font-medium ';
    if (this.currentStep >= index) {
      return baseClasses + 'text-gray-900';
    }
    return baseClasses + 'text-gray-500';
  }

  get canProceed(): boolean {
    switch (this.currentStep) {
      case 0:
        return this.question.title.trim() !== '' && 
               this.question.problemStatement.trim() !== '' && 
               this.question.maxScore > 0;
      case 1:
        return this.question.sampleInput.trim() !== '' && 
               this.question.sampleOutput.trim() !== '' &&
               this.question.testCases.length > 0;
      case 2:
        return this.question.allowedLanguages.length > 0;
      default:
        return true;
    }
  }

  get isComplete(): boolean {
    return this.question.title.trim() !== '' && 
           this.question.problemStatement.trim() !== '' && 
           this.question.maxScore > 0 &&
           this.question.sampleInput.trim() !== '' && 
           this.question.sampleOutput.trim() !== '' &&
           this.question.testCases.length > 0 &&
           this.question.allowedLanguages.length > 0 &&
           this.question.editorial.trim() !== '';
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
    this.drafted.emit({...this.question});
  }

  publish() {
    if (this.isComplete) {
      this.published.emit({...this.question});
      this.close();
    }
  }
}