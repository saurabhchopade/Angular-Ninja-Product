import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { QuestionService } from "../../services/subjective.question.service";
import { DropOffService } from "../../services/dropoff.subjective.service";

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
  selector: "app-subjective-section",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="subjective-container">
      <div class="sticky-header">
        <div class="subjective-header">
          <!-- <h2>Subjective Questions</h2> -->
          @if (!loading && questions.length > 0) {
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  [style.width]="getProgressPercentage() + '%'"
                ></div>
              </div>
              <span class="progress-text"
                >{{ getAnsweredCount() }} of
                {{ questions.length }} answered</span
              >
            </div>
          }
        </div>
      </div>

      <div class="subjective-content">
        @if (loading) {
          <!-- Enhanced Skeleton Loader -->
          <div class="skeleton-loader">
            @for (i of [1, 2]; track i) {
              <div class="skeleton-question-card">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-textarea"></div>
              </div>
            }
          </div>
        } @else if (submitting) {
          <!-- Submission Loading State -->
          <div class="submission-state">
            <div class="spinner"></div>
            <p>Submitting your answers...</p>
          </div>
        } @else if (submitted) {
          <!-- Success State -->
          <div class="success-state">
            <div class="success-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Answers Submitted Successfully!</h3>
            <p>Thank you for completing the Subjective section.</p>
          </div>
        } @else {
          <!-- Actual Subjective Content -->
          @for (
            question of questions;
            track question.questionId;
            let i = $index
          ) {
            <div
              class="question-card"
              [class.answered]="isQuestionAnswered(question.questionId)"
            >
              <div class="question-header">
                <span class="question-number">Question {{ i + 1 }}</span>
                @if (isQuestionAnswered(question.questionId)) {
                  <span class="answered-badge">Answered</span>
                }
              </div>
              <p class="question-text">{{ question.problemStatement }}</p>
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
                  <div
                    class="word-count"
                    [class.word-limit-exceeded]="
                      wordCounts[question.questionId] > question.maxWords
                    "
                  >
                    Words: {{ wordCounts[question.questionId] || 0 }}/{{
                      question.maxWords
                    }}
                  </div>
                }
              </div>
            </div>
          }
          <button
            class="submit-btn"
            (click)="onSubmit()"
            [disabled]="getAnsweredCount() === 0"
            [class.disabled]="getAnsweredCount() === 0"
          >
            Submit Subjective Answers
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .subjective-container {
        max-width: 1200px; /* Increased width for wider question boxes */
        margin: 0 auto;
        padding: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        position: relative;
      }

      .sticky-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: #fff;
        padding: 0.45rem 0.6rem; /* Reduced by 70% from 1.5rem 2rem */
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
        border-bottom: 1px solid #e9ecef;
        border-radius: 12px; /* Added rounded corners */
        margin: 0.5rem; /* Added margin to create space around the sticky header */
      }

      .subjective-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px; /* Added rounded corners */
        padding: 0.5rem; /* Added padding for better spacing */
      }

      .subjective-content {
        padding: 2rem;
        flex: 1;
      }

      .subjective-header h2 {
        font-size: 1.2rem; /* Reduced by 70% from 2rem */
        color: #2c3e50;
        margin-bottom: 0; /* Removed margin */
        font-weight: 600;
      }

      .progress-container {
        width: 100%;
        background-color: #ffffff; /* White background for the outer container */
        border-radius: 12px; /* Rounded corners for the outer container */
        padding: 0.75rem; /* Add some padding inside the container */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
      }

      .progress-bar {
        height: 6px; /* Reduced by 70% from 12px */
        background-color: #e9ecef;
        border-radius: 10px; /* Rounded corners for the progress bar */
        overflow: hidden;
        margin-bottom: 0.2rem; /* Reduced from 0.75rem */
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        border-radius: 10px; /* Match parent's border-radius */
        transition: width 0.3s ease;
      }

      .progress-text {
        font-size: 0.7rem; /* Reduced from 1rem */
        color: #6c757d;
        font-weight: 500;
        display: block;
        text-align: right;
        padding-right: 0.15rem; /* Reduced from 0.5rem */
      }

      .question-card {
        background: white;
        border-radius: 16px; /* More rounded corners */
        padding: 2.5rem; /* Increased padding for more spacious look */
        margin-bottom: 2.5rem; /* Increased margin for better separation */
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        border-left: 5px solid #e9ecef;
        width: 100%; /* Ensure full width */
      }

      .question-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      }

      .question-card.answered {
        border-left: 5px solid #4caf50;
      }

      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
      }

      .question-number {
        font-weight: 600;
        color: #2c3e50;
        font-size: 1.3rem;
      }

      .answered-badge {
        background-color: #e8f5e9;
        color: #4caf50;
        padding: 0.35rem 1rem;
        border-radius: 30px; /* More rounded */
        font-size: 0.9rem;
        font-weight: 500;
      }

      .question-text {
        font-size: 1.3rem;
        line-height: 1.7;
        color: #2c3e50;
        margin-bottom: 1.5rem;
      }

      .word-limit {
        color: #6c757d;
        font-style: italic;
        margin-bottom: 1rem;
        font-size: 0.95rem;
      }

      .answer-box {
        margin-top: 1.25rem;
      }

      .answer-box textarea {
        width: 100%;
        padding: 1.25rem;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        resize: vertical;
        min-height: 180px;
        font-size: 1.1rem;
        line-height: 1.6;
        color: #495057;
        transition: all 0.2s ease;
      }

      .answer-box textarea:focus {
        outline: none;
        border-color: #4caf50;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
      }

      .word-count {
        text-align: right;
        color: #6c757d;
        margin-top: 0.75rem;
        font-size: 0.9rem;
      }

      .word-limit-exceeded {
        color: #dc3545;
        font-weight: 500;
      }

      .submit-btn {
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        padding: 1.5rem 2.5rem;
        border: none;
        border-radius: 12px; /* More rounded */
        cursor: pointer;
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 2.5rem;
        width: 100%;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.25);
      }

      .submit-btn:hover {
        background: linear-gradient(90deg, #43a047, #7cb342);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(76, 175, 80, 0.35);
      }

      .submit-btn.disabled {
        background: #e0e0e0;
        color: #9e9e9e;
        cursor: not-allowed;
        box-shadow: none;
      }

      .submit-btn.disabled:hover {
        transform: none;
      }

      /* Enhanced Skeleton Loader Styles */
      .skeleton-loader {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }

      .skeleton-question-card {
        background: white;
        border-radius: 16px; /* More rounded */
        padding: 2.5rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        animation: pulse 1.5s infinite ease-in-out;
      }

      .skeleton-title {
        height: 28px;
        width: 40%;
        background: #e0e0e0;
        border-radius: 6px;
        margin-bottom: 1.25rem;
      }

      .skeleton-text {
        height: 20px;
        width: 90%;
        background: #e0e0e0;
        border-radius: 6px;
        margin-bottom: 2rem;
      }

      .skeleton-textarea {
        height: 180px;
        width: 100%;
        background: #e0e0e0;
        border-radius: 12px;
      }

      /* Submission and Success States */
      .submission-state,
      .success-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 5rem;
        background: white;
        border-radius: 16px; /* More rounded */
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        margin: 2.5rem 0;
      }

      .spinner {
        width: 70px;
        height: 70px;
        border: 6px solid rgba(76, 175, 80, 0.2);
        border-left-color: #4caf50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 2rem;
      }

      .success-icon {
        color: #4caf50;
        margin-bottom: 2rem;
        animation: scaleIn 0.5s ease-out;
      }

      .success-state h3 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 1rem;
      }

      .success-state p {
        color: #6c757d;
        font-size: 1.2rem;
      }

      /* Animations */
      @keyframes pulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.6;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes scaleIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }

      /* Responsive Styles */
      @media (max-width: 768px) {
        .subjective-container {
          padding: 0;
        }

        .sticky-header {
          padding: 0.4rem;
        }

        .subjective-content {
          padding: 1.25rem;
        }

        .question-card {
          padding: 1.75rem;
          border-radius: 14px;
        }

        .answer-box textarea {
          padding: 1rem;
        }

        .submit-btn {
          padding: 1.25rem 1.75rem;
          border-radius: 10px;
        }
      }

      @media (max-width: 480px) {
        .subjective-header h2 {
          font-size: 1rem;
        }

        .question-text {
          font-size: 1.1rem;
        }

        .progress-bar {
          height: 4px;
        }

        .answer-box textarea {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class SubjectiveSectionComponent implements OnInit, OnDestroy {
  questions: SubjectiveQuestion[] = [];
  answers: { [key: number]: string } = {};
  wordCounts: { [key: number]: number } = {};
  loading: boolean = true;
  submitting: boolean = false;
  submitted: boolean = false;
  private dropOffIntervals: { [key: number]: any } = {};

  constructor(
    private questionService: QuestionService,
    private dropOffService: DropOffService,
  ) {}

  ngOnInit(): void {
    this.loadAnswersFromLocalStorage();
    this.fetchQuestions();
  }

  ngOnDestroy(): void {
    Object.values(this.dropOffIntervals).forEach((intervalId) =>
      clearInterval(intervalId),
    );
  }

  fetchQuestions(): void {
    const assessmentId = 4; // Replace with dynamic assessment ID if needed
    const candidateId = 4; // Replace with dynamic candidate ID if needed
    const sectionId = 5; // Replace with dynamic section ID if needed

    // Check if questions are available in local storage
    const cachedQuestions = localStorage.getItem("subjectiveQuestions");
    if (cachedQuestions) {
      this.questions = JSON.parse(cachedQuestions);
      this.loadAnswersFromLocalStorage();
      this.loading = false;
    } else {
      this.questionService
        .fetchSubjectiveQuestions(assessmentId, sectionId, candidateId)
        .subscribe({
          next: (response) => {
            if (response.code === 200) {
              this.questions = response.data;

              // Map dropOffAnswer to answers if it is not empty or null
              this.questions.forEach((question) => {
                if (
                  question.dropOffAnswer &&
                  question.dropOffAnswer.trim() !== ""
                ) {
                  this.answers[question.questionId] = question.dropOffAnswer;
                  this.updateWordCount(question.questionId); // Update word count for the mapped answer
                }
              });

              // Save questions to local storage for future use
              localStorage.setItem(
                "subjectiveQuestions",
                JSON.stringify(this.questions),
              );
            }
            this.loading = false;
          },
          error: (error) => {
            console.error("Error fetching subjective questions:", error);
            this.loading = false;
          },
        });
    }
  }

  loadAnswersFromLocalStorage(): void {
    const savedAnswers = localStorage.getItem("subjectiveAnswers");
    if (savedAnswers) {
      this.answers = JSON.parse(savedAnswers);
      // Update word counts for all loaded answers
      Object.keys(this.answers).forEach((key) => {
        this.updateWordCount(parseInt(key));
      });
    }
  }

  saveAnswersToLocalStorage(): void {
    localStorage.setItem("subjectiveAnswers", JSON.stringify(this.answers));
  }

  updateWordCount(questionId: number): void {
    const answer = this.answers[questionId] || "";
    this.wordCounts[questionId] = answer
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    this.saveAnswersToLocalStorage();
  }

  isQuestionAnswered(questionId: number): boolean {
    return (
      this.answers[questionId] !== undefined &&
      this.answers[questionId].trim() !== "" &&
      this.wordCounts[questionId] > 0
    );
  }

  getAnsweredCount(): number {
    return Object.keys(this.answers).filter(
      (key) =>
        this.answers[parseInt(key)] &&
        this.answers[parseInt(key)].trim() !== "",
    ).length;
  }

  getProgressPercentage(): number {
    if (this.questions.length === 0) return 0;
    return (this.getAnsweredCount() / this.questions.length) * 100;
  }

  startDropOffPush(questionId: number): void {
    const assessmentId = 4; // Replace with dynamic assessment ID if needed
    const candidateId = 4; // Replace with dynamic candidate ID if needed
    const sectionId = 5; // Replace with dynamic section ID if needed
    const candidateAssessmentSessionId = 1;

    // Start periodic push every 20 seconds
    this.dropOffIntervals[questionId] = setInterval(() => {
      const answer = this.answers[questionId] || "";
      if (answer.trim() !== "") {
        this.dropOffService
          .pushDropOffAnswer(
            questionId,
            assessmentId,
            sectionId,
            candidateId,
            answer,
            candidateAssessmentSessionId,
          )
          .subscribe({
            next: (response) => {
              console.log("Drop-off answer pushed:", response);
            },
            error: (error) => {
              console.error("Error pushing drop-off answer:", error);
            },
          });
      }
    }, 20000);
  }

  stopDropOffPush(questionId: number): void {
    // Clear the interval for the current question
    if (this.dropOffIntervals[questionId]) {
      clearInterval(this.dropOffIntervals[questionId]);
      delete this.dropOffIntervals[questionId];
    }

    // Push the answer immediately when the user leaves the textarea
    const assessmentId = 4; // Replace with dynamic assessment ID if needed
    const candidateId = 4; // Replace with dynamic candidate ID if needed
    const sectionId = 5; // Replace with dynamic section ID if needed
    const candidateAssessmentSessionId = 1;

    const answer = this.answers[questionId] || "";

    if (answer.trim() !== "") {
      this.dropOffService
        .pushDropOffAnswer(
          questionId,
          assessmentId,
          sectionId,
          candidateId,
          answer,
          candidateAssessmentSessionId,
        )
        .subscribe({
          next: (response) => {
            console.log("Drop-off answer pushed immediately:", response);
          },
          error: (error) => {
            console.error("Error pushing drop-off answer:", error);
          },
        });
    }
  }

  onSubmit(): void {
    if (this.getAnsweredCount() === 0) return;

    this.submitting = true;

    // Push all answers one last time
    const assessmentId = 4; // Replace with dynamic assessment ID if needed
    const candidateId = 4; // Replace with dynamic candidate ID if needed
    const sectionId = 5; // Replace with dynamic section ID if needed
    const candidateAssessmentSessionId = 1;

    const pushPromises = Object.keys(this.answers)
      .filter(
        (key) =>
          this.answers[parseInt(key)] &&
          this.answers[parseInt(key)].trim() !== "",
      )
      .map((key) => {
        const questionId = parseInt(key);
        const answer = this.answers[questionId];
        return this.dropOffService
          .pushDropOffAnswer(
            questionId,
            assessmentId,
            sectionId,
            candidateId,
            answer,
            candidateAssessmentSessionId,
          )
          .toPromise();
      });

    // Simulate submission delay
    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
      console.log("Submitted subjective answers:", this.answers);
    }, 1500);
  }
}
