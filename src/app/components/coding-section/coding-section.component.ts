import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as monaco from 'monaco-editor';
import { marked } from 'marked';

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
              <div [innerHTML]="parseMarkdown(problemStatement)"></div>
            </div>
          </div>
        </div>

        <!-- Resizer for Left and Right Panels -->
        <div class="resizer" (mousedown)="startResize($event)"></div>

        <!-- Right Panel (Code Editor and Test Cases) -->
        <div class="right-panel" [style.width.px]="rightPanelWidth">
          <!-- Toolbar -->
          <div class="toolbar">
            <select [(ngModel)]="selectedLanguage" (change)="updateEditorLanguage()">
              <option *ngFor="let lang of languages" [value]="lang.id">{{ lang.name }}</option>
            </select>

            <button (click)="runCode()">
              ▶ Run
            </button>

            <button (click)="submitCode()">
              Submit
            </button>

            <button (click)="resetCode()">
              Reset
            </button>

            <label class="switch">
              <input type="checkbox" [(ngModel)]="isDarkMode" (change)="toggleTheme()">
              <span class="slider round"></span>
            </label>
          </div>

          <!-- Editor Container -->
          <div class="editor-container" [style.height.px]="editorHeight">
            <div #editorContainer class="editor"></div>
          </div>

          <!-- Test Case Panel -->
          <div class="test-case-panel" [style.height.px]="testCasePanelHeight">
            <div class="test-case-header" (mousedown)="startResizeTestCase($event)">
              Test Cases
            </div>
            <div class="test-case-content">
              <div class="test-case" *ngFor="let testCase of testCases; let i = index">
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
  `]
})
export class CodingSectionComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  problemStatement = `# Problem Statement
Write a function that finds the sum of all numbers in an array.

## Example Input/Output
- Input: [1, 2, 3, 4, 5]
- Output: 15

## Constraints
- Array length <= 1000
- Numbers are positive integers`;

  languages = [
    { id: 'typescript', name: 'TypeScript' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
    { id: 'python', name: 'Python' },
    { id: 'csharp', name: 'C#' }
  ];

  selectedLanguage = 'typescript';
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  isDarkMode = true;

  // Panel widths
  leftPanelWidth = 300; // Initial width of the left panel
  rightPanelWidth = window.innerWidth - 300; // Initial width of the right panel

  // Editor and test case panel heights
  editorHeight = window.innerHeight * 0.6; // Initial height of the editor
  testCasePanelHeight = window.innerHeight * 0.4; // Initial height of the test case panel

  // Test cases
  testCases = [
    {
      input: '[1, 2, 3, 4, 5]',
      expectedOutput: '15',
      actualOutput: '',
      passed: false
    },
    {
      input: '[10, 20, 30]',
      expectedOutput: '60',
      actualOutput: '',
      passed: false
    },
    {
      input: '[1, 2, 3, 4, 5]',
      expectedOutput: '15',
      actualOutput: '',
      passed: false
    },
    {
      input: '[10, 20, 30]',
      expectedOutput: '60',
      actualOutput: '',
      passed: false
    },
    {
      input: '[1, 2, 3, 4, 5]',
      expectedOutput: '15',
      actualOutput: '',
      passed: false
    },
    {
      input: '[10, 20, 30]',
      expectedOutput: '60',
      actualOutput: '',
      passed: false
    }
  ];

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
        value: '',
        language: this.selectedLanguage,
        theme: this.isDarkMode ? 'vs-dark' : 'vs',
        automaticLayout: true,
      });
    }
  }

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

  startResizeTestCase(event: MouseEvent) {
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

  updateEditorLanguage() {
    if (this.editor) {
      monaco.editor.setModelLanguage(this.editor.getModel()!, this.selectedLanguage);
    }
  }

  runCode() {
    if (this.editor) {
      const code = this.editor.getValue();
      console.log('Running code:', code);
      // Implement code execution logic
    }
  }

  submitCode() {
    if (this.editor) {
      const code = this.editor.getValue();
      console.log('Submitting code:', code);
      // Implement submission logic
    }
  }

  resetCode() {
    if (this.editor) {
      this.editor.setValue('');
    }
  }

  parseMarkdown(content: string): string {
    return marked.parse(content) as string;
  }

  toggleTheme() {
    if (this.editor) {
      this.editor.updateOptions({
        theme: this.isDarkMode ? 'vs-dark' : 'vs'
      });
    }
  }
}