import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { McqQuestion } from '../../models/question.model';

@Component({
  selector: 'app-mcq-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mcq-container">
      <h2>Multiple Choice Questions</h2>
      @for (question of questions; track question.id) {
        <div class="question-card">
          <h3>Question {{ question.id }}</h3>
          <p>{{ question.question }}</p>
          <div class="options">
            @for (option of question.options; track option; let i = $index) {
              <div class="option">
                <input 
                  type="radio" 
                  [id]="'q' + question.id + 'o' + i"
                  [name]="'question' + question.id"
                  [(ngModel)]="selectedAnswers[question.id]"
                  [value]="i"
                >
                <label [for]="'q' + question.id + 'o' + i">{{ option }}</label>
              </div>
            }
          </div>
        </div>
      }
      <button class="submit-btn" (click)="onSubmit()">Submit MCQ Answers</button>
    </div>
  `,
  styles: [`
    .mcq-container {
      max-width: 1200px; /* Increased max-width for better spacing */
      margin: 0 auto; /* Center the container */
      padding: 20px;
      min-height: 100vh; /* Ensure it takes the full height of the screen */
      display: flex;
      flex-direction: column;
      justify-content: center; /* Center content vertically */
    }

    .question-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .submit-btn {
      background: #4CAF50;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
      width: 100%;
      transition: background-color 0.3s;
    }

    .submit-btn:hover {
      background: #45a049;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .mcq-container {
        padding: 10px;
      }

      .question-card {
        padding: 15px;
      }

      .submit-btn {
        font-size: 14px;
        padding: 10px 20px;
      }
    }
  `]
})
export class McqSectionComponent {
  questions: McqQuestion[] = [
    {
      id: 1,
      question: 'What is Angular?',
      options: [
        'A JavaScript framework',
        'A database management system',
        'A programming language',
        'An operating system'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'Which decorator is used to define a component in Angular?',
      options: [
        '@NgModule',
        '@Component',
        '@Injectable',
        '@Directive'
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'What is the purpose of NgModule in Angular?',
      options: [
        'To handle HTTP requests',
        'To define a template',
        'To organize and bundle related components and services',
        'To style components'
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: 'Which of the following is used for two-way data binding in Angular?',
      options: [
        '[ ]',
        '( )',
        '{{ }}',
        '[(ngModel)]'
      ],
      correctAnswer: 3
    },
    {
      id: 5,
      question: 'What is the purpose of dependency injection in Angular?',
      options: [
        'To create new components',
        'To manage component lifecycle',
        'To provide required dependencies to classes',
        'To handle routing'
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: 'Which lifecycle hook is called after Angular initializes all data-bound properties?',
      options: [
        'ngOnInit',
        'ngAfterViewInit',
        'ngOnChanges',
        'ngDoCheck'
      ],
      correctAnswer: 0
    },
    {
      id: 7,
      question: 'What is the purpose of Angular CLI?',
      options: [
        'To write unit tests',
        'To create and manage Angular applications',
        'To deploy applications',
        'To debug applications'
      ],
      correctAnswer: 1
    }
  ];

  selectedAnswers: { [key: number]: number } = {};

  onSubmit() {
    console.log('Submitted MCQ answers:', this.selectedAnswers);
    // Here you can add logic to handle the submission
    alert('MCQ answers submitted successfully!');
  }
}