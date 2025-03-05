import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CandidateReport {
  id: number;
  name: string;
  email: string;
  finishedAt: string;
  status: 'Review Pending' | 'Reviewed' | 'Flagged';
  score: number;
  maxScore: number;
  integrityIndex: 'Good' | 'Average' | 'Poor';
  interviewLink?: string;
  attemptPercentage: number;
  duration: number;
  tabSwitches: number;
}

@Component({
  selector: 'app-assessment-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <!-- Table Header with Filters -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <!-- Search Input -->
          <div class="relative">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search candidates..."
              class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>

          <!-- Date Range Filter -->
          <div class="flex items-center gap-2">
            <input
              type="date"
              [(ngModel)]="startDate"
              (change)="filterByDate()"
              class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
            <span class="text-gray-400">to</span>
            <input
              type="date"
              [(ngModel)]="endDate"
              (change)="filterByDate()"
              class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <!-- Status Filter -->
          <select class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>All Status</option>
            <option>Review Pending</option>
            <option>Reviewed</option>
            <option>Flagged</option>
          </select>

          <!-- Integrity Filter -->
          <select class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>All Integrity</option>
            <option>Good</option>
            <option>Average</option>
            <option>Poor</option>
          </select>
        </div>

        <!-- Export Button -->
        <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
          <span class="material-icons">download</span>
          Export Report
        </button>
      </div>

      <!-- Assessment Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Candidate Info</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Finished At</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Score</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Integrity Index</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Interview</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Attempt %</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Duration</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Tab Switches</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of filteredReports" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">
                <div>
                  <div class="font-medium text-gray-800">{{report.name}}</div>
                  <div class="text-sm text-gray-500">{{report.email}}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600">{{report.finishedAt}}</td>
              <td class="px-4 py-3">
                <span [class]="getStatusClass(report.status)">
                  {{report.status}}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="font-medium text-gray-800">{{report.score}}</span>
                <span class="text-gray-500">/{{report.maxScore}}</span>
              </td>
              <td class="px-4 py-3">
                <span [class]="getIntegrityClass(report.integrityIndex)">
                  {{report.integrityIndex}}
                </span>
              </td>
              <td class="px-4 py-3">
                <a *ngIf="report.interviewLink"
                   [href]="report.interviewLink"
                   class="text-blue-600 hover:text-blue-800 underline text-sm">
                  Interview Link
                </a>
                <span *ngIf="!report.interviewLink" class="text-gray-400 text-sm">
                  Not Scheduled
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-16 h-2 bg-gray-200 rounded-full mr-2">
                    <div class="h-full bg-green-500 rounded-full"
                         [style.width.%]="report.attemptPercentage">
                    </div>
                  </div>
                  <span class="text-sm text-gray-600">{{report.attemptPercentage}}%</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600">{{report.duration}} min</td>
              <td class="px-4 py-3 text-gray-600">{{report.tabSwitches}}</td>
              <td class="px-4 py-3">
                <button 
                  (click)="showDetailedReport(report)"
                  class="text-green-600 hover:text-green-800">
                  <span class="material-icons">visibility</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detailed Report Modal -->
      <div *ngIf="selectedReport"
           class="fixed inset-0 bg-black/30 flex items-center justify-center"
           (click)="selectedReport = null">
        <div class="bg-white w-full max-w-4xl rounded-xl shadow-2xl"
             (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="p-6 border-b">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-semibold text-gray-800">Performance Report</h2>
                <p class="text-gray-500 mt-1">{{selectedReport.name}} - {{selectedReport.email}}</p>
              </div>
              <button 
                (click)="selectedReport = null"
                class="text-gray-400 hover:text-gray-600">
                <span class="material-icons">close</span>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <!-- Score Overview -->
            <div class="grid grid-cols-4 gap-4 mb-8">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">Total Score</div>
                <div class="text-2xl font-semibold text-gray-800">
                  {{selectedReport.score}}/{{selectedReport.maxScore}}
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">Attempt Rate</div>
                <div class="text-2xl font-semibold text-gray-800">
                  {{selectedReport.attemptPercentage}}%
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">Duration</div>
                <div class="text-2xl font-semibold text-gray-800">
                  {{selectedReport.duration}} min
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500">Tab Switches</div>
                <div class="text-2xl font-semibold text-gray-800">
                  {{selectedReport.tabSwitches}}
                </div>
              </div>
            </div>

            <!-- Performance Analysis -->
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-800 mb-4">Performance Analysis</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-600">Programming</span>
                      <span class="text-sm text-gray-500">85%</span>
                    </div>
                    <div class="w-full h-2 bg-gray-200 rounded-full">
                      <div class="h-full w-[85%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-600">Problem Solving</span>
                      <span class="text-sm text-gray-500">92%</span>
                    </div>
                    <div class="w-full h-2 bg-gray-200 rounded-full">
                      <div class="h-full w-[92%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm font-medium text-gray-600">System Design</span>
                      <span class="text-sm text-gray-500">78%</span>
                    </div>
                    <div class="w-full h-2 bg-gray-200 rounded-full">
                      <div class="h-full w-[78%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Strengths & Areas for Improvement -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-4">Strengths</h3>
                  <ul class="space-y-2">
                    <li class="flex items-center text-gray-600">
                      <span class="material-icons text-green-500 mr-2">check_circle</span>
                      Strong problem-solving skills
                    </li>
                    <li class="flex items-center text-gray-600">
                      <span class="material-icons text-green-500 mr-2">check_circle</span>
                      Excellent code quality
                    </li>
                    <li class="flex items-center text-gray-600">
                      <span class="material-icons text-green-500 mr-2">check_circle</span>
                      Efficient algorithm implementation
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-800 mb-4">Areas for Improvement</h3>
                  <ul class="space-y-2">
                    <li class="flex items-center text-gray-600">
                      <span class="material-icons text-yellow-500 mr-2">info</span>
                      Time management
                    </li>
                    <li class="flex items-center text-gray-600">
                      <span class="material-icons text-yellow-500 mr-2">info</span>
                      Edge case handling
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Integrity Analysis -->
              <div>
                <h3 class="text-lg font-medium text-gray-800 mb-4">Integrity Analysis</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center mb-4">
                    <span [class]="getIntegrityClass(selectedReport.integrityIndex)">
                      {{selectedReport.integrityIndex}}
                    </span>
                    <span class="text-gray-500 ml-2">Integrity Index</span>
                  </div>
                  <p class="text-gray-600">
                    The candidate maintained good assessment integrity with minimal tab switches
                    and consistent focus throughout the duration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 border-t bg-gray-50 flex justify-end gap-4">
            <button 
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              (click)="selectedReport = null">
              Close
            </button>
            <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AssessmentReportComponent {
  @Input() testId!: number;
  
  selectedReport: CandidateReport | null = null;
  startDate: string = '';
  endDate: string = '';

  reports: CandidateReport[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      finishedAt: "2025-02-15T14:30:00",
      status: "Review Pending",
      score: 115,
      maxScore: 132,
      integrityIndex: "Good",
      interviewLink: "https://meet.google.com/abc-defg-hij",
      attemptPercentage: 92,
      duration: 85,
      tabSwitches: 2
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      finishedAt: "2025-02-15T15:45:00",
      status: "Reviewed",
      score: 128,
      maxScore: 132,
      integrityIndex: "Good",
      attemptPercentage: 98,
      duration: 90,
      tabSwitches: 1
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@example.com",
      finishedAt: "2025-02-15T16:15:00",
      status: "Flagged",
      score: 95,
      maxScore: 132,
      integrityIndex: "Poor",
      attemptPercentage: 75,
      duration: 92,
      tabSwitches: 8
    }
  ];

  get filteredReports(): CandidateReport[] {
    if (!this.startDate && !this.endDate) {
      return this.reports;
    }

    return this.reports.filter(report => {
      const reportDate = new Date(report.finishedAt);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      if (start && end) {
        return reportDate >= start && reportDate <= end;
      } else if (start) {
        return reportDate >= start;
      } else if (end) {
        return reportDate <= end;
      }

      return true;
    });
  }

  filterByDate() {
    // The filtering is handled by the filteredReports getter
    console.log('Filtering by date range:', this.startDate, 'to', this.endDate);
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs ';
    switch (status) {
      case 'Review Pending': return baseClasses + 'bg-yellow-100 text-yellow-800';
      case 'Reviewed': return baseClasses + 'bg-green-100 text-green-800';
      case 'Flagged': return baseClasses + 'bg-red-100 text-red-800';
      default: return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }

  getIntegrityClass(index: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs ';
    switch (index) {
      case 'Good': return baseClasses + 'bg-green-100 text-green-800';
      case 'Average': return baseClasses + 'bg-yellow-100 text-yellow-800';
      case 'Poor': return baseClasses + 'bg-red-100 text-red-800';
      default: return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }

  showDetailedReport(report: CandidateReport) {
    this.selectedReport = report;
  }
}