import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { McqSectionComponent } from "../mcq-section/mcq-section.component";
import { CodingSectionComponent } from "../coding-section/coding-section.component";
import { SubjectiveSectionComponent } from "../subjective-section/subjective-section.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SubmitTestService } from "../../services/submit.test.service";
import { RouterModule } from "@angular/router";
import { FullstackSectionComponent } from "../fullstack-section/fullstack.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    McqSectionComponent,
    CodingSectionComponent,
    SubjectiveSectionComponent,
    FullstackSectionComponent,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [SubmitTestService], // Add the service here

  template: `
    <div class="app-container">
      <header>
        <div class="header-content">
          <!-- Left Side: Assessment Title -->
          <div class="brand">
            <h1>Java Assessment</h1>
          </div>

          <!-- Right Side: Test Info, Timer, and Submit Button -->
          <div class="test-info">
            <span class="user-info">Candidate: Saurabh Chopade</span>
            <div class="timer" [class.timer-warning]="remainingTime < 1800">
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
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ formatTime(remainingTime) }}
            </div>
            <button class="submit-test-btn" (click)="confirmSubmitTest()">
              Submit Test
            </button>
          </div>
        </div>
      </header>

      <div class="content-layout">
        <nav [class.collapsed]="navCollapsed">
          <div
            class="nav-toggle"
            (click)="toggleNav()"
            [title]="navCollapsed ? 'Show Panel' : 'Hide Panel'"
          >
            <div class="toggle-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                [class.rotated]="navCollapsed"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span class="toggle-text" *ngIf="!navCollapsed"></span>
            </div>
          </div>

          <div class="nav-section">
            <button
              (click)="currentSection = 'instructions'"
              [class.active]="currentSection === 'instructions'"
              title="Test Instructions"
            >
              <div class="instruction-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <span class="nav-label">Instructions</span>
            </button>
          </div>

          <div class="nav-section">
            <div class="section-label">Sections</div>
            <!-- MCQ Section -->
            <button
              (click)="currentSection = 'mcq'"
              [class.active]="currentSection === 'mcq'"
              title="MCQ Section"
            >
              <div class="section-number">1</div>
              <span class="nav-label">Multiple Choice</span>
            </button>

            <!-- Coding Section -->
            <button
              (click)="currentSection = 'coding'"
              [class.active]="currentSection === 'coding'"
              title="Coding Section"
            >
              <div class="section-number">2</div>
              <span class="nav-label">Coding</span>
            </button>

            <!-- Subjective Section -->
            <button
              (click)="currentSection = 'subjective'"
              [class.active]="currentSection === 'subjective'"
              title="Subjective Section"
            >
              <div class="section-number">3</div>
              <span class="nav-label">Subjective</span>
            </button>

            <!-- FullStack Section -->
            <button
              (click)="currentSection = 'fullstack'"
              [class.active]="currentSection === 'fullstack'"
              title="FullStack Section"
            >
              <div class="section-number">4</div>
              <span class="nav-label">Full Stack</span>
            </button>
          </div>
        </nav>

        <main [class.expanded]="navCollapsed">
          <div class="section-container">
            @switch (currentSection) {
              @case ("instructions") {
                <div class="instructions-section">
                  <div class="instructions-card">
                    <div class="instructions-header">
                      <h2>Test Instructions</h2>
                      <div class="instructions-badge">Important</div>
                    </div>

                    <div class="instructions-content">
                      <p class="instructions-intro">
                        Please read the following instructions carefully before
                        starting the test:
                      </p>

                      <div class="instruction-group">
                        <h3>General Guidelines</h3>
                        <ul>
                          <li>
                            You have a total of <strong>2 hours</strong> to
                            complete all sections of the test.
                          </li>
                          <li>
                            Do not refresh or close the browser window during
                            the test.
                          </li>
                          <li>
                            Ensure you have a stable internet connection
                            throughout the test duration.
                          </li>
                          <li>
                            Your answers are automatically saved as you
                            progress.
                          </li>
                        </ul>
                      </div>

                      <div class="instruction-group">
                        <h3>Test Sections</h3>
                        <div class="section-info">
                          <div class="section-info-item">
                            <div class="section-info-number">1</div>
                            <div class="section-info-details">
                              <h4>Multiple Choice Questions</h4>
                              <p>
                                Select the correct option for each question. All
                                questions carry equal marks.
                              </p>
                            </div>
                          </div>

                          <div class="section-info-item">
                            <div class="section-info-number">2</div>
                            <div class="section-info-details">
                              <h4>Coding Section</h4>
                              <p>
                                Write code to solve the given problems. Your
                                code will be evaluated for correctness and
                                efficiency.
                              </p>
                            </div>
                          </div>

                          <div class="section-info-item">
                            <div class="section-info-number">3</div>
                            <div class="section-info-details">
                              <h4>Subjective Questions</h4>
                              <p>
                                Provide detailed answers to the given questions.
                                Be concise and to the point.
                              </p>
                            </div>
                          </div>

                          <div class="section-info-item">
                            <div class="section-info-number">4</div>
                            <div class="section-info-details">
                              <h4>Full Stack Implementation</h4>
                              <p>
                                Complete the full stack implementation task and
                                upload your solution files.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="instruction-group">
                        <h3>Submission</h3>
                        <ul>
                          <li>
                            You can navigate between sections at any time using
                            the navigation panel.
                          </li>
                          <li>
                            Once you've completed all sections, click the
                            "Submit Test" button at the top right.
                          </li>
                          <li>
                            After submission, you won't be able to make any
                            changes to your answers.
                          </li>
                        </ul>
                      </div>

                      <div class="start-button-container">
                        <button
                          class="start-test-btn"
                          (click)="currentSection = 'mcq'"
                        >
                          Start Test
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
              @case ("mcq") {
                <app-mcq-section />
              }
              @case ("coding") {
                <app-coding-section />
              }
              @case ("subjective") {
                <app-subjective-section />
              }
              @case ("fullstack") {
                <app-fullstack-section />
              }
            }
          </div>
        </main>
      </div>

      <!-- Confirmation Modal -->
      @if (showSubmitConfirmation) {
        <div class="modal-overlay">
          <div class="modal-container">
            <div class="modal-header">
              <h3>Confirm Submission</h3>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to submit your test?</p>
              <p class="modal-warning">
                Once submitted, you won't be able to make any changes.
              </p>

              <div class="section-summary">
                <div class="summary-item">
                  <span>MCQ Section:</span>
                  <span class="summary-status completed">Completed</span>
                </div>
                <div class="summary-item">
                  <span>Coding Section:</span>
                  <span class="summary-status incomplete">Incomplete</span>
                </div>
                <div class="summary-item">
                  <span>Subjective Section:</span>
                  <span class="summary-status not-started">Not Started</span>
                </div>
                <div class="summary-item">
                  <span>Full Stack Section:</span>
                  <span class="summary-status not-started">Not Started</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                class="modal-cancel-btn"
                (click)="showSubmitConfirmation = false"
              >
                Cancel
              </button>
              <button class="modal-submit-btn" (click)="submitTest()">
                Submit Test
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      /* Global Container */
      .app-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f8f9fa;
        overflow: hidden;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      /* Header Styles */
      header {
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        padding: 8px 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 10;
        height: 56px;
        display: flex;
        align-items: center;
      }

      .header-content {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .brand h1 {
        font-size: 1.25rem;
        margin: 0;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .test-info {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .user-info {
        font-size: 0.875rem;
        opacity: 0.9;
        background: rgba(255, 255, 255, 0.15);
        padding: 6px 12px;
        border-radius: 20px;
      }

      .timer {
        background: rgba(255, 255, 255, 0.2);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .timer-warning {
        background: rgba(255, 87, 34, 0.8);
        animation: pulse 2s infinite;
      }

      .submit-test-btn {
        background-color: white;
        color: #4caf50;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .submit-test-btn:hover {
        background-color: #f5f5f5;
        transform: translateY(-1px);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
      }

      /* Content Layout */
      .content-layout {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      /* Navigation Styles */
      nav {
        width: 220px;
        background: white;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        gap: 24px;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
        z-index: 5;
        overflow-y: auto;
        transition: width 0.3s ease;
        position: relative;
      }

      nav.collapsed {
        width: 60px;
      }

      .nav-toggle {
        position: absolute;
        top: 50%;
        right: -16px;
        width: auto;
        min-width: 32px;
        height: 32px;
        background: #4caf50;
        color: white;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: all 0.2s ease;
        transform: translateY(-50%);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        padding: 0 8px;
      }

      .toggle-content {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .toggle-text {
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
      }

      .nav-toggle:hover {
        background: #43a047;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
      }

      .nav-toggle svg {
        transition: transform 0.3s ease;
      }

      .nav-toggle svg.rotated {
        transform: rotate(180deg);
      }

      .nav-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 16px;
      }

      .section-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #6c757d;
        font-weight: 600;
        margin-bottom: 4px;
        padding-left: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      nav.collapsed .section-label {
        visibility: hidden;
      }

      nav button {
        width: 100%;
        height: auto;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background: #f8f9fa;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        padding: 12px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #495057;
        text-align: left;
      }

      nav.collapsed button {
        justify-content: center;
        padding: 12px 8px;
        border-radius: 50%;
        margin: 0 auto;
        width: 40px;
        height: 40px;
      }

      nav button.active {
        background: #e8f5e9;
        color: #4caf50;
        font-weight: 600;
      }

      nav button:hover {
        background: #e9ecef;
      }

      .section-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background-color: #e9ecef;
        border-radius: 50%;
        margin-right: 12px;
        font-weight: 600;
        font-size: 0.75rem;
        color: #495057;
        transition: all 0.2s ease;
      }

      .instruction-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }

      nav.collapsed .section-number,
      nav.collapsed .instruction-icon {
        margin-right: 0;
      }

      button.active .section-number {
        background-color: #4caf50;
        color: white;
      }

      .nav-label {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: opacity 0.2s ease;
      }

      nav.collapsed .nav-label {
        display: none;
      }

      /* Main Content Styles */
      main {
        flex: 1;
        position: relative;
        overflow: hidden;
        transition: margin-left 0.3s ease;
      }

      main.expanded {
        margin-left: 0;
      }

      .section-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
      }

      /* Instructions Section Styles */
      .instructions-section {
        padding: 24px;
        max-width: 1000px;
        margin: 0 auto;
      }

      .instructions-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      .instructions-header {
        padding: 20px 24px;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .instructions-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .instructions-badge {
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .instructions-content {
        padding: 24px;
      }

      .instructions-intro {
        font-size: 1.1rem;
        color: #495057;
        margin-bottom: 24px;
      }

      .instruction-group {
        margin-bottom: 32px;
      }

      .instruction-group h3 {
        font-size: 1.25rem;
        color: #2c3e50;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e9ecef;
      }

      .instruction-group ul {
        padding-left: 24px;
        margin-bottom: 16px;
      }

      .instruction-group li {
        margin-bottom: 12px;
        line-height: 1.6;
        color: #495057;
      }

      .section-info {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .section-info-item {
        display: flex;
        background: #f8f9fa;
        border-radius: 12px;
        padding: 16px;
        gap: 16px;
        align-items: flex-start;
      }

      .section-info-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background-color: #4caf50;
        color: white;
        border-radius: 50%;
        font-weight: 600;
      }

      .section-info-details {
        flex: 1;
      }

      .section-info-details h4 {
        margin: 0 0 8px 0;
        color: #2c3e50;
      }

      .section-info-details p {
        margin: 0;
        color: #6c757d;
        line-height: 1.5;
      }

      .start-button-container {
        display: flex;
        justify-content: center;
        margin-top: 32px;
      }

      .start-test-btn {
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 30px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.25);
      }

      .start-test-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(76, 175, 80, 0.35);
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-container {
        background: white;
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        animation: modalFadeIn 0.3s ease-out;
      }

      .modal-header {
        padding: 16px 24px;
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 1.25rem;
      }

      .modal-body {
        padding: 24px;
      }

      .modal-warning {
        color: #e53935;
        font-weight: 500;
        margin-bottom: 20px;
      }

      .section-summary {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e9ecef;
      }

      .summary-item:last-child {
        border-bottom: none;
      }

      .summary-status {
        font-weight: 600;
      }

      .summary-status.completed {
        color: #4caf50;
      }

      .summary-status.incomplete {
        color: #ff9800;
      }

      .summary-status.not-started {
        color: #9e9e9e;
      }

      .modal-footer {
        padding: 16px 24px;
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        background: #f8f9fa;
      }

      .modal-cancel-btn {
        background: #e0e0e0;
        color: #616161;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .modal-cancel-btn:hover {
        background: #d5d5d5;
      }

      .modal-submit-btn {
        background: linear-gradient(90deg, #4caf50, #8bc34a);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .modal-submit-btn:hover {
        background: linear-gradient(90deg, #43a047, #7cb342);
      }

      /* Animations */
      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes modalFadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive Styles */
      @media (max-width: 992px) {
        nav:not(.collapsed) {
          width: 180px;
        }
      }

      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        header {
          height: auto;
          padding: 12px 16px;
        }

        .test-info {
          width: 100%;
          justify-content: space-between;
        }

        .instructions-section {
          padding: 16px;
        }
      }

      @media (max-width: 480px) {
        .user-info {
          display: none;
        }

        .instructions-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .instructions-badge {
          align-self: flex-start;
        }
      }
    `,
  ],
})
export class AppDashboard implements OnInit {
  currentSection:
    | "instructions"
    | "mcq"
    | "coding"
    | "subjective"
    | "fullstack" = "instructions";
  remainingTime: number = 7200; // 2 hours in seconds
  showSubmitConfirmation: boolean = false;
  testSubmitted: boolean = false;
  navCollapsed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submitTestService: SubmitTestService,
  ) {}

  ngOnInit() {
    this.startTimer();
  }

  toggleNav() {
    this.navCollapsed = !this.navCollapsed;
  }

  startTimer() {
    const timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(timer);
        this.submitTest();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  confirmSubmitTest() {
    this.showSubmitConfirmation = true;
  }

  submitTest() {
    // // Here you would implement the actual submission logic
    this.testSubmitted = true;
    this.showSubmitConfirmation = false;
    console.log("dsdsds");
    // this.router.navigate(['feedback']);

    const inviteId = 2; // Dummy inviteId
    const email = "john.doe@example.com"; // Dummy email

    this.router.navigate(["feedback"]).then((success) => {
      if (success) {
        console.log("Navigation to feedback successful");
      } else {
        console.error("Navigation to feedback failed");
      }
    });

    // this.submitTestService.submitAssessment(inviteId, email).subscribe({
    //   next: (response: any) => {
    //     console.log('Submission successful', response);
    //     this.testSubmitted = true;
    //     this.showSubmitConfirmation = false;
    //     this.router.navigate(['/feedback']);
    //   }

    // });
  }
}
