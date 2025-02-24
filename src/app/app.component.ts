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
          <div class="test-info">
            <h1>Angular Assessment</h1>
            <span class="user-info">Candidate: John Doe</span>
          </div>
          <div class="timer">
            Time Remaining: {{ formatTime(remainingTime) }}
          </div>
        </div>
      </header>
      
      <div class="content-layout">
        <nav>
          <button (click)="currentSection = 'mcq'" [class.active]="currentSection === 'mcq'">
            MCQ Questions
          </button>
          <button (click)="currentSection = 'coding'" [class.active]="currentSection === 'coding'">
            Coding Questions
          </button>
          <button (click)="currentSection = 'subjective'" [class.active]="currentSection === 'subjective'">
            Subjective Questions
          </button>
        </nav>

        <main>
          <div class="section-container">
            @switch (currentSection) {
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
    header {
      background-color: #2196f3;
      color: white;
      padding: 10px 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 10;
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .test-info {
      display: flex;
      flex-direction: column;
    }
    h1 {
      font-size: 1.25rem;
      margin: 0;
      font-weight: 500;
    }
    .user-info {
      font-size: 0.875rem;
      opacity: 0.9;
    }
    .timer {
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .content-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    nav {
      width: 180px;
      background: white;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 2px 0 4px rgba(0,0,0,0.1);
      z-index: 5;
    }
    button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #e0e0e0;
      transition: all 0.3s ease;
      text-align: left;
      font-size: 0.875rem;
    }
    button.active {
      background: #2196f3;
      color: white;
    }
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
  `]
})
export class AppComponent implements OnInit {
  currentSection: 'mcq' | 'coding' | 'subjective' = 'mcq';
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