import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionType } from '../../types/question.type';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <!-- Difficulty Strip -->
      <div [class]="getDifficultyStripClass()"></div>

      <!-- Content -->
      <div class="pl-4">
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
              {{question.title}}
            </h3>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let tech of question.technologies" 
                    class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">
                {{tech}}
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end ml-4">
            <span class="px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full text-sm font-medium whitespace-nowrap">
              Score: {{question.score}}
            </span>
            <span [class]="getDifficultyClass()" class="mt-2">
              {{question.difficulty}}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-600 text-sm leading-relaxed mb-4">
          {{question.description}}
        </p>

        <!-- Footer -->
        <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span *ngFor="let category of question.categories" 
                class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium border border-purple-100">
            {{category}}
          </span>
        </div>
      </div>
    </div>
  `
})
export class QuestionCardComponent {
  @Input() question!: QuestionType;

  getDifficultyStripClass(): string {
    const baseClasses = 'w-1.5 h-full absolute left-0 top-0 ';
    switch (this.question.difficulty) {
      case 'Basic': return baseClasses + 'bg-green-500';
      case 'Intermediate': return baseClasses + 'bg-yellow-500';
      case 'Advanced': return baseClasses + 'bg-red-500';
      default: return baseClasses + 'bg-gray-500';
    }
  }

  getDifficultyClass(): string {
    const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap border ';
    switch (this.question.difficulty) {
      case 'Basic': return baseClasses + 'bg-green-50 text-green-600 border-green-100';
      case 'Intermediate': return baseClasses + 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Advanced': return baseClasses + 'bg-red-50 text-red-600 border-red-100';
      default: return baseClasses + 'bg-gray-50 text-gray-600 border-gray-100';
    }
  }
}