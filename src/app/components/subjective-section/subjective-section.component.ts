import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuestionService } from '../../services/subjective.question.service';
import { DropOffService } from '../../services/dropoff.subjective.service';

// Define the SubjectiveQuestion model within the same file
interface SubjectiveQuestion {
  questionId: number;
  type: string;
  title: string;
  problemStatement: string;
  difficultyLevel: string;
  maxScore: number;
  visibility: string | null;
  aiEvaluationEnabled: boolean;
  evaluationMode: string | null;
  ruleId: number;
  mustInclude: string | null;
  optional: string | null;
  negativeKeywords: string | null;
  scoringWeights: string | null;
  expectedResponseFormat: string | null;
  minWords: number;
  maxWords: number;
  sampleAnswer: string | null;
  actualAnswer: string | null;
  evaluatedScore: number | null;
  dropOffAnswer: string;
}

@Component({
  selector: 'app-subjective-section',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="subjective-container">
      <h2>Subjective Questions</h2>
      @for (question of questions; track question.questionId; let i = $index) {
        <div class="question-card">
          <h3>Question {{ i + 1 }}</h3> <!-- Display series 1, 2, 3, 4 -->
          <p>{{ question.problemStatement }}</p>
          @if (question.maxWords) {
            <p class="word-limit">Maximum words: {{ question.maxWords }}</p>
          }
          <div class="answer-box">
            <textarea
              [(ngModel)]="answers[question.questionId]"
              placeholder="Write your answer here..."
              rows="6"
              (input)="updateWordCount(question.questionId)"
              (focus)="startDropOffPush(question.questionId)"
              (blur)="stopDropOffPush(question.questionId)"
            ></textarea>
            @if (question.maxWords) {
              <div class="word-count">
                Words: {{ wordCounts[question.questionId] || 0 }}/{{ question.maxWords }}
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
export class SubjectiveSectionComponent implements OnInit, OnDestroy {
  questions: SubjectiveQuestion[] = [];
  answers: { [key: number]: string } = {};
  wordCounts: { [key: number]: number } = {};
  private dropOffIntervals: { [key: number]: any } = {};

  constructor(
    private questionService: QuestionService,
    private dropOffService: DropOffService
  ) {}

  ngOnInit(): void {
    const assessmentId = 7;
    const sectionId = 7;
    const candidateId = 7;

    this.questionService.fetchSubjectiveQuestions(assessmentId, sectionId, candidateId).subscribe(response => {
      if (response.code === 200) {
        this.questions = response.data;

        // Map dropOffAnswer to answers if it is not empty or null
        this.questions.forEach(question => {
          if (question.dropOffAnswer && question.dropOffAnswer.trim() !== '') {
            this.answers[question.questionId] = question.dropOffAnswer;
            this.updateWordCount(question.questionId); // Update word count for the mapped answer
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    Object.values(this.dropOffIntervals).forEach(intervalId => clearInterval(intervalId));
  }

  updateWordCount(questionId: number) {
    const answer = this.answers[questionId] || '';
    this.wordCounts[questionId] = answer.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  startDropOffPush(questionId: number) {
    const assessmentId = 7;
    const sectionId = 7;
    const candidateId = 7;

    // Start periodic push every 10 seconds
    this.dropOffIntervals[questionId] = setInterval(() => {
      const answer = this.answers[questionId] || '';
      this.dropOffService.pushDropOffAnswer(questionId, assessmentId, sectionId, candidateId, answer).subscribe(response => {
        console.log('Drop-off answer pushed:', response);
      });
    }, 20000);
  }

  stopDropOffPush(questionId: number) {
    // Clear the interval for the current question
    if (this.dropOffIntervals[questionId]) {
      clearInterval(this.dropOffIntervals[questionId]);
      delete this.dropOffIntervals[questionId];
    }

    // Push the answer immediately when the user leaves the textarea
    const assessmentId = 7;
    const sectionId = 7;
    const candidateId = 7;
    const answer = this.answers[questionId] || '';

    if (answer.trim() !== '') {
      this.dropOffService.pushDropOffAnswer(questionId, assessmentId, sectionId, candidateId, answer).subscribe(response => {
        console.log('Drop-off answer pushed immediately:', response);
      });
    }
  }

  onSubmit() {
    console.log('Submitted subjective answers:', this.answers);
    // Here you can add logic to handle the submission
    alert('Subjective answers submitted successfully!');
  }
}