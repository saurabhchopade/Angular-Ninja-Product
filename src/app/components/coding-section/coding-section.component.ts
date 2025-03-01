import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as monaco from 'monaco-editor';
import { marked } from 'marked';
import { CodeSnippetService } from '../../services/codsnippet.service';
import { CodeExecutionService } from '../../services/code-run.service';
import { DropOffAnswerService } from '../../services/dropoff.Coding.service'; // Import the new service
import { interval, Subscription } from 'rxjs'; // Import interval and Subscription

interface CodingQuestion {
  id: number;
  title: string;
  problemStatement: string;
  languages: { id: string; name: string; snippet: string;language_id:number }[];
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
  selector: 'app-coding-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="coding-container" [ngClass]="{'dark-mode': isDarkMode, 'light-mode': !isDarkMode}">
      <!-- Main Split Container -->
      <div class="split-container">
        <!-- Left Panel (Problem Statement) -->
        <div class="left-panel" [style.width.px]="leftPanelWidth">
          <div class="problem-statement-container">
            <div class="problem-statement-header">
              Problem Statement
            </div>
            <div class="problem-statement-content">
              <div [innerHTML]="parseMarkdown(currentQuestion.problemStatement)"></div>
            </div>
          </div>
        </div>

        <!-- Resizer for Left and Right Panels -->
        <div class="resizer" (mousedown)="startResize($event)"></div>

        <!-- Right Panel (Code Editor and Test Cases) -->
        <div class="right-panel" [style.width.px]="rightPanelWidth">
          <!-- Toolbar -->
          <div class="toolbar">
            <select [(ngModel)]="selectedLanguage" (change)="updateEditorLanguage()" class="toolbar-select">
              <option *ngFor="let lang of currentQuestion.languages" [value]="lang.id">{{ lang.name }}</option>
            </select>

            <button class="toolbar-button" (click)="runCode()">
              ▶ Run
            </button>

            <button class="toolbar-button" (click)="submitCode()">
              Submit
            </button>

            <button class="toolbar-button" (click)="resetCode()">
              Reset
            </button>

            <label class="switch">
              <input type="checkbox" [(ngModel)]="isDarkMode" (change)="toggleTheme()">
              <span class="slider round"></span>
            </label>

            <!-- Navigation Controls -->
            <div class="navigation-controls">
              <button class="nav-button" (click)="previousQuestion()" [disabled]="currentQuestionIndex === 0">
                Previous
              </button>
              <span class="progress-indicator">
                Question {{ currentQuestionIndex + 1 }} of {{ codingQuestions.length }}
              </span>
              <button class="nav-button" (click)="nextQuestion()" [disabled]="currentQuestionIndex === codingQuestions.length - 1">
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
            <div class="test-case-header" (mousedown)="startResizeTestCase($event)">
              Test Output

              <span class="test-count" *ngIf="!loading">
                Passed Count: 
      {{ passedCount }}/{{ totalTestCount }}
    </span>

              <div class="drag-button" (click)="toggleTestCasePanel()">
                {{ isTestCasePanelExpanded ? '▼' : '▲' }}
              </div>
            </div>
            <div class="test-case-content">
  <!-- Skeleton Loader -->
  <div *ngIf="loading" class="skeleton-loader" aria-label="Loading test cases">
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
    <div class="test-case" *ngFor="let testCase of currentQuestion.testCases; let i = index">
      <div class="test-case-header">
        <span>Test Case {{ i + 1 }}</span>
        <span class="status" [ngClass]="{'pass': testCase.passed, 'fail': !testCase.passed}">
          {{ testCase.passed ? '✔' : '✘' }}
        </span>
      </div>
      <div class="test-case-content">
        <div>Input: <pre>{{ testCase.input }}</pre></div>
        <div>Expected Output: <pre>{{ testCase.expectedOutput }}</pre></div>
        <div>Actual Output: <pre>{{ testCase.actualOutput }}</pre></div>
        <div class="output-container">
          Description:
          <span [ngClass]="{'pass': testCase.description === 'Accepted', 'fail': testCase.description !== 'Accepted'}">
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
  styles: [`
    .coding-container {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
      color: var(--text-color);
    }

    .dark-mode {
      --background-color: #1e1e1e;
      --text-color: #fff;
      --editor-background: #1e1e1e;
      --editor-text: #fff;
      --toolbar-background: #333;
      --section-background: #252526;
      --section-header-background: #333;
      --section-content-background: #2d2d2d;
      --output-background: #252526;
      --status-bar-background: #333;
    }
    .output-container {
  display: flex;
  align-items: center; /* Aligns items vertically in the center */
  gap: 8px; /* Adds some space between the text and the output */
}
    .light-mode {
      --background-color: #fff;
      --text-color: #000;
      --editor-background: #fff;
      --editor-text: #000;
      --toolbar-background: #f5f5f5;
      --section-background: #f9f9f9;
      --section-header-background: #e0e0e0;
      --section-content-background: #f5f5f5;
      --output-background: #f9f9f9;
      --status-bar-background: #e0e0e0;
    }

    .split-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .left-panel {
      min-width: 200px;
      max-width: calc(100% - 200px);
      background-color: var(--section-background);
      padding: 10px;
      overflow-y: auto;
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
      background-color: var(--section-header-background);
      cursor: ew-resize;
    }

    .problem-statement-container {
      position: relative;
      border: 1px solid var(--section-header-background);
      margin-bottom: 10px;
    }

    .problem-statement-header {
      padding: 10px;
      background-color: var(--section-header-background);
      color: var(--text-color);
    }

    .problem-statement-content {
      padding: 10px;
      background-color: var(--section-content-background);
      overflow-y: auto;
      font-size: 14px;
    }

    .toolbar {
      padding: 10px;
      background-color: var(--toolbar-background);
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .toolbar-select {
      padding: 6px 12px;
      border: 1px solid var(--section-header-background);
      border-radius: 4px;
      background-color: var(--section-content-background);
      color: var(--text-color);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toolbar-select:hover {
      border-color: var(--text-color);
      background-color: var(--section-header-background);
    }

    .toolbar-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: var(--section-header-background);
      color: var(--text-color);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .toolbar-button:hover {
      background-color: var(--section-content-background);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }

    .toolbar-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .editor-container {
      flex: 1;
      overflow: hidden;
    }

    .editor {
      width: 100%;
      height: 100%;
    }

    .test-case-panel {
      position: relative;
      border: 1px solid var(--section-header-background);
      margin-top: 10px;
    }

    .test-case-header {
      padding: 10px;
      background-color: var(--section-header-background);
      color: var(--text-color);
      cursor: ns-resize;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .drag-button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: var(--section-header-background);
      color: var(--text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .drag-button:hover {
      background-color: var(--section-content-background);
      transform: scale(1.1);
    }

    .test-case-content {
      padding: 10px;
      background-color: var(--section-content-background);
      overflow-y: auto;
      height: calc(100% - 40px); /* Adjust height based on header height */
    }

    .test-case {
      margin-bottom: 10px;
    }

    .test-case-header {
      font-weight: bold;
    }
    .initial {
  color: #888; /* Neutral color for initial state */
}

.pass {
  color: green; /* Color for pass state */
}

.fail {
  color: red; /* Color for fail state */
}

.status {
  margin-left: 10px;
}

.test-case-header {
  font-weight: bold;
}

.output-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

    /* Navigation Controls */
    .navigation-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto; /* Push navigation controls to the right */
    }

    .nav-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: var(--section-header-background);
      color: var(--text-color);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-button:disabled {
      background-color: var(--section-content-background);
      cursor: not-allowed;
    }

    .nav-button:hover:not(:disabled) {
      background-color: var(--section-content-background);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }

    .progress-indicator {
      font-size: 14px;
      color: var(--text-color);
    }

    /* Custom Scrollbar Styles */
    ::-webkit-scrollbar {
      width: 8px; /* Smaller scrollbar width */
      height: 8px; /* Smaller scrollbar height */
    }

    ::-webkit-scrollbar-track {
      background: var(--section-content-background); /* Track color */
    }

    ::-webkit-scrollbar-thumb {
      background: #888; /* Thumb color */
      border-radius: 4px; /* Rounded corners */
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #555; /* Thumb color on hover */
    }

    /* VSCode-like scrollbar for the editor */
    .editor .monaco-scrollable-element > .scrollbar > .slider {
      background: rgba(121, 121, 121, 0.4); /* Subtle scrollbar color */
      border-radius: 4px; /* Rounded corners */
    }

    .editor .monaco-scrollable-element > .scrollbar > .slider:hover {
      background: rgba(121, 121, 121, 0.6); /* Slightly darker on hover */
    }

    .editor .monaco-scrollable-element > .scrollbar > .slider.active {
      background: rgba(121, 121, 121, 0.8); /* Darker when active */
    }

    /* Switch styles */
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
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
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    /* Skeleton Loader Styles */
    .skeleton-loader {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

.skeleton-test-case {
  background-color: var(--section-content-background);
  padding: 10px;
  border-radius: 4px;
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
.test-count {
  margin-left: 0; /* No space between "Test Output" and the count */
  color: green; /* Green color for the count */
  font-weight: bold;
}
  `]
})
export class CodingSectionComponent implements AfterViewInit, OnInit {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  codingQuestions: CodingQuestion[] = [];
  currentQuestionIndex = 0;
  currentQuestion!: CodingQuestion;
  selectedLanguage = '';
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  isDarkMode = true;
  loading = false;
  submission = false;
  leftPanelWidth = 300;
  rightPanelWidth = window.innerWidth - 300;
  editorHeight = window.innerHeight * 0.6;
  testCasePanelHeight = window.innerHeight * 0.4;
  isTestCasePanelExpanded = true;
  passedCount = 0;
  totalTestCount = 0;
  language_id = 0;
  private dropOffSubscription!: Subscription; // Subscription for the interval

  constructor(
    private codeSnippetService: CodeSnippetService,
    private codeExecutionService: CodeExecutionService,
    private dropOffAnswerService: DropOffAnswerService // Inject the new service
  ) {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }

  ngOnInit() {
    this.codeSnippetService.fetchCodingQuestions().subscribe((questions) => {
      this.codingQuestions = questions;
      this.currentQuestion = this.codingQuestions[this.currentQuestionIndex];
      this.selectedLanguage = this.currentQuestion.languages[0].id;
      this.language_id = this.currentQuestion.languages[0].language_id;
      this.initializeEditor();

      // Start the interval to drop off the answer every 30 seconds
      this.dropOffSubscription = interval(30000).subscribe(() => {
        this.dropOffAnswer();
      });
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
      console.error('Editor not initialized');
      return;
    }

    const code = this.editor.getValue();
    const selectedLanguage = this.currentQuestion.languages.find(lang => lang.language_id === this.language_id);

    if (!selectedLanguage) {
      console.error('Selected language not found');
      return;
    }

    const answerData = {
      questionId: this.currentQuestion.id,
      assessmentId: 1, // Replace with actual assessment ID
      sectionId: 1, // Replace with actual section ID
      candidateId: 1, // Replace with actual candidate ID
      languageId: selectedLanguage.language_id,
      answer: code
    };

    this.dropOffAnswerService.dropOffAnswer(answerData).subscribe({
      next: (response: any) => {
        console.log('Answer dropped off successfully:', response);
      },
      error: (error: any) => {
        console.error('Error dropping off answer:', error);
      }
    });
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  initializeEditor() {
    if (this.editorContainer && !this.editor) {
      const initialCode = this.codeSnippetService.getCodeSnippet(
        this.currentQuestion.id,
        this.selectedLanguage
      ) || this.currentQuestion.languages.find((lang) => lang.id === this.selectedLanguage)?.snippet || '';

      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: initialCode,
        language: this.selectedLanguage,
        theme: this.isDarkMode ? 'vs-dark' : 'vs',
        automaticLayout: true,
      });

      this.editor.onDidChangeModelContent(() => {
        const code = this.editor?.getValue() || '';
        this.codeSnippetService.saveCodeSnippet(
          this.currentQuestion.id,
          this.selectedLanguage,
          code
        );
        this.currentQuestion.userCode = code;
      });
    } else if (this.editor) {
      this.updateEditorContent();
    }
  }

  updateEditorContent() {
    if (this.editor) {
      const initialCode = this.codeSnippetService.getCodeSnippet(
        this.currentQuestion.id,
        this.selectedLanguage
      ) || this.currentQuestion.languages.find((lang) => lang.id === this.selectedLanguage)?.snippet || '';

      this.editor.setValue(initialCode);
      monaco.editor.setModelLanguage(this.editor.getModel()!, this.selectedLanguage);
      this.currentQuestion.userCode = initialCode;
    }
  }

  updateEditorLanguage() {
    if (this.editor) {
      const selectedLanguage = this.selectedLanguage;
      const currentQuestion = this.currentQuestion;

      const languageData = currentQuestion.languages.find((lang) => lang.id === selectedLanguage);
      
      if (languageData && this.language_id !== languageData.language_id) {
        console.log('UPDATEDD Language ID:',languageData.language_id);
        this.language_id = languageData.language_id; // Update only if it's different
      }
      

      if (languageData) {
        const snippet = this.codeSnippetService.getCodeSnippet(
          currentQuestion.id,
          selectedLanguage
        ) || languageData.snippet;

        this.editor.setValue(snippet);
        monaco.editor.setModelLanguage(this.editor.getModel()!, selectedLanguage);
        this.currentQuestion.userCode = snippet;
      } else {
        console.error('Snippet not found for the selected language.');
      }
    }
  }

  resetCode() {
    if (this.editor) {
      const defaultCode = this.currentQuestion.languages.find((lang) => lang.id === this.selectedLanguage)?.snippet || '';
      this.editor.setValue(defaultCode);
      this.codeSnippetService.saveCodeSnippet(
        this.currentQuestion.id,
        this.selectedLanguage,
        defaultCode
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
      this.language_id =this.currentQuestion.languages[0].language_id;
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
        code
      );
      this.currentQuestion.userCode = code;
    }
  }

  parseMarkdown(content: string): string {
    return marked.parse(content) as string;
  }

  toggleTestCasePanel() {
    this.isTestCasePanelExpanded = !this.isTestCasePanelExpanded;
    if (this.isTestCasePanelExpanded) {
      this.testCasePanelHeight = window.innerHeight * 0.4;
    } else {
      this.testCasePanelHeight = 50;
    }
  }

  toggleTheme() {
    if (this.editor) {
      this.editor.updateOptions({
        theme: this.isDarkMode ? 'vs-dark' : 'vs',
      });
    }
  }

  runCode() {
    if (!this.editor) {
      console.error('Editor not initialized');
      return;
    }

    const code = this.editor.getValue();
    const selectedLanguage = this.currentQuestion.languages.find(lang => lang.language_id === this.language_id);

    if (!selectedLanguage) {
      console.error('Selected language not found');
      return;
    }
    this.loading = true;

    // Ensure languageId and questionId are parsed correctly
    const languageId = selectedLanguage.language_id; // No need to parse if it's already a string
    const questionId = this.currentQuestion.id; // No need to parse if it's already a number

    // Debugging logs to verify values
    console.log('Language ID:', languageId);
    console.log('Question ID:', questionId);
    console.log('Code:', code);

    // Call the code execution service
    this.codeExecutionService.executeCode(languageId, code, questionId,this.submission).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.currentQuestion.testCases = response.data.map((testCase: { std_input: any; expected_output: any; stdout: any; status: { description: string; }; }) => ({
            input: testCase.std_input,
            expectedOutput: testCase.expected_output,
            actualOutput: testCase.stdout,
            passed: testCase.status.description === 'Accepted',
            description: testCase.status.description
          }));

          this.passedCount = response.data[0].passed_count; 
          this.totalTestCount = response.data[0].total_test_count;
        }
        this.loading = false; // Reset loading state
      },
      error: (error) => {
        console.error('Error executing code:', error);
        this.loading = false; // Reset loading state
      }
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
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
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
        this.editorHeight = window.innerHeight - newHeight;
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  submitCode() {
    // const allAttempted = this.codingQuestions.every((q) => q.userCode.trim() !== '');
    // if (allAttempted) {
    //   console.log('Submitting all questions:', this.codingQuestions);
    //   alert('All questions submitted successfully!');
    // } else {
    //   alert('Please attempt all questions before submitting.');
    // }

    this.submission = true;

    if (!this.editor) {
      console.error('Editor not initialized');
      return;
    }

    const code = this.editor.getValue();
    const selectedLanguage = this.currentQuestion.languages.find(lang => lang.language_id === this.language_id);

    if (!selectedLanguage) {
      console.error('Selected language not found');
      return;
    }
    this.loading = true;
    this.submission =true;

    // Ensure languageId and questionId are parsed correctly
    const languageId = selectedLanguage.language_id; // No need to parse if it's already a string
    const questionId = this.currentQuestion.id; // No need to parse if it's already a number

    // Debugging logs to verify values
    console.log('Language ID:', languageId);
    console.log('Question ID:', questionId);
    console.log('Code:', code);

    // Call the code execution service
    this.codeExecutionService.executeCode(languageId, code, questionId,this.submission).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.currentQuestion.testCases = response.data.map((testCase: { std_input: any; expected_output: any; stdout: any; status: { description: string; }; }) => ({
            input: testCase.std_input,
            expectedOutput: testCase.expected_output,
            actualOutput: testCase.stdout,
            passed: testCase.status.description === 'Accepted',
            description: testCase.status.description
          }));

          this.passedCount = response.data[0].passed_count; 
          this.totalTestCount = response.data[0].total_test_count;
        }
        this.loading = false; // Reset loading state
        this.submission = false;
      },
      error: (error) => {
        console.error('Error executing code:', error);
        this.loading = false; // Reset loading state
      }
    });

  }
}