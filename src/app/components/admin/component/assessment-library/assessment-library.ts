import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { QuestionType } from '../../types/question.type';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TestType } from '../../types/test.type';
import { TestCardComponent } from "../test-card/test-card.component";

@Component({
  selector: 'assessment-library',
  standalone: true,
  imports: [CommonModule, SidebarComponent, QuestionCardComponent, RouterModule, HttpClientModule, ReactiveFormsModule, TestCardComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <app-sidebar />
      
      <main class="flex-1 overflow-auto">
        <div class="p-8">
          <!-- Search and Create Button -->
          <div class="flex justify-between items-center mb-8">
            <div class="relative flex-1 max-w-2xl">
              <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                [placeholder]="activeTab === 'assessments' ? 'Search assessments...' : 'Search questions by topic, title, or description...'"
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              >
            </div>
            <button class="flex items-center px-4 py-2 bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow ml-4">
              <span class="material-icons mr-2">add</span>
              Create {{activeTab === 'assessments' ? 'Assessment' : 'Question'}}
            </button>
          </div>

          <!-- Library Filters - Only visible in library tab -->
          <div *ngIf="activeTab === 'library'" class="flex items-center space-x-4 mb-6">
            <div class="flex items-center space-x-2">
              <span class="material-icons text-gray-500">filter_list</span>
              <select class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]">
                <option>All Question Types</option>
                <option>Multiple Choice</option>
                <option>Coding</option>
                <option>Design</option>
              </select>
            </div>
            <select class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]">
              <option>All Libraries</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Security</option>
            </select>
            <div class="flex items-center space-x-2">
              <span *ngFor="let level of difficultyLevels"
                    [class]="getDifficultyColor(level)">
                {{level}}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- Tabs -->
            <div class="flex space-x-4 mb-6">
              <button *ngFor="let tab of tabs"
                      (click)="activeTab = tab.toLowerCase()"
                      [class]="getTabClass(tab.toLowerCase())">
                {{tab}}
              </button>
            </div>

            <!-- Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ng-container *ngIf="activeTab === 'assessments'">
                <app-test-card *ngFor="let test of tests"
                              [test]="test"
                              (viewReport)="onViewReport($event)"
                              (invite)="onInvite($event)"
                              (archive)="onArchive($event)">
                </app-test-card>
              </ng-container>
              <ng-container *ngIf="activeTab === 'library'">
                <app-question-card *ngFor="let question of questions"
                                 [question]="question">
                </app-question-card>
              </ng-container>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [``]
})
export class AssessmentLibraryComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Implement your initialization logic here
  }

  activeTab: string = 'assessments';
  tabs = ['Assessments', 'Library'];
  difficultyLevels = ['Basic', 'Intermediate', 'Advanced'];

  questions: QuestionType[] = [
    {
      id: 1,
      title: "RESTful API Design",
      description: "Design a scalable REST API for a social media platform with user authentication and post management.",
      difficulty: "Intermediate",
      score: 85,
      technologies: ["Python", "FastAPI"],
      categories: ["Full Stack", "Backend"]
    },
    {
      id: 2,
      title: "Security Analysis",
      description: "Perform a security assessment of a web application and identify potential vulnerabilities.",
      difficulty: "Advanced",
      score: 92,
      technologies: ["CyberOps", "Security"],
      categories: ["Security", "Analysis"]
    },
    {
      id: 3,
      title: "Frontend Development",
      description: "Create a responsive dashboard using React and modern CSS techniques.",
      difficulty: "Basic",
      score: 78,
      technologies: ["React", "TypeScript"],
      categories: ["Frontend", "UI/UX"]
    }
  ];

  tests: TestType[] = [
    {
      id: 1,
      name: "Frontend Developer Assessment",
      inviteType: "Invite Only",
      duration: "1 hr 30 mins",
      testDate: "Feb 15th, 2025, 12:00 PM IST",
      endDate: "Feb 15th, 2025, 11:59 PM IST",
      invitedCount: 50,
      completedCount: 35,
      status: "Active"
    },
    {
      id: 2,
      name: "Backend Engineering Test",
      inviteType: "Public",
      duration: "2 hrs",
      testDate: "Feb 20th, 2025, 10:00 AM IST",
      invitedCount: 100,
      completedCount: 75,
      status: "Active"
    },
    {
      id: 3,
      name: "DevOps Assessment",
      inviteType: "Invite Only",
      duration: "1 hr",
      testDate: "Feb 10th, 2025, 3:00 PM IST",
      endDate: "Feb 10th, 2025, 6:00 PM IST",
      invitedCount: 25,
      completedCount: 25,
      status: "Completed"
    }
  ];

  getDifficultyColor(difficulty: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm ';
    switch (difficulty) {
      case 'Basic': return baseClasses + 'bg-green-100 text-green-800';
      case 'Intermediate': return baseClasses + 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return baseClasses + 'bg-red-100 text-red-800';
      default: return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }

  getTabClass(tab: string): string {
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors ';
    return baseClasses + (this.activeTab === tab
      ? 'bg-[#4CAF50] text-white'
      : 'text-gray-600 hover:bg-gray-100');
  }

  onViewReport(id: number) {
    console.log('View report for test:', id);
  }

  onInvite(id: number) {
    console.log('Invite candidates for test:', id);
  }

  onArchive(id: number) {
    console.log('Archive test:', id);
  }
}