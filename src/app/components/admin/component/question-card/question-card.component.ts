import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionType } from '../../types/question.type';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-semibold text-gray-800">{{question.title}}</h3>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Score: {{question.score}}
        </span>
      </div>
      <p class="text-gray-600 mb-4">{{question.description}}</p>
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let tech of question.technologies" 
                class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
            {{tech}}
          </span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let category of question.categories" 
                class="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-sm">
            {{category}}
          </span>
        </div>
        <span [class]="getDifficultyClass()">
          {{question.difficulty}}
        </span>
      </div>
    </div>
  `
})
export class QuestionCardComponent {
  @Input() question!: QuestionType;

  getDifficultyClass(): string {
    const baseClasses = 'inline-block px-3 py-1 rounded-full text-sm ';
    switch (this.question.difficulty) {
      case 'Basic': return baseClasses + 'bg-green-100 text-green-800';
      case 'Intermediate': return baseClasses + 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return baseClasses + 'bg-red-100 text-red-800';
      default: return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }
}