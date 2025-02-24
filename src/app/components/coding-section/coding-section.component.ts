import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodingQuestion } from '../../models/question.model';

@Component({
  selector: 'app-coding-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="coding-container">
      <h2>Coding Questions</h2>
      @for (question of questions; track question.id) {
        <div class="question-card">
          <h3>Question {{ question.id }}</h3>
          <div class="question-content">
            <p>{{ question.question }}</p>
            @if (question.sampleInput) {
              <div class="sample">
                <h4>Sample Input:</h4>
                <pre>{{ question.sampleInput }}</pre>
              </div>
            }
            @if (question.sampleOutput) {
              <div class="sample">
                <h4>Sample Output:</h4>
                <pre>{{ question.sampleOutput }}</pre>
              </div>
            }
          </div>
          <div class="code-editor">
            <textarea
              [(ngModel)]="answers[question.id]"
              placeholder="Write your code here..."
              rows="10"
            ></textarea>
          </div>
        </div>
      }
      <button class="submit-btn" (click)="onSubmit()">Submit Code Solutions</button>
    </div>
  `,
  styles: [`
    .coding-container {
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

    .question-content {
      margin-bottom: 20px;
    }

    .sample {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }

    .code-editor textarea {
      width: 100%;
      padding: 10px;
      font-family: monospace;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
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
      .coding-container {
        padding: 10px;
      }

      .question-card {
        padding: 15px;
      }

      .code-editor textarea {
        font-size: 14px;
      }

      .submit-btn {
        font-size: 14px;
        padding: 10px 20px;
      }
    }
  `]
})
export class CodingSectionComponent {
  questions: CodingQuestion[] = [
    {
      id: 1,
      question: 'Write a function that finds the sum of all numbers in an array.',
      sampleInput: '[1, 2, 3, 4, 5]',
      sampleOutput: '15'
    },
    {
      id: 2,
      question: 'Implement a function to check if a string is a palindrome.',
      sampleInput: '"racecar"',
      sampleOutput: 'true'
    }
  ];

  answers: { [key: number]: string } = {};

  onSubmit() {
    console.log('Submitted code solutions:', this.answers);
    // Here you can add logic to handle the submission
    alert('Code solutions submitted successfully!');
  }
}