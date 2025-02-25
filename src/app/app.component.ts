import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McqSectionComponent } from './components/mcq-section/mcq-section.component';
import { CodingSectionComponent } from './components/coding-section/coding-section.component';
import { SubjectiveSectionComponent } from './components/subjective-section/subjective-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    McqSectionComponent,
    CodingSectionComponent,
    SubjectiveSectionComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <div class="header-content">
          <!-- Left Side: InterviewNinja -->
          <div class="brand">
            <h1>Java Assessment</h1>
          </div>

          <!-- Right Side: Test Info and Timer -->
          <div class="test-info">
            <span class="user-info">Candidate: John Doe</span>
            <div class="timer">
              Time Remaining: {{ formatTime(remainingTime) }}
            </div>
          </div>
        </div>
      </header>
      
      <div class="content-layout">
        <nav>
          <!-- Test Instructions Section -->
          <button 
            (click)="currentSection = 'instructions'" 
            [class.active]="currentSection === 'instructions'"
            title="Test Instructions"
          >
            ℹ
          </button>

          <!-- MCQ Section -->
          <button 
            (click)="currentSection = 'mcq'" 
            [class.active]="currentSection === 'mcq'"
            title="MCQ Section"
          >
            1
          </button>

          <!-- Coding Section -->
          <button 
            (click)="currentSection = 'coding'" 
            [class.active]="currentSection === 'coding'"
            title="Coding Section"
          >
            2
          </button>

          <!-- Subjective Section -->
          <button 
            (click)="currentSection = 'subjective'" 
            [class.active]="currentSection === 'subjective'"
            title="Subjective Section"
          >
            3
          </button>
        </nav>

        <main>
          <div class="section-container">
            @switch (currentSection) {
              @case ('instructions') {
                <div class="instructions-section">
                  <h2>Test Instructions</h2>
                  <p>Please read the instructions carefully before starting the test:</p>
                  <ul>
                    <li>You have a total of 2 hours to complete the test.</li>
                    <li>There are three sections: MCQ, Coding, and Subjective.</li>
                    <li>Navigate between sections using the buttons on the left.</li>
                    <li>Do not refresh the page during the test.</li>
                  </ul>
                </div>
              }
              @case ('mcq') {
                <app-mcq-section />
              }
              @case ('coding') {
                <app-coding-section />
              }
              @case ('subjective') {
                <app-subjective-section />
              }
            }
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
      overflow: hidden;
    }

    /* Header Styles */
    header {
      background-color: #2196f3;
      color: white;
      padding: 8px 20px; /* Reduced padding to make the header smaller */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 10;
      height: 50px; /* Fixed height for the header */
      display: flex;
      align-items: center;
    }

    .header-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand h1 {
      font-size: 1.25rem; /* Smaller font size for the brand name */
      margin: 0;
      font-weight: 500;
    }

    .test-info {
      display: flex;
      align-items: center;
      gap: 20px; /* Space between user info and timer */
    }

    .user-info {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .timer {
      background: rgba(255, 255, 255, 0.1);
      padding: 6px 12px; /* Smaller padding for the timer */
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Content Layout */
    .content-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* Navigation Styles */
    nav {
      width: 60px;
      background: white;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
      z-index: 5;
    }

    button {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      background: #e0e0e0;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 500;
      position: relative;
    }

    button.active {
      background: #2196f3;
      color: white;
    }

    button:hover::after {
      content: attr(title);
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      margin-left: 8px;
      padding: 4px 8px;
      background-color: rgba(0, 0, 0, 0.75);
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      white-space: nowrap;
    }

    /* Style for the Instructions button */
    button:first-child {
      font-size: 1.25rem; /* Larger font size for the (i) icon */
    }

    /* Main Content Styles */
    main {
      flex: 1;
      position: relative;
      overflow: hidden;
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
      padding: 20px;
    }

    .instructions-section h2 {
      margin-bottom: 16px;
    }

    .instructions-section ul {
      padding-left: 20px;
    }

    .instructions-section li {
      margin-bottom: 8px;
    }
  `]
})
export class AppComponent implements OnInit {
  currentSection: 'instructions' | 'mcq' | 'coding' | 'subjective' = 'instructions';
  remainingTime: number = 7200; // 2 hours in seconds

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    const timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(timer);
        alert('Time is up!');
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}