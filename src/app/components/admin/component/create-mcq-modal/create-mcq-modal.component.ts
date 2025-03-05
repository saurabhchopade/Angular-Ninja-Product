import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCQQuestion, MCQOption } from '../../types/mcq-question.type';

@Component({
  selector: 'app-create-mcq-modal',
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
          <h2 class="text-xl font-semibold text-gray-800">Create Multiple Choice Question</h2>
          <button 
            (click)="close()" 
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6 h-[calc(100%-200px)] overflow-y-auto">
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

            <!-- Question Editor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Question</label>
              <div class="border rounded-lg">
                <!-- Rich Text Toolbar -->
                <div class="flex items-center gap-1 p-2 border-b bg-gray-50">
                  <button *ngFor="let tool of editorTools"
                          class="p-1.5 rounded hover:bg-gray-200 transition-colors"
                          [title]="tool.label">
                    <span class="material-icons text-gray-600 text-lg">{{tool.icon}}</span>
                  </button>
                </div>
                <!-- Editor Area -->
                <textarea
                  [(ngModel)]="question.question"
                  rows="6"
                  class="w-full p-3 focus:outline-none"
                  placeholder="Enter your question here..."
                ></textarea>
              </div>
            </div>

            <!-- Answer Options -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <label class="block text-sm font-medium text-gray-700">Answer Options</label>
                <button 
                  (click)="addOption()"
                  class="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Add Option
                </button>
              </div>

              <!-- Multiple Answer Toggle -->
              <div class="flex items-center mb-4">
                <input
                  type="checkbox"
                  [(ngModel)]="question.allowMultipleAnswers"
                  id="multiple-answers"
                  class="rounded text-green-500 focus:ring-green-500"
                >
                <label for="multiple-answers" class="ml-2 text-sm text-gray-600">
                  Allow multiple correct answers
                </label>
              </div>

              <!-- Options List -->
              <div class="space-y-3">
                <div *ngFor="let option of question.options; let i = index" 
                     class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <input
                    [type]="question.allowMultipleAnswers ? 'checkbox' : 'radio'"
                    [(ngModel)]="option.isCorrect"
                    [name]="'option-group'"
                    class="text-green-500 focus:ring-green-500"
                    [class.rounded-full]="!question.allowMultipleAnswers"
                    [class.rounded]="question.allowMultipleAnswers"
                  >
                  <input
                    type="text"
                    [(ngModel)]="option.text"
                    class="flex-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    [placeholder]="'Option ' + (i + 1)"
                  >
                  <button 
                    (click)="removeOption(i)"
                    class="text-red-500 hover:text-red-700 p-1">
                    <span class="material-icons">close</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Scoring Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Score</label>
                <input
                  type="number"
                  [(ngModel)]="question.maxScore"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Negative Score</label>
                <input
                  type="number"
                  [(ngModel)]="question.negativeScore"
                  class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                >
              </div>
            </div>

            <!-- Partial Scoring Toggle -->
            <div class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="question.enablePartialScoring"
                id="partial-scoring"
                class="rounded text-green-500 focus:ring-green-500"
              >
              <label for="partial-scoring" class="ml-2 text-sm text-gray-600">
                Enable partial scoring
              </label>
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

        <!-- Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center">
          <button 
            (click)="saveDraft()"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Save as Draft
          </button>
          <div class="flex gap-2">
            <button 
              (click)="close()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
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
export class CreateMCQModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() published = new EventEmitter<MCQQuestion>();
  @Output() drafted = new EventEmitter<MCQQuestion>();

  isVisible = false;
  difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];
  newTag = '';

  editorTools = [
    { icon: 'format_bold', label: 'Bold' },
    { icon: 'format_italic', label: 'Italic' },
    { icon: 'format_underlined', label: 'Underline' },
    { icon: 'subscript', label: 'Subscript' },
    { icon: 'superscript', label: 'Superscript' },
    { icon: 'functions', label: 'Equation' },
    { icon: 'format_list_bulleted', label: 'Bullet List' },
    { icon: 'format_list_numbered', label: 'Numbered List' },
    { icon: 'format_align_left', label: 'Align Left' },
    { icon: 'format_align_center', label: 'Align Center' },
    { icon: 'format_align_right', label: 'Align Right' }
  ];

  question: MCQQuestion = {
    difficulty: 'Basic',
    question: '',
    options: [],
    allowMultipleAnswers: false,
    enablePartialScoring: false,
    maxScore: 10,
    negativeScore: 0,
    tags: []
  };

  show() {
    this.isVisible = true;
    if (this.question.options.length === 0) {
      this.addOption();
      this.addOption();
    }
  }

  close() {
    this.isVisible = false;
    this.closed.emit();
    this.resetForm();
  }

  resetForm() {
    this.question = {
      difficulty: 'Basic',
      question: '',
      options: [],
      allowMultipleAnswers: false,
      enablePartialScoring: false,
      maxScore: 10,
      negativeScore: 0,
      tags: []
    };
    this.newTag = '';
  }

  addOption() {
    this.question.options.push({
      id: crypto.randomUUID(),
      text: '',
      isCorrect: false
    });
  }

  removeOption(index: number) {
    this.question.options.splice(index, 1);
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

  get isComplete(): boolean {
    return this.question.question.trim() !== '' && 
           this.question.options.length >= 2 &&
           this.question.options.every(opt => opt.text.trim() !== '') &&
           this.question.options.some(opt => opt.isCorrect) &&
           this.question.maxScore > 0;
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