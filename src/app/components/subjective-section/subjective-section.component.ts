import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectiveQuestion } from '../../models/question.model';

@Component({
  selector: 'app-subjective-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="subjective-container">
      <h2>Subjective Questions</h2>
      @for (question of questions; track question.id) {
        <div class="question-card">
          <h3>Question {{ question.id }}</h3>
          <p>{{ question.question }}</p>
          @if (question.maxWords) {
            <p class="word-limit">Maximum words: {{ question.maxWords }}</p>
          }
          <div class="answer-box">
            <textarea
              [(ngModel)]="answers[question.id]"
              placeholder="Write your answer here..."
              rows="6"
              (input)="updateWordCount(question.id)"
            ></textarea>
            @if (question.maxWords) {
              <div class="word-count">
                Words: {{ wordCounts[question.id] || 0 }}/{{ question.maxWords }}
              </div>
            }
          </div>
        </div>
      }
      <button class="submit-btn" (click)="onSubmit()">Submit Subjective Answers</button>
    </div>
  `,
  styles: [`
    .subjective-container {
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

    .word-limit {
      color: #666;
      font-style: italic;
      margin-bottom: 10px;
    }

    .answer-box textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
    }

    .word-count {
      text-align: right;
      color: #666;
      margin-top: 5px;
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
      .subjective-container {
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
export class SubjectiveSectionComponent {
  questions: SubjectiveQuestion[] = [
    {
      id: 1,
      question: 'Explain the concept of dependency injection in Angular and its benefits.',
      maxWords: 200
    },
    {
      id: 2,
      question: 'Describe the differences between Angular and React frameworks.',
      maxWords: 300
    }
  ];

  answers: { [key: number]: string } = {};
  wordCounts: { [key: number]: number } = {};

  updateWordCount(questionId: number) {
    const answer = this.answers[questionId] || '';
    this.wordCounts[questionId] = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  onSubmit() {
    console.log('Submitted subjective answers:', this.answers);
    // Here you can add logic to handle the submission
    alert('Subjective answers submitted successfully!');
  }
}