import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { McqService } from '../../services/mcq.service'; // Import the service

@Component({
  selector: 'app-mcq-section',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="mcq-container">
      <h2>Multiple Choice Questions</h2>
      @for (question of questions; track question.id) {
        <div class="question-card">
          <h3>Question {{ question.id }}</h3>
          <p>{{ question.problemStatement }}</p>
          <div class="options">
            @for (option of question.options; track option.id; let i = $index) {
              <div class="option">
                <input 
                  type="radio" 
                  [id]="'q' + question.id + 'o' + option.id"
                  [name]="'question' + question.id"
                  [(ngModel)]="selectedAnswers[question.id]"
                  [value]="option.id"
                  (change)="onOptionChange(question.id, option.id)"
                >
                <label [for]="'q' + question.id + 'o' + option.id">{{ option.optionText }}</label>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
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
export class McqSectionComponent implements OnInit {
  questions: any[] = [];
  selectedAnswers: { [key: number]: number } = {};

  constructor(private mcqService: McqService) {} // Inject the service

  ngOnInit(): void {
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    const assessmentId = 1; // Replace with dynamic assessment ID if needed
    const sectionId = 1; // Replace with dynamic section ID if needed

    this.mcqService.fetchQuestions(assessmentId, sectionId).subscribe(
      (response) => {
        if (response.code === 200 && response.status === 'SUCCESS') {
          this.questions = response.data.map((item: any) => ({
            ...item.question,
            options: item.options
          }));
          this.loadAnswersFromLocalStorage();
        }
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  loadAnswersFromLocalStorage(): void {
    const savedAnswers = localStorage.getItem('mcqAnswers');
    if (savedAnswers) {
      this.selectedAnswers = JSON.parse(savedAnswers);
    }
  }

  onOptionChange(questionId: number, optionId: number): void {
    this.selectedAnswers[questionId] = optionId;
    // this.saveAnswerToServer(questionId, optionId);
    this.saveAnswersToLocalStorage();
  }

  saveAnswerToServer(questionId: number, optionId: number): void {
    this.mcqService.saveAnswer(questionId, optionId).subscribe(
      (response) => {
        console.log('Answer saved successfully:', response);
      },
      (error) => {
        console.error('Error saving answer:', error);
      }
    );
  }

  saveAnswersToLocalStorage(): void {
    localStorage.setItem('mcqAnswers', JSON.stringify(this.selectedAnswers));
  }

  onSubmit(): void {
    console.log('Submitted MCQ answers:', this.selectedAnswers);
    alert('MCQ answers submitted successfully!');
  }
}