import { Component, OnInit } from "@angular/core";
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

          <div class="test-details-section">
            <div class="test-details-card">
              <div class="test-header">
                <h3>{{ this.assessmentName }}</h3>
                <span class="test-type-badge">{{ this.assessmentType }}</span>
              </div>

              <div class="details-group">
                <div class="detail-item">
                  <span class="detail-icon">👤</span>
                  <div class="detail-content">
                    <span class="detail-label">Candidate</span>
                    <span class="detail-value">{{ this.candidateFullName }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <span class="detail-icon">⏱️</span>
                  <div class="detail-content">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">{{ this.duration }} minutes</span>
                  </div>
                </div>

                <div class="detail-item">
                  <span class="detail-icon">📊</span>
                  <div class="detail-content">
                    <span class="detail-label">Difficulty</span>
                    <span class="detail-value difficulty-badge">
                      {{ this.difficultyLevel }}
                    </span>
                  </div>
                </div>

                <div class="detail-item">
                  <span class="detail-icon">📝</span>
                  <div class="detail-content">
                    <span class="detail-label">Status</span>
                    <span class="detail-value status-badge">
                      {{ this.assessmentStatus }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
      align-items: start;
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

    /* Test Details Section */
    .test-details-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .test-details-card {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .test-header h3 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin: 0;
      font-weight: 600;
    }

    .test-type-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .details-group {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .detail-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .detail-value {
      color: #2c3e50;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .difficulty-badge {
      display: inline-block;
      background: #fff3e0;
      color: #f57c00;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.9rem;
    }

    .status-badge {
      display: inline-block;
      background: #e8f5e9;
      color: #4caf50;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.9rem;
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

    /* Responsive design */
    @media (max-width: 1200px) {
      .main-content {
        width: 95%;
        padding: 90px 0 2rem;
      }

      .login-container {
        gap: 2rem;
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
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 1rem 2rem;
      }

      .main-content {
        padding: 80px 1rem 1.5rem;
      }

      h2 {
        font-size: 2rem;
      }

      .test-header {
        flex-direction: column;
        align-items: flex-start;
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

      .login-box,
      .test-details-card {
        padding: 1.5rem;
      }

      h2 {
        font-size: 1.75rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .detail-icon {
        width: 32px;
        height: 32px;
        font-size: 1.25rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  testStartTime: Date | null = null;
  testEndTime: Date | null = null;
  isTestActive: boolean = false;
  isTestUpcoming: boolean = false;
  isTestExpired: boolean = false;
  currentTime: Date = new Date();
  assessmentName:string ='';
  assessmentType:string ='';
  duration:string ='';
  difficultyLevel:string ='';
  assessmentStatus:string ='';
  candidateFullName:string = ''

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
    this.assessmentName = inviteData?.assessmentName ?? '';
    this.assessmentType = inviteData?.assessmentType ?? '';
    this.duration = inviteData?.duration ?? '';
    this.difficultyLevel = inviteData?.difficultyLevel ?? '';
    this.assessmentStatus = inviteData?.assessmentStatus ?? '';
    this.candidateFullName = inviteData?.candidateFullName ?? '';


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
//As of now hardcoded change chnage this to TODO
//    this.isTestActive = now >= this.testStartTime && now <= this.testEndTime;
    this.isTestActive = true;
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
