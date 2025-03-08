import { Component, OnInit } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { InviteService } from "../../services/invite.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [InviteService],
  template: `
    <div class="page-container">
      <nav class="navbar">
        <div class="nav-brand">InterviewNinja</div>
      </nav>

      <div class="main-content">
        <div class="login-container">
          <div class="login-box">
            <div class="header-section">
              <h2>Start Your Test</h2>
              <p class="subtitle">Enter your email to begin</p>
            </div>

            <div *ngIf="testStartTime && testEndTime" class="test-time-info">
              <div
                class="time-badge"
                [class.active]="isTestActive"
                [class.upcoming]="isTestUpcoming"
                [class.expired]="isTestExpired"
              >
                <span class="status-icon">{{ getStatusIcon() }}</span>
                <span>{{ getTestStatusText() }}</span>
              </div>

              <div class="time-details">
                <div class="time-item">
                  <span class="time-label">Start:</span>
                  <span class="time-value">{{
                    formatDateTime(testStartTime)
                  }}</span>
                </div>
                <div class="time-item">
                  <span class="time-label">End:</span>
                  <span class="time-value">{{
                    formatDateTime(testEndTime)
                  }}</span>
                </div>
              </div>
            </div>

            <form
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
              class="login-form"
            >
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  placeholder="Enter your email"
                  [class.error]="
                    loginForm.get('email')?.invalid &&
                    loginForm.get('email')?.touched
                  "
                />
                <div
                  class="error-message"
                  *ngIf="
                    loginForm.get('email')?.invalid &&
                    loginForm.get('email')?.touched
                  "
                >
                  Please enter a valid email address
                </div>
              </div>

              <button
                type="button"
                (click)="startTest()"
                [disabled]="!loginForm.valid || !isTestActive"
                class="start-test-btn"
              >
                <span class="button-icon">🎯</span>
                <span class="button-text">Start Test</span>
              </button>

              <div
                *ngIf="!isTestActive && (isTestUpcoming || isTestExpired)"
                class="test-availability-message"
              >
                <p *ngIf="isTestUpcoming">
                  This test will be available starting
                  {{ formatDateTime(testStartTime) }}
                </p>
                <p *ngIf="isTestExpired">
                  This test expired on {{ formatDateTime(testEndTime) }}
                </p>
              </div>

              <div class="form-footer">
                <p>
                  By continuing, you agree to our
                  <a href="#">Terms of Service</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>

          <div class="features-section">
            <div class="feature-card">
              <span class="feature-icon">🏆</span>
              <h3>Test Your Skills</h3>
              <p>
                Showcase your coding expertise and tackle real-world challenges.
              </p>
            </div>
            <div class="feature-card">
              <span class="feature-icon">👥</span>
              <h3>Challenge Yourself</h3>
              <p>Go head-to-head with top coders.</p>
            </div>
            <div class="feature-card">
              <span class="feature-icon">🚀</span>
              <h3>Stay Focused</h3>
              <p>Take the test with confidence!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Global Container */
      .page-container {
        min-height: 100vh;
        background-color: #f8f9fa;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        flex-direction: column;
      }

      /* Navigation */
      .navbar {
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        padding: 1rem 3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        height: 64px;
      }

      .nav-brand {
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      /* Main content */
      .main-content {
        max-width: 1400px;
        width: 90%;
        margin: 0 auto;
        padding: 100px 0 3rem;
        flex: 1;
        display: flex;
        align-items: center;
      }

      .login-container {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 3rem;
        width: 100%;
        align-items: center;
      }

      .login-box {
        background: white;
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        max-width: 650px;
        width: 100%;
      }

      .header-section {
        text-align: center;
        margin-bottom: 2rem;
      }

      h2 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 0.75rem;
        font-weight: 700;
      }

      .subtitle {
        color: #6c757d;
        font-size: 1.25rem;
      }

      /* Test Time Info Styles */
      .test-time-info {
        background: #f8f9fa;
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border-left: 5px solid #4caf50;
      }

      .time-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 1.2rem;
        border-radius: 30px;
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 1rem;
        background: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }

      .time-badge.active {
        background: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }

      .time-badge.upcoming {
        background: rgba(33, 150, 243, 0.1);
        color: #2196f3;
      }

      .time-badge.expired {
        background: rgba(244, 67, 54, 0.1);
        color: #f44336;
      }

      .status-icon {
        font-size: 1.25rem;
      }

      .time-details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .time-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1rem;
      }

      .time-label {
        font-weight: 600;
        color: #495057;
        min-width: 60px;
      }

      .time-value {
        color: #6c757d;
      }

      /* Form styles */
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      label {
        font-weight: 500;
        color: #495057;
        font-size: 1.1rem;
      }

      input {
        padding: 1rem;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        font-size: 1.1rem;
        transition: all 0.2s;
      }

      input:focus {
        outline: none;
        border-color: #4caf50;
        box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
      }

      input.error {
        border-color: #e53935;
      }

      .error-message {
        color: #e53935;
        font-size: 0.95rem;
      }

      /* Test availability message */
      .test-availability-message {
        background: rgba(255, 152, 0, 0.1);
        border-left: 4px solid #ff9800;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 1rem;
        color: #e65100;
        margin-top: -0.5rem;
      }

      /* Button styles */
      .start-test-btn {
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 40px;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 6px 12px rgba(76, 175, 80, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin: 0.5rem 0;
      }

      .start-test-btn:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 8px 16px rgba(76, 175, 80, 0.35);
      }

      .start-test-btn:disabled {
        background: #e0e0e0;
        color: #9e9e9e;
        box-shadow: none;
        cursor: not-allowed;
      }

      .button-icon {
        font-size: 1.5rem;
      }

      /* Features section */
      .features-section {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 2rem;
      }

      .feature-card {
        background: white;
        padding: 2.5rem;
        border-radius: 20px;
        text-align: center;
        transition:
          transform 0.3s,
          box-shadow 0.3s;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
      }

      .feature-icon {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        display: inline-block;
      }

      .feature-card h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .feature-card p {
        color: #6c757d;
        font-size: 1.1rem;
        line-height: 1.6;
      }

      .form-footer {
        text-align: center;
        font-size: 1rem;
        color: #6c757d;
        margin-top: 1.5rem;
      }

      .form-footer a {
        color: #4caf50;
        text-decoration: none;
        font-weight: 500;
      }

      .form-footer a:hover {
        text-decoration: underline;
      }

      /* Responsive design */
      @media (max-width: 1200px) {
        .main-content {
          width: 95%;
          padding: 90px 0 2rem;
        }

        .login-container {
          gap: 2rem;
        }

        .login-box {
          padding: 2.5rem;
        }
      }

      @media (max-width: 992px) {
        .login-container {
          grid-template-columns: 1fr;
          max-width: 700px;
          margin: 0 auto;
        }

        .login-box {
          max-width: 100%;
        }

        .features-section {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (max-width: 768px) {
        .navbar {
          padding: 1rem 2rem;
        }

        .main-content {
          padding: 80px 0 1.5rem;
        }

        .features-section {
          grid-template-columns: 1fr;
        }

        h2 {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1.1rem;
        }

        .login-box {
          padding: 2rem;
        }
      }

      @media (max-width: 576px) {
        .navbar {
          padding: 0.75rem 1.5rem;
          height: 56px;
        }

        .nav-brand {
          font-size: 1.25rem;
        }

        .main-content {
          width: 92%;
          padding: 70px 0 1rem;
        }

        .login-box {
          padding: 1.5rem;
        }

        h2 {
          font-size: 1.75rem;
        }

        .subtitle {
          font-size: 1rem;
        }

        .feature-card {
          padding: 1.5rem;
        }

        .feature-icon {
          font-size: 2.5rem;
        }
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  testStartTime: Date | null = null;
  testEndTime: Date | null = null;
  isTestActive: boolean = false;
  isTestUpcoming: boolean = false;
  isTestExpired: boolean = false;
  currentTime: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private inviteService: InviteService,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    // Retrieve invite data from service
    const inviteData = this.inviteService.getInviteData();

    if (inviteData) {
      if (inviteData.startTime && inviteData.endTime) {
        this.testStartTime = new Date(inviteData.startTime);
        this.testEndTime = new Date(inviteData.endTime);
        this.updateTestStatus();
      }
    }

    // Update current time every minute
    setInterval(() => {
      this.currentTime = new Date();
      this.updateTestStatus();
    }, 60000);
  }

  updateTestStatus(): void {
    if (!this.testStartTime || !this.testEndTime) return;

    const now = this.currentTime;

    this.isTestActive = now >= this.testStartTime && now <= this.testEndTime;
    this.isTestUpcoming = now < this.testStartTime;
    this.isTestExpired = now > this.testEndTime;
  }

  getStatusIcon(): string {
    if (this.isTestActive) return "✅";
    if (this.isTestUpcoming) return "⏳";
    if (this.isTestExpired) return "⛔";
    return "❓";
  }

  getTestStatusText(): string {
    if (this.isTestActive) return "Test Active";
    if (this.isTestUpcoming) return "Test Upcoming";
    if (this.isTestExpired) return "Test Expired";
    return "Unknown Status";
  }

  formatDateTime(date: Date | null): string {
    if (!date) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleDateString("en-US", options);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.startTest();
    }
  }

  startTest() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get("email")?.value;
      console.log("Starting test for email:", email);

      // Retrieve invite data from service
      const inviteData = this.inviteService.getInviteData();

      if (!inviteData) {
        alert(
          "No invite data found. Please check your invite link or contact support.",
        );
        return;
      }

      // Check if test is active
      if (!this.isTestActive) {
        if (this.isTestUpcoming) {
          alert(
            `This test is not yet available. It will start on ${this.formatDateTime(this.testStartTime)}.`,
          );
        } else if (this.isTestExpired) {
          alert(
            `This test has expired. It ended on ${this.formatDateTime(this.testEndTime)}.`,
          );
        }
        return;
      }

      // Verify email and invite ID
      if (email === inviteData.email) {
        console.log("Email and invite ID verified successfully:", inviteData);
        console.log("Assessment Start Time:", inviteData.startTime);
        console.log("Assessment End Time:", inviteData.endTime);

        // Navigate to dashboard if email and invite ID are valid
        this.router.navigate(["/dashboard"]);
      } else {
        alert(
          "Invalid email. Please check your invite link or contact support.",
        );
      }
    } else {
      alert("Please enter a valid email address.");
    }
  }
}
