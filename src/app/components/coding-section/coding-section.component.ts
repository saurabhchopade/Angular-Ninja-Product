import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as monaco from 'monaco-editor';
import { marked } from 'marked';

interface CodingQuestion {
  id: number;
  title: string;
  problemStatement: string;
  languages: { id: string; name: string }[];
  testCases: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }[];
  userCode: string; // To store user's code for each question
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
              <div class="drag-button" (click)="toggleTestCasePanel()">
                {{ isTestCasePanelExpanded ? '▼' : '▲' }}
              </div>
            </div>
            <div class="test-case-content">
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

    .status {
      margin-left: 10px;
    }

    .pass {
      color: green;
    }

    .fail {
      color: red;
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
  `]
})
export class CodingSectionComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  // List of coding questions
  codingQuestions: CodingQuestion[] = [
    {
      id: 1,
      title: 'Sum of Array',
      problemStatement: `# Problem Statement
Write a function that finds the sum of all numbers in an array.

## Example Input/Output
- Input: [1, 2, 3, 4, 5]
- Output: 15

## Constraints
- Array length <= 1000
- Numbers are positive integers`,
      languages: [
        { id: 'typescript', name: 'TypeScript' },
        { id: 'javascript', name: 'JavaScript' },
        { id: 'python', name: 'Python' },
      ],
      testCases: [
        { input: '[1, 2, 3, 4, 5]', expectedOutput: '15', actualOutput: '', passed: false },
        { input: '[10, 20, 30]', expectedOutput: '60', actualOutput: '', passed: false },
      ],
      userCode: '', // Initialize with empty code
    },
    {
      id: 2,
      title: 'Reverse String',
      problemStatement: `# Problem Statement
Write a function that reverses a string.

## Example Input/Output
- Input: "hello"
- Output: "olleh"

## Constraints
- String length <= 1000`,
      languages: [
        { id: 'typescript', name: 'TypeScript' },
        { id: 'javascript', name: 'JavaScript' },
        { id: 'python', name: 'Python' },
      ],
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"', actualOutput: '', passed: false },
        { input: '"world"', expectedOutput: '"dlrow"', actualOutput: '', passed: false },
      ],
      userCode: 'I am saurabh', // Initialize with empty code
    },
  ];

  currentQuestionIndex = 0; // Track the current question index
  currentQuestion = this.codingQuestions[this.currentQuestionIndex]; // Current question
  selectedLanguage = 'typescript'; // Default language
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  isDarkMode = true;

  // Panel widths
  leftPanelWidth = 300; // Initial width of the left panel
  rightPanelWidth = window.innerWidth - 300; // Initial width of the right panel

  // Editor and test case panel heights
  editorHeight = window.innerHeight * 0.6; // Initial height of the editor
  testCasePanelHeight = window.innerHeight * 0.4; // Initial height of the test case panel

  // Track the state of the test case panel
  isTestCasePanelExpanded = true;

  constructor() {
    // Initialize Monaco Editor
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  initializeEditor() {
    if (this.editorContainer) {
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.currentQuestion.userCode || '', // Load user's code for the current question
        language: this.selectedLanguage,
        theme: this.isDarkMode ? 'vs-dark' : 'vs',
        automaticLayout: true,
      });

      // Save user's code when the editor content changes
      this.editor.onDidChangeModelContent(() => {
        this.currentQuestion.userCode = this.editor?.getValue() || '';
      });
    }
  }

  // Switch to the previous question
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.codingQuestions[this.currentQuestionIndex];
      this.updateEditorContent();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.codingQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.codingQuestions[this.currentQuestionIndex];
      this.updateEditorContent();
    }
  }
  // Update the editor content when switching questions
  updateEditorContent() {
    if (this.editor) {
      this.editor.setValue(this.currentQuestion.userCode || '');
      this.selectedLanguage = this.currentQuestion.languages[0].id; // Reset to default language
      this.updateEditorLanguage();
    }
  }

  // Run code for the current question
  runCode() {
    if (this.editor) {
      const code = this.editor.getValue();
      console.log('Running code:', code);
      // Implement code execution logic
    }
  }

  // Submit all questions
  submitCode() {
    const allAttempted = this.codingQuestions.every((q) => q.userCode.trim() !== '');
    if (allAttempted) {
      console.log('Submitting all questions:', this.codingQuestions);
      alert('All questions submitted successfully!');
    } else {
      alert('Please attempt all questions before submitting.');
    }
  }

  // Reset code for the current question
  resetCode() {
    if (this.editor) {
      this.editor.setValue('');
      this.currentQuestion.userCode = ''; // Clear user's code for the current question
    }
  }

  // Update the editor language when the selected language changes
  updateEditorLanguage() {
    if (this.editor) {
      monaco.editor.setModelLanguage(this.editor.getModel()!, this.selectedLanguage);
    }
  }

  // Toggle between dark and light mode
  toggleTheme() {
    if (this.editor) {
      this.editor.updateOptions({
        theme: this.isDarkMode ? 'vs-dark' : 'vs',
      });
    }
  }

  // Parse markdown content
  parseMarkdown(content: string): string {
    return marked.parse(content) as string;
  }

  // Resize the left and right panels
  startResize(event: MouseEvent) {
    const startX = event.clientX;
    const startLeftWidth = this.leftPanelWidth;
    const startRightWidth = this.rightPanelWidth;

    const mouseMoveHandler = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newLeftWidth = startLeftWidth + deltaX;
      const newRightWidth = startRightWidth - deltaX;

      // Ensure minimum width constraints
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

  // Resize the test case panel
  startResizeTestCase(event: MouseEvent) {
    if (!this.isTestCasePanelExpanded) return; // Disable resizing when collapsed

    const startY = event.clientY;
    const startHeight = this.testCasePanelHeight;

    const mouseMoveHandler = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = startHeight - deltaY;

      // Ensure minimum and maximum height constraints
      const minHeight = 100; // Minimum height for the test case panel
      const maxHeight = window.innerHeight * 0.8; // Maximum height (80% of the window height)

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        this.testCasePanelHeight = newHeight;
        this.editorHeight = window.innerHeight - newHeight; // Adjust editor height dynamically
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  
  // Toggle the test case panel
  toggleTestCasePanel() {
    this.isTestCasePanelExpanded = !this.isTestCasePanelExpanded;
    if (this.isTestCasePanelExpanded) {
      this.testCasePanelHeight = window.innerHeight * 0.4; // Expanded height
    } else {
      this.testCasePanelHeight = 50; // Collapsed height (just enough to show the header)
    }
  }
}