import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { FeedbackService } from "../../services/feedback.service";
import { Feedback } from "../../models/feedback.model";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-feedback",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [FeedbackService], // Add FeedbackService to providers
  template: `
    <div class="feedback-container">
      <div class="feedback-card">
        <div class="feedback-header">
          <h2>How was your experience?</h2>
        </div>

        <div class="feedback-content" *ngIf="!submitted; else successMessage">
          <div class="rating-section">
            <h3>Rate your experience</h3>
            <div class="rating-container">
              <div
                *ngFor="let star of [1, 2, 3, 4, 5]"
                class="star"
                [class.active]="feedback.rating >= star"
                (click)="setRating(star)"
              >
                ★
              </div>
            </div>
            <div class="rating-text" [class.visible]="feedback.rating > 0">
              {{ getRatingText() }}
            </div>
          </div>

          <div class="form-group">
            <label for="feedbackText">Share your thoughts</label>
            <textarea
              id="feedbackText"
              [(ngModel)]="feedback.feedbackText"
              class="form-control"
              rows="4"
              placeholder="Tell us what you liked or how we can improve..."
              required
            ></textarea>
          </div>

          <button
            (click)="submitFeedback()"
            [disabled]="isSubmitting || !isFormValid()"
            class="submit-btn"
            [class.disabled]="!isFormValid()"
          >
            <span *ngIf="!isSubmitting">Submit Feedback</span>
            <span *ngIf="isSubmitting" class="loading-spinner"></span>
          </button>

          <div *ngIf="errorMessage" class="error-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ errorMessage }}
          </div>
        </div>

        <ng-template #successMessage>
          <div class="success-message">
            <div class="success-icon">✓</div>
            <h3>Thank you for your feedback!</h3>
            <p>Your input helps us improve our assessments.</p>
            <button (click)="resetForm()" class="reset-btn">
              Submit Another Feedback
            </button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .feedback-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      .feedback-card {
        width: 100%;
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: all 0.3s ease;
        border-left: 5px solid #4caf50;
      }

      .feedback-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      }

      .feedback-header {
        padding: 1.5rem 2rem;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
      }

      .feedback-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .feedback-content {
        padding: 2rem;
      }

      h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        font-weight: 500;
      }

      .rating-section {
        margin-bottom: 2rem;
        text-align: center;
      }

      .rating-container {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 10px;
      }

      .star {
        font-size: 40px;
        cursor: pointer;
        color: #e9ecef;
        transition: all 0.2s ease;
      }

      .star:hover {
        transform: scale(1.1);
        color: #ffd700;
      }

      .star.active {
        color: #ffd700;
      }

      .rating-text {
        height: 24px;
        color: #4caf50;
        font-weight: 500;
        margin-top: 10px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }

      .rating-text.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .form-group {
        margin-bottom: 2rem;
      }

      label {
        display: block;
        margin-bottom: 0.75rem;
        font-weight: 500;
        color: #2c3e50;
        font-size: 1.2rem;
      }

      .form-control {
        width: 100%;
        padding: 1rem;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background-color: #f8f9fa;
      }

      .form-control:focus {
        outline: none;
        border-color: #4caf50;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
        background-color: #fff;
      }

      textarea.form-control {
        resize: vertical;
        min-height: 120px;
      }

      .submit-btn,
      .reset-btn {
        display: block;
        width: 100%;
        padding: 1rem;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.25);
      }

      .submit-btn:hover,
      .reset-btn:hover {
        background: linear-gradient(90deg, #43a047, #7cb342);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(76, 175, 80, 0.35);
      }

      .submit-btn:active,
      .reset-btn:active {
        transform: translateY(0);
      }

      .submit-btn.disabled {
        background: #e0e0e0;
        color: #9e9e9e;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .error-message {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #e53935;
        margin-top: 1rem;
        padding: 1rem;
        background-color: #ffebee;
        border-radius: 12px;
        font-size: 0.9rem;
        border-left: 4px solid #e53935;
      }

      .success-message {
        text-align: center;
        padding: 3rem 2rem;
      }

      .success-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        border-radius: 50%;
        font-size: 40px;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        animation: scaleIn 0.5s ease-out;
      }

      .success-message h3 {
        color: #4caf50;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .success-message p {
        color: #6c757d;
        margin-bottom: 2rem;
        font-size: 1rem;
      }

      .reset-btn {
        max-width: 300px;
        margin: 0 auto;
      }

      @keyframes scaleIn {
        from {
          transform: scale(0);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* Responsive Styles */
      @media (max-width: 768px) {
        .feedback-container {
          padding: 1rem;
        }

        .feedback-header {
          padding: 1.25rem;
        }

        .feedback-content {
          padding: 1.5rem;
        }

        .star {
          font-size: 32px;
        }
      }

      @media (max-width: 480px) {
        .feedback-header h2 {
          font-size: 1.25rem;
        }

        h3 {
          font-size: 1rem;
        }

        .star {
          font-size: 28px;
          gap: 10px;
        }

        .submit-btn,
        .reset-btn {
          padding: 0.75rem;
        }
      }
    `,
  ],
})
export class FeedbackComponent {
  feedback: Feedback = {
    assessmentId: 1, // Default value, can be set from a service or route parameter
    feedbackText: "",
    rating: 0,
    email: "john.doe@example.com",
  };

  isSubmitting = false;
  submitted = false;
  errorMessage = "";

  constructor(private feedbackService: FeedbackService) {}

  setRating(rating: number): void {
    this.feedback.rating = rating;
  }

  getRatingText(): string {
    switch (this.feedback.rating) {
      case 0:
        return "";
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  }

  submitFeedback(): void {
    if (!this.isFormValid()) {
      this.errorMessage = "Please provide both a rating and feedback text.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = "";

    this.feedbackService.submitFeedback(this.feedback).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitted = true;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          "An error occurred while submitting your feedback. Please try again.";
        console.error("Error submitting feedback:", error);
      },
    });
  }

  resetForm(): void {
    this.feedback = {
      assessmentId: 1, // Maintain the same default values
      rating: 0,
      feedbackText: "h",
      email: "john.doe@example.com",
    };
    this.submitted = false;
    this.errorMessage = "";
  }

  isFormValid(): boolean {
    return (
      this.feedback.feedbackText.trim().length > 0 && this.feedback.rating > 0
    );
  }
}
