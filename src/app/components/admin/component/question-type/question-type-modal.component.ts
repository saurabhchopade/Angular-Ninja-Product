import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type QuestionTypeOption = 'programming' | 'fullstack' | 'subjective' | 'mcq';

@Component({
  selector: 'app-question-type-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isVisible"
      class="fixed inset-0 bg-black/30 z-40 flex justify-end"
      (click)="close()"
    >
      <div 
        class="w-full max-w-lg bg-white shadow-2xl h-full transform transition-transform duration-300"
        [class.translate-x-0]="isVisible"
        [class.translate-x-full]="!isVisible"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-xl font-semibold text-gray-800">Select Question Type</h2>
          <button 
            (click)="close()" 
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-4">
          <div class="grid grid-cols-1 gap-3">
            <button *ngFor="let option of questionTypes"
                    (click)="selectType(option.type)"
                    class="flex items-center p-3 border rounded-lg hover:border-green-500 hover:bg-green-500/5 transition-all group"
                    [class.border-green-500]="selectedType === option.type"
                    [class.bg-green-500]="selectedType === option.type">
              <span class="material-icons text-xl mr-3 text-gray-600 group-hover:text-green-500"
                    [class.text-green-500]="selectedType === option.type">
                {{option.icon}}
              </span>
              <div class="text-left">
                <h3 class="font-medium text-gray-800">{{option.label}}</h3>
                <p class="text-sm text-gray-600">{{option.description}}</p>
              </div>
            </button>
          </div>

          <div class="mt-4 flex justify-end">
            <button 
              (click)="proceed()"
              [disabled]="!selectedType"
              class="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuestionTypeModalComponent {
  @Output() typeSelected = new EventEmitter<QuestionTypeOption>();
  @Output() closed = new EventEmitter<void>();

  isVisible = false;
  selectedType: QuestionTypeOption | null = null;

  questionTypes = [
    {
      type: 'programming' as QuestionTypeOption,
      label: 'Programming',
      icon: 'code',
      description: 'Create coding challenges with automated test cases'
    },
    {
      type: 'fullstack' as QuestionTypeOption,
      label: 'Full Stack',
      icon: 'layers',
      description: 'Design comprehensive full-stack development tasks'
    },
    {
      type: 'subjective' as QuestionTypeOption,
      label: 'Subjective',
      icon: 'edit_note',  // Added missing icon
      description: 'Open-ended questions for detailed written responses'
    },
    {
      type: 'mcq' as QuestionTypeOption,
      label: 'Multiple Choice Questions',
      icon: 'check_circle',
      description: 'Create multiple choice questions with options'
    }
  ];

  show() {
    this.isVisible = true;
    this.selectedType = null;
  }

  close() {
    this.isVisible = false;
    this.closed.emit();
  }

  selectType(type: QuestionTypeOption) {
    this.selectedType = type;
  }

  proceed() {
    if (this.selectedType) {
      this.typeSelected.emit(this.selectedType);
      this.close();
    }
  }
}