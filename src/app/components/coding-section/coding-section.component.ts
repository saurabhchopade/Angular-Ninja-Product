import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import * as monaco from "monaco-editor";
import { marked } from "marked";
import { CodeSnippetService } from "../../services/codsnippet.service";
import { CodeSnippetServiceForReset } from "../../services/reset.code.snippet.service";
import { CodeExecutionService } from "../../services/code-run.service";
import { DropOffAnswerService } from "../../services/dropoff.Coding.service"; // Import the new service
import { interval, Subscription } from "rxjs"; // Import interval and Subscription

interface CodingQuestion {
  id: number;
  title: string;
  problemStatement: string;
  languages: {
    id: string;
    name: string;
    snippet: string;
    language_id: number;
  }[];
  testCases: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    description?: string;
  }[];
  userCode: string;
}

@Component({
  selector: "app-coding-section",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="coding-container"
      [ngClass]="{ 'dark-mode': isDarkMode, 'light-mode': !isDarkMode }"
    >
      <!-- Header -->
      <div class="sticky-header">
        <div class="coding-header">
          <h2>Coding Challenge</h2>
          @if (codingQuestions.length > 0) {
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  [style.width]="getProgressPercentage() + '%'"
                ></div>
              </div>
              <span class="progress-text"
                >{{ getAnsweredCount() }} of
                {{ codingQuestions.length }} answered</span
              >
            </div>
          }
        </div>
      </div>

      <!-- Main Split Container -->
      <div class="split-container">
        <!-- Left Panel (Problem Statement) -->
        <div class="left-panel" [style.width.px]="leftPanelWidth">
          <div class="problem-statement-container">
            <div class="problem-statement-header">
              <span class="question-number"
                >Question {{ currentQuestionIndex + 1 }}</span
              >
              <span class="problem-title">{{ currentQuestion.title }}</span>
            </div>
            <div class="problem-statement-content">
              <div
                [innerHTML]="
                  parseMarkdown(currentQuestion.problemStatement || '')
                "
              ></div>
            </div>
          </div>
        </div>

        <!-- Resizer for Left and Right Panels -->
        <div class="resizer" (mousedown)="startResize($event)"></div>

        <!-- Right Panel (Code Editor and Test Cases) -->
        <div class="right-panel" [style.width.px]="rightPanelWidth">
          <!-- Toolbar -->
          <div class="toolbar">
            <select
              [(ngModel)]="selectedLanguage"
              (change)="updateEditorLanguage()"
              class="toolbar-select"
            >
              <option
                *ngFor="let lang of currentQuestion?.languages"
                [value]="lang.id"
              >
                {{ lang.name }}
              </option>
            </select>

            <button class="toolbar-button run-btn" (click)="runCode()">
              ▶ Run
            </button>

            <button class="toolbar-button submit-btn" (click)="submitCode()">
              Submit
            </button>

            <button class="toolbar-button reset-btn" (click)="resetCode()">
              Reset
            </button>

            <label class="theme-switch">
              <input
                type="checkbox"
                [(ngModel)]="isDarkMode"
                (change)="toggleTheme()"
              />
              <span class="slider round"></span>
            </label>

            <!-- Navigation Controls -->
            <div class="navigation-controls">
              <button
                class="nav-button"
                (click)="previousQuestion()"
                [disabled]="currentQuestionIndex === 0"
              >
                Previous
              </button>
              <span class="progress-indicator">
                {{ currentQuestionIndex + 1 }} / {{ codingQuestions.length }}
              </span>
              <button
                class="nav-button"
                (click)="nextQuestion()"
                [disabled]="currentQuestionIndex === codingQuestions.length - 1"
              >
                Next
              </button>
            </div>
          </div>

          <!-- Editor Container -->
          <div class="editor-container" [style.height.px]="editorHeight">
            <div #editorContainer class="editor"></div>
          </div>

          <!-- Test Case Panel -->
          <div class="test-case-panel" [style.height.px]="testCasePanelHeight">
            <div
              class="test-case-header"
              (mousedown)="startResizeTestCase($event)"
            >
              <div class="test-header-content">
                <span>Test Output</span>
                @if (
                  !loading &&
                  currentQuestion &&
                  currentQuestion.testCases.length > 0
                ) {
                  <span class="test-count">
                    Passed: {{ passedCount }}/{{ totalTestCount }}
                  </span>
                }
              </div>
              <div class="drag-button" (click)="toggleTestCasePanel()">
                {{ isTestCasePanelExpanded ? "▼" : "▲" }}
              </div>
            </div>
            <div class="test-case-content">
              <!-- Skeleton Loader -->
              <div
                *ngIf="loading"
                class="skeleton-loader"
                aria-label="Loading test cases"
              >
                <div class="skeleton-test-case" *ngFor="let _ of [1, 2, 3]">
                  <div class="skeleton-header">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                  </div>
                  <div class="skeleton-body">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                  </div>
                </div>
              </div>

              <!-- Actual Test Cases -->
              <div *ngIf="!loading">
                <div
                  class="test-case"
                  *ngFor="
                    let testCase of currentQuestion?.testCases;
                    let i = index
                  "
                >
                  <div class="test-case-header">
                    <span>Test Case {{ i + 1 }}</span>
                    <span
                      class="status"
                      [ngClass]="{
                        pass: testCase.passed,
                        fail: !testCase.passed,
                      }"
                    >
                      {{ testCase.passed ? "✔" : "✘" }}
                    </span>
                  </div>
                  <div class="test-case-details">
                    <div class="test-detail">
                      <span class="detail-label">Input:</span>
                      <pre class="detail-value">{{ testCase.input }}</pre>
                    </div>
                    <div class="test-detail">
                      <span class="detail-label">Expected Output:</span>
                      <pre class="detail-value">{{
                        testCase.expectedOutput
                      }}</pre>
                    </div>
                    <div class="test-detail">
                      <span class="detail-label">Actual Output:</span>
                      <pre class="detail-value">{{
                        testCase.actualOutput
                      }}</pre>
                    </div>
                    <div class="test-detail">
                      <span class="detail-label">Status:</span>
                      <span
                        class="detail-value"
                        [ngClass]="{
                          pass: testCase.description === 'Accepted',
                          fail: testCase.description !== 'Accepted',
                        }"
                      >
                        {{ testCase.description }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .coding-container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--background-color);
        color: var(--text-color);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      .dark-mode {
        --background-color: #1e1e1e;
        --text-color: #fff;
        --editor-background: #1e1e1e;
        --editor-text: #fff;
        --toolbar-background: #252526;
        --section-background: #252526;
        --section-header-background: #333;
        --section-content-background: #2d2d2d;
        --output-background: #252526;
        --status-bar-background: #333;
        --border-color: #444;
        --hover-color: #3c3c3c;
        --primary-color: #4caf50;
        --primary-gradient: linear-gradient(90deg, #4caf50, #8bc34a);
        --success-color: #4caf50;
        --error-color: #e74c3c;
        --badge-bg: #e8f5e9;
        --badge-color: #4caf50;
      }

      .light-mode {
        --background-color: #f9f9f9;
        --text-color: #333;
        --editor-background: #fff;
        --editor-text: #333;
        --toolbar-background: #f5f5f5;
        --section-background: #fff;
        --section-header-background: #f0f0f0;
        --section-content-background: #fff;
        --output-background: #f9f9f9;
        --status-bar-background: #e0e0e0;
        --border-color: #e0e0e0;
        --hover-color: #f0f0f0;
        --primary-color: #4caf50;
        --primary-gradient: linear-gradient(90deg, #4caf50, #8bc34a);
        --success-color: #4caf50;
        --error-color: #e74c3c;
        --badge-bg: #e8f5e9;
        --badge-color: #4caf50;
      }

      /* Header Styles */
      .sticky-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: var(--background-color);
        padding: 0.45rem 0.6rem;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
        border-bottom: 1px solid var(--border-color);
      }

      .coding-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .coding-header h2 {
        font-size: 1.2rem;
        color: var(--text-color);
        margin-bottom: 0;
        font-weight: 600;
      }

      .progress-container {
        margin: 0;
        padding: 0;
        flex: 1;
        max-width: 60%;
        margin-left: 1rem;
      }

      .progress-bar {
        height: 6px;
        background-color: var(--section-header-background);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 0.2rem;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
      }

      .progress-fill {
        height: 100%;
        background: var(--primary-gradient);
        border-radius: 10px;
        transition: width 0.3s ease;
      }

      .progress-text {
        font-size: 0.7rem;
        color: var(--text-color);
        opacity: 0.7;
        font-weight: 500;
        display: block;
        text-align: right;
        padding-right: 0.15rem;
      }

      /* Split Container */
      .split-container {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .left-panel {
        min-width: 200px;
        max-width: calc(100% - 200px);
        background-color: var(--section-background);
        overflow-y: auto;
        border-right: 1px solid var(--border-color);
      }

      .right-panel {
        flex: 1;
        min-width: 200px;
        max-width: calc(100% - 200px);
        display: flex;
        flex-direction: column;
        background-color: var(--background-color);
      }

      .resizer {
        width: 5px;
        background-color: var(--border-color);
        cursor: ew-resize;
        transition: background-color 0.2s;
      }

      .resizer:hover {
        background-color: var(--primary-color);
      }

      /* Problem Statement */
      .problem-statement-container {
        border-radius: 8px;
        margin: 10px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        background-color: var(--section-content-background);
      }

      .problem-statement-header {
        padding: 12px 16px;
        background-color: var(--section-header-background);
        color: var(--text-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
      }

      .question-number {
        font-weight: 600;
        color: var(--text-color);
        font-size: 1rem;
      }

      .problem-title {
        font-weight: 500;
        color: var(--text-color);
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .problem-statement-content {
        padding: 16px;
        background-color: var(--section-content-background);
        overflow-y: auto;
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--text-color);
      }

      .problem-statement-content h1,
      .problem-statement-content h2,
      .problem-statement-content h3 {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      .problem-statement-content p {
        margin-bottom: 1rem;
      }

      .problem-statement-content pre {
        background-color: var(--section-header-background);
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
      }

      .problem-statement-content code {
        font-family: "Consolas", "Monaco", monospace;
        font-size: 0.9rem;
      }

      /* Toolbar */
      .toolbar {
        padding: 10px;
        background-color: var(--toolbar-background);
        display: flex;
        gap: 10px;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
      }

      .toolbar-select {
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background-color: var(--section-content-background);
        color: var(--text-color);
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .toolbar-select:hover {
        border-color: var(--primary-color);
      }

      .toolbar-button {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        color: var(--text-color);
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .run-btn {
        background-color: var(--section-header-background);
      }

      .run-btn:hover {
        background-color: var(--hover-color);
        transform: translateY(-1px);
      }

      .submit-btn {
        background: var(--primary-gradient);
        color: white;
        box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
      }

      .submit-btn:hover {
        box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        transform: translateY(-1px);
      }

      .reset-btn {
        background-color: var(--section-header-background);
      }

      .reset-btn:hover {
        background-color: var(--hover-color);
        transform: translateY(-1px);
      }

      /* Editor */
      .editor-container {
        flex: 1;
        overflow: hidden;
        border-bottom: 1px solid var(--border-color);
      }

      .editor {
        width: 100%;
        height: 100%;
      }

      /* Test Case Panel */
      .test-case-panel {
        position: relative;
        background-color: var(--section-background);
      }

      .test-case-header {
        padding: 10px 16px;
        background-color: var(--section-header-background);
        color: var(--text-color);
        cursor: ns-resize;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--border-color);
      }

      .test-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .test-count {
        color: var(--success-color);
        font-size: 0.85rem;
        font-weight: 500;
      }

      .drag-button {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: var(--section-header-background);
        color: var(--text-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.8rem;
      }

      .drag-button:hover {
        background-color: var(--hover-color);
      }

      .test-case-content {
        padding: 10px;
        background-color: var(--section-content-background);
        overflow-y: auto;
        height: calc(100% - 40px);
      }

      /* Test Cases */
      .test-case {
        margin-bottom: 16px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        background-color: var(--section-background);
      }

      .test-case-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px;
        background-color: var(--section-header-background);
        font-weight: 500;
        font-size: 0.9rem;
        border-bottom: 1px solid var(--border-color);
      }

      .test-case-details {
        padding: 12px;
      }

      .test-detail {
        margin-bottom: 10px;
      }

      .detail-label {
        font-weight: 500;
        font-size: 0.85rem;
        color: var(--text-color);
        opacity: 0.8;
        display: block;
        margin-bottom: 4px;
      }

      .detail-value {
        font-family: "Consolas", "Monaco", monospace;
        font-size: 0.85rem;
        background-color: var(--section-header-background);
        padding: 8px;
        border-radius: 4px;
        margin: 0;
        overflow-x: auto;
        color: var(--text-color);
      }

      .pass {
        color: var(--success-color);
      }

      .fail {
        color: var(--error-color);
      }

      .status {
        font-weight: bold;
        font-size: 1rem;
      }

      /* Navigation Controls */
      .navigation-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: auto;
      }

      .nav-button {
        padding: 6px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background-color: var(--section-content-background);
        color: var(--text-color);
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .nav-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .nav-button:hover:not(:disabled) {
        background-color: var(--hover-color);
        border-color: var(--primary-color);
      }

      .progress-indicator {
        font-size: 0.85rem;
        color: var(--text-color);
        opacity: 0.8;
      }

      /* Theme Switch */
      .theme-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;
      }

      .theme-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--section-header-background);
        transition: 0.4s;
        border-radius: 24px;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: var(--text-color);
        transition: 0.4s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background-color: var(--primary-color);
      }

      input:checked + .slider:before {
        transform: translateX(24px);
      }

      /* Skeleton Loader */
      .skeleton-loader {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .skeleton-test-case {
        background-color: var(--section-background);
        padding: 16px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }

      .skeleton-header,
      .skeleton-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .skeleton-line {
        height: 12px;
        background-color: var(--section-header-background);
        border-radius: 4px;
        animation: pulse 1.5s infinite ease-in-out;
      }

      .skeleton-header .skeleton-line {
        width: 50%;
      }

      .skeleton-body .skeleton-line {
        width: 80%;
      }

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

      /* Scrollbar Styles */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: var(--section-background);
      }

      ::-webkit-scrollbar-thumb {
        background: var(--section-header-background);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--hover-color);
      }

      /* Responsive Styles */
      @media (max-width: 768px) {
        .toolbar {
          flex-wrap: wrap;
        }

        .navigation-controls {
          margin-left: 0;
          margin-top: 8px;
          width: 100%;
          justify-content: space-between;
        }

        .left-panel,
        .right-panel {
          min-width: 150px;
        }
      }
    `,
  ],
})
export class CodingSectionComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild("editorContainer", { static: false }) editorContainer!: ElementRef;

  codingQuestions: CodingQuestion[] = [];
  currentQuestionIndex = 0;
  // currentQuestion: CodingQuestion = {
  //   id: 0,
  //   title: '',
  //   problemStatement: '',
  //   languages: [],
  //   testCases: [],
  //   userCode: ''
  // };
  currentQuestion!: CodingQuestion;
  selectedLanguage = "";
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  isDarkMode = true;
  loading = false;
  submission = false;
  leftPanelWidth = 400;
  rightPanelWidth = window.innerWidth - 400;
  editorHeight = window.innerHeight * 0.6;
  testCasePanelHeight = window.innerHeight * 0.4;
  isTestCasePanelExpanded = true;
  passedCount = 0;
  totalTestCount = 0;
  language_id = 0;
  private dropOffSubscription!: Subscription; // Subscription for the interval

  assessmentId = 1;
  candidateId = 1;
  candidateAssessmentSessionId = 1;
  sectionId = 1;

  constructor(
    private codeSnippetService: CodeSnippetService,
    private codeSnippetServiceForReset: CodeSnippetServiceForReset,
    private codeExecutionService: CodeExecutionService,
    private dropOffAnswerService: DropOffAnswerService, // Inject the new service
  ) {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }

  ngOnInit() {
    // this.currentQuestion = {
    //   id: 0,
    //   title: '',
    //   problemStatement: '',
    //   languages: [],
    //   testCases: [],
    //   userCode: ''
    // };

    const assessmentId = 4; // Replace with dynamic assessment ID if needed
    const candidateId = 4; // Replace with dynamic candidate ID if needed
    const sectionId = 4; // Replace with dynamic section ID if needed

    this.loading = true;

    this.codeSnippetService
      .fetchCodingQuestions(assessmentId, candidateId, sectionId)
      .subscribe({
        next: (questions) => {
          this.codingQuestions = questions;
          this.currentQuestion =
            this.codingQuestions[this.currentQuestionIndex];
          this.selectedLanguage = this.currentQuestion.languages[0].id;
          this.language_id = this.currentQuestion.languages[0].language_id;
          this.initializeEditor();
          this.loading = false;

          // Start the interval to drop off the answer every 30 seconds
          this.dropOffSubscription = interval(30000).subscribe(() => {
            this.dropOffAnswer();
          });
        },
        error: (error) => {
          console.error("Error fetching coding questions:", error);
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the interval to avoid memory leaks
    if (this.dropOffSubscription) {
      this.dropOffSubscription.unsubscribe();
    }
  }

  dropOffAnswer() {
    if (!this.editor) {
      console.error("Editor not initialized");
      return;
    }

    const code = this.editor.getValue();
    const selectedLanguage = this.currentQuestion.languages.find(
      (lang) => lang.language_id === this.language_id,
    );

    if (!selectedLanguage) {
      console.error("Selected language not found");
      return;
    }

    const answerData = {
      questionId: this.currentQuestion.id,
      assessmentId: 1, // Replace with actual assessment ID
      sectionId: 1, // Replace with actual section ID
      candidateId: 1, // Replace with actual candidate ID
      languageId: selectedLanguage.language_id,
      answer: code,
      candidateAssessmentSessionId: 1,
    };

    this.dropOffAnswerService.dropOffAnswer(answerData).subscribe({
      next: (response: any) => {
        console.log("Answer dropped off successfully:", response);
      },
      error: (error: any) => {
        console.error("Error dropping off answer:", error);
      },
    });
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  initializeEditor() {
    if (this.editorContainer && !this.editor) {
      const initialCode =
        this.codeSnippetService.getCodeSnippet(
          this.currentQuestion.id,
          this.selectedLanguage,
        ) ||
        this.currentQuestion.languages.find(
          (lang) => lang.id === this.selectedLanguage,
        )?.snippet ||
        "";

      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: initialCode,
        language: this.selectedLanguage,
        theme: this.isDarkMode ? "vs-dark" : "vs",
        automaticLayout: true,
        fontSize: 14,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        smoothScrolling: true,
        padding: { top: 10 },
      });

      this.editor.onDidChangeModelContent(() => {
        const code = this.editor?.getValue() || "";
        this.codeSnippetService.saveCodeSnippet(
          this.currentQuestion.id,
          this.selectedLanguage,
          code,
        );
        this.currentQuestion.userCode = code;
      });
    } else if (this.editor) {
      this.updateEditorContent();
    }
  }

  updateEditorContent() {
    if (this.editor) {
      const initialCode =
        this.codeSnippetService.getCodeSnippet(
          this.currentQuestion.id,
          this.selectedLanguage,
        ) ||
        this.currentQuestion.languages.find(
          (lang) => lang.id === this.selectedLanguage,
        )?.snippet ||
        "";

      this.editor.setValue(initialCode);
      monaco.editor.setModelLanguage(
        this.editor.getModel()!,
        this.selectedLanguage,
      );
      this.currentQuestion.userCode = initialCode;
    }
  }

  updateEditorLanguage() {
    if (this.editor) {
      const selectedLanguage = this.selectedLanguage;
      const currentQuestion = this.currentQuestion;

      const languageData = currentQuestion.languages.find(
        (lang) => lang.id === selectedLanguage,
      );

      if (languageData && this.language_id !== languageData.language_id) {
        this.language_id = languageData.language_id; // Update only if it's different
      }

      if (languageData) {
        const snippet =
          this.codeSnippetService.getCodeSnippet(
            currentQuestion.id,
            selectedLanguage,
          ) || languageData.snippet;

        this.editor.setValue(snippet);
        monaco.editor.setModelLanguage(
          this.editor.getModel()!,
          selectedLanguage,
        );
        this.currentQuestion.userCode = snippet;
      } else {
        console.error("Snippet not found for the selected language.");
      }
    }
  }

  resetCode() {
    if (this.editor) {
      const defaultCode =
        this.currentQuestion.languages.find(
          (lang) => lang.id === this.selectedLanguage,
        )?.snippet || "";
      this.editor.setValue(defaultCode);
      this.codeSnippetService.saveCodeSnippet(
        this.currentQuestion.id,
        this.selectedLanguage,
        defaultCode,
      );
      this.currentQuestion.userCode = defaultCode;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentEditorState();
      this.currentQuestionIndex--;
      this.currentQuestion = this.codingQuestions[this.currentQuestionIndex];
      this.selectedLanguage = this.currentQuestion.languages[0].id;
      this.language_id = this.currentQuestion.languages[0].language_id;
      this.updateEditorContent();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.codingQuestions.length - 1) {
      this.saveCurrentEditorState();
      this.currentQuestionIndex++;
      this.currentQuestion = this.codingQuestions[this.currentQuestionIndex];
      this.selectedLanguage = this.currentQuestion.languages[0].id;
      this.language_id = this.currentQuestion.languages[0].language_id;
      this.updateEditorContent();
    }
  }

  saveCurrentEditorState() {
    if (this.editor) {
      const code = this.editor.getValue();
      this.codeSnippetService.saveCodeSnippet(
        this.currentQuestion.id,
        this.selectedLanguage,
        code,
      );
      this.currentQuestion.userCode = code;
    }
  }

  parseMarkdown(content: string): string {
    if (!content) return "";
    return marked.parse(content) as string;
  }

  toggleTestCasePanel() {
    this.isTestCasePanelExpanded = !this.isTestCasePanelExpanded;
    if (this.isTestCasePanelExpanded) {
      this.testCasePanelHeight = window.innerHeight * 0.5; // Set to 30% of screen height
      this.editorHeight = window.innerHeight - this.testCasePanelHeight - 50; // Adjust for toolbar
    } else {
      this.testCasePanelHeight = 50; // Collapse the panel
      this.editorHeight = window.innerHeight - 100; // Adjust for toolbar and collapsed panel
    }
  }

  toggleTheme() {
    if (this.editor) {
      this.editor.updateOptions({
        theme: this.isDarkMode ? "vs-dark" : "vs",
      });
    }
  }

  runCode() {
    if (!this.editor) {
      console.error("Editor not initialized");
      return;
    }

    const code = this.editor.getValue();
    const selectedLanguage = this.currentQuestion.languages.find(
      (lang) => lang.language_id === this.language_id,
    );

    if (!selectedLanguage) {
      console.error("Selected language not found");
      return;
    }
    this.loading = true;

    // Expand the test case panel to 30% of the screen height
    this.testCasePanelHeight = window.innerHeight * 0.5;
    this.editorHeight = window.innerHeight - this.testCasePanelHeight - 50; // Adjust for toolbar

    const languageId = selectedLanguage.language_id;
    const questionId = this.currentQuestion.id;

    this.codeExecutionService
      .executeCode(
        languageId,
        code,
        questionId,
        this.submission,
        this.assessmentId,
        this.candidateId,
        this.candidateAssessmentSessionId,
        this.sectionId,
      )
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.currentQuestion.testCases = response.data.map(
              (testCase: {
                std_input: any;
                expected_output: any;
                stdout: any;
                status: { description: string };
              }) => ({
                input: testCase.std_input,
                expectedOutput: testCase.expected_output,
                actualOutput: testCase.stdout,
                passed: testCase.status.description === "Accepted",
                description: testCase.status.description,
              }),
            );

            this.passedCount = response.data[0].passed_count;
            this.totalTestCount = response.data[0].total_test_count;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error("Error executing code:", error);
          this.loading = false;
        },
      });
  }

  startResize(event: MouseEvent) {
    const startX = event.clientX;
    const startLeftWidth = this.leftPanelWidth;
    const startRightWidth = this.rightPanelWidth;

    const mouseMoveHandler = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newLeftWidth = startLeftWidth + deltaX;
      const newRightWidth = startRightWidth - deltaX;

      if (newLeftWidth >= 200 && newRightWidth >= 200) {
        this.leftPanelWidth = newLeftWidth;
        this.rightPanelWidth = newRightWidth;
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  }

  startResizeTestCase(event: MouseEvent) {
    if (!this.isTestCasePanelExpanded) return;

    const startY = event.clientY;
    const startHeight = this.testCasePanelHeight;

    const mouseMoveHandler = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = startHeight - deltaY;

      const minHeight = 100;
      const maxHeight = window.innerHeight * 0.8;

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        this.testCasePanelHeight = newHeight;
        this.editorHeight = window.innerHeight - newHeight - 50; // Adjust for toolbar
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  }

  submitCode() {
    this.submission = true;

    if (!this.editor) {
      console.error("Editor not initialized");
      return;
    }

    const code = this.editor.getValue();
    const selectedLanguage = this.currentQuestion.languages.find(
      (lang) => lang.language_id === this.language_id,
    );

    if (!selectedLanguage) {
      console.error("Selected language not found");
      return;
    }
    this.loading = true;
    // Expand the test case panel to 30% of the screen height
    this.testCasePanelHeight = window.innerHeight * 0.5;
    this.editorHeight = window.innerHeight - this.testCasePanelHeight - 50;

    const languageId = selectedLanguage.language_id;
    const questionId = this.currentQuestion.id;

    this.codeExecutionService
      .executeCode(
        languageId,
        code,
        questionId,
        this.submission,
        this.assessmentId,
        this.candidateId,
        this.candidateAssessmentSessionId,
        this.sectionId,
      )
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.currentQuestion.testCases = response.data.map(
              (testCase: {
                std_input: any;
                expected_output: any;
                stdout: any;
                status: { description: string };
              }) => ({
                input: testCase.std_input,
                expectedOutput: testCase.expected_output,
                actualOutput: testCase.stdout,
                passed: testCase.status.description === "Accepted",
                description: testCase.status.description,
              }),
            );

            this.passedCount = response.data[0].passed_count;
            this.totalTestCount = response.data[0].total_test_count;
          }
          this.loading = false;
          this.submission = false;
        },
        error: (error) => {
          console.error("Error executing code:", error);
          this.loading = false;
          this.submission = false;
        },
      });
  }

  getAnsweredCount(): number {
    return this.codingQuestions.filter(
      (q) => q.userCode && q.userCode.trim() !== "",
    ).length;
  }

  getProgressPercentage(): number {
    if (this.codingQuestions.length === 0) return 0;
    return (this.getAnsweredCount() / this.codingQuestions.length) * 100;
  }
}
