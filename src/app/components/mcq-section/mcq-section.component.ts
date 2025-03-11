import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { McqService } from "../../services/mcq.service"; // Existing service
import { McqAnswerService } from "../../services/dropoff.push.mcq.service"; // New service

@Component({
  selector: "app-mcq-section",
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="mcq-container">
      <div class="sticky-header">
        <div class="mcq-header">
          <!-- <h2>Multiple Choice Questions</h2> -->
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

      <div class="mcq-content">
        @if (loading) {
          <!-- Enhanced Skeleton Loader -->
          <div class="skeleton-loader">
            @for (i of [1, 2, 3]; track i) {
              <div class="skeleton-question-card">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-options">
                  @for (j of [1, 2, 3, 4]; track j) {
                    <div class="skeleton-option"></div>
                  }
                </div>
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
            <p>Thank you for completing the MCQ section.</p>
          </div>
        } @else {
          <!-- Actual MCQ Content -->
          @for (question of questions; track question.id; let qIndex = $index) {
            <div
              class="question-card"
              [class.answered]="selectedAnswers[question.id] !== undefined"
            >
              <div class="question-header">
                <span class="question-number">Question {{ qIndex + 1 }}</span>
                @if (selectedAnswers[question.id] !== undefined) {
                  <span class="answered-badge">Answered</span>
                }
              </div>
              <p class="question-text">{{ question.problemStatement }}</p>
              <div class="options">
                @for (
                  option of question.options;
                  track option.id;
                  let i = $index
                ) {
                  <div
                    class="option"
                    [class.selected]="
                      selectedAnswers[question.id] === option.id
                    "
                  >
                    <input
                      type="radio"
                      [id]="'q' + question.id + 'o' + option.id"
                      [name]="'question' + question.id"
                      [(ngModel)]="selectedAnswers[question.id]"
                      [value]="option.id"
                      (change)="onOptionChange(question.id, option.id)"
                    />
                    <label [for]="'q' + question.id + 'o' + option.id">
                      <span class="option-marker">{{
                        ["A", "B", "C", "D", "E", "F"][i]
                      }}</span>
                      <span class="option-text">{{ option.optionText }}</span>
                    </label>
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
            Submit MCQ Answers
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .mcq-container {
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

      .mcq-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px; /* Added rounded corners */
        padding: 0.5rem; /* Added padding for better spacing */
      }

      .mcq-content {
        padding: 2rem;
        flex: 1;
      }

      .mcq-header h2 {
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
        margin-bottom: 2rem;
      }

      .options {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .option {
        position: relative;
        border-radius: 12px; /* More rounded */
        transition: all 0.2s ease;
        border: 1px solid #e9ecef;
      }

      .option:hover {
        background-color: #f8f9fa;
      }

      .option.selected {
        background-color: #e8f5e9;
        border-color: #4caf50;
      }

      .option input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }

      .option label {
        display: flex;
        align-items: center;
        padding: 1.5rem; /* Increased padding */
        cursor: pointer;
        width: 100%;
        font-size: 1.15rem;
        color: #495057;
      }

      .option-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        background-color: #f1f3f5;
        border-radius: 50%;
        margin-right: 1.5rem;
        font-weight: 600;
        color: #495057;
        transition: all 0.2s ease;
      }

      .option.selected .option-marker {
        background-color: #4caf50;
        color: white;
      }

      .option-text {
        flex: 1;
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

      .skeleton-options {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .skeleton-option {
        height: 70px;
        width: 100%;
        background: #e0e0e0;
        border-radius: 12px; /* More rounded */
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
        .mcq-container {
          padding: 0;
        }

        .sticky-header {
          padding: 0.4rem;
        }

        .mcq-content {
          padding: 1.25rem;
        }

        .question-card {
          padding: 1.75rem;
          border-radius: 14px;
        }

        .option label {
          padding: 1.25rem;
        }

        .option-marker {
          width: 2.25rem;
          height: 2.25rem;
          margin-right: 1.25rem;
        }

        .submit-btn {
          padding: 1.25rem 1.75rem;
          border-radius: 10px;
        }
      }

      @media (max-width: 480px) {
        .mcq-header h2 {
          font-size: 1rem;
        }

        .question-text {
          font-size: 1.1rem;
        }

        .option-text {
          font-size: 1rem;
        }

        .progress-bar {
          height: 4px;
        }
      }
    `,
  ],
})
export class McqSectionComponent implements OnInit {
  questions: any[] = [];
  selectedAnswers: { [key: number]: number } = {}; // Stores the selected option ID for each question
  loading: boolean = true;
  submitting: boolean = false;
  submitted: boolean = false;

  constructor(
    private mcqService: McqService, // Existing service
    private mcqAnswerService: McqAnswerService, // New service
  ) {}

  ngOnInit(): void {
    //if something Going wrong remove below thing
    this.loadAnswersFromLocalStorage();
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    const assessmentId = 4; // Replace with dynamic assessment ID if needed
    const candidateId = 4; // Replace with dynamic candidate ID if needed
    const sectionId = 3; // Replace with dynamic section ID if needed

    // Check if questions are available in local storage
    const cachedQuestions = localStorage.getItem("mcqQuestions");
    if (cachedQuestions) {
      this.questions = JSON.parse(cachedQuestions);
      this.loadAnswersFromLocalStorage();
      this.loading = false; // Hide skeleton loader
    } else {
      // If not in local storage, make an API call
      this.mcqService
        .fetchQuestions(assessmentId, candidateId, sectionId)
        .subscribe(
          (response) => {
            if (response.code === 200 && response.status === "SUCCESS") {
              this.questions = response.data.map((item: any) => ({
                ...item.question,
                options: item.options,
              }));

              // Set the default selected answer based on "savedAnswer": true
              this.setDefaultSelectedAnswers();

              // Save questions to local storage for future use
              localStorage.setItem(
                "mcqQuestions",
                JSON.stringify(this.questions),
              );
              this.loadAnswersFromLocalStorage();
            }
            this.loading = false; // Hide skeleton loader
          },
          (error) => {
            console.error("Error fetching questions:", error);
            this.loading = false; // Hide skeleton loader even if there's an error
          },
        );
    }
  }

  setDefaultSelectedAnswers(): void {
    this.questions.forEach((question) => {
      const savedOption = question.options.find(
        (option: any) => option.savedAnswer === true,
      );
      if (savedOption) {
        this.selectedAnswers[question.id] = savedOption.id; // Set the saved option as selected
      }
    });
  }

  loadAnswersFromLocalStorage(): void {
    const savedAnswers = localStorage.getItem("mcqAnswers");
    if (savedAnswers) {
      this.selectedAnswers = JSON.parse(savedAnswers);
    }
  }

  onOptionChange(questionId: number, optionId: number): void {
    this.selectedAnswers[questionId] = optionId;
    this.saveAnswersToLocalStorage();
    this.pushAnswerToServer(questionId, optionId); // Push the updated answer to the server
  }

  saveAnswersToLocalStorage(): void {
    localStorage.setItem("mcqAnswers", JSON.stringify(this.selectedAnswers));
  }

  pushAnswerToServer(questionId: number, optionId: number): void {
    const assessmentId = 4; // Replace with dynamic assessment ID if needed
    const candidateId = 4; // Replace with dynamic candidate ID if needed
    const sectionId = 3; // Replace with dynamic section ID if needed
    const candidateAssessmentSessionId = 1;
    const answerData = {
      assessmentId,
      candidateId,
      sectionId,
      questionId,
      mcqOption: optionId,
      candidateAssessmentSessionId,
    };

    this.mcqAnswerService.addAnswer(answerData).subscribe({
      next: (response: any) => {
        console.log("Answer pushed successfully:", response);
      },
      error: (error: any) => {
        console.error("Error pushing answer:", error);
      },
    });
  }

  onSubmit(): void {
    if (this.getAnsweredCount() === 0) return;

    this.submitting = true;

    // Simulate submission delay
    setTimeout(() => {
      this.submitting = false;
      this.submitted = true;
      console.log("Submitted MCQ answers:", this.selectedAnswers);
    }, 1500);
  }

  getAnsweredCount(): number {
    return Object.keys(this.selectedAnswers).length;
  }

  getProgressPercentage(): number {
    if (this.questions.length === 0) return 0;
    return (this.getAnsweredCount() / this.questions.length) * 100;
  }
}
