import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as monaco from 'monaco-editor';
import { marked } from 'marked';

interface CodingQuestion {
  id: number;
  question: string;
  sampleInput?: string;
  sampleOutput?: string;
  hints?: string[];
}

@Component({
  selector: 'app-coding-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="coding-container" [ngClass]="{'dark-mode': isDarkMode, 'light-mode': !isDarkMode}">
      <!-- Main Split Container -->
      <div class="split-container">
        <!-- Left Panel -->
        <div class="left-panel">
          <!-- Problem Statement Section -->
          <div class="problem-statement-container" [style.height.px]="problemStatementHeight">
            <div class="problem-statement-header" (mousedown)="startResizeProblemStatement($event)">
              Problem Statement
            </div>
            <div class="problem-statement-content">
              <div [innerHTML]="parseMarkdown(sections[0].content)"></div>
            </div>
          </div>
          <!-- Hints Section -->
          <div class="collapsible-section" *ngFor="let section of sections.slice(1)">
            <button class="section-header" (click)="toggleSection(section)">
              {{ section.title }}
              <span class="arrow">{{ section.expanded ? '▼' : '▶' }}</span>
            </button>
            <div class="section-content" [class.expanded]="section.expanded">
              <div [innerHTML]="parseMarkdown(section.content)"></div>
            </div>
          </div>
        </div>

        <!-- Resizer -->
        <div class="resizer" (mousedown)="startResize($event)"></div>

        <!-- Right Panel -->
        <div class="right-panel">
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
          <div class="editor-container">
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

          <!-- Status Bar -->
          <div class="status-bar">
            Language: {{ selectedLanguage }}
            | Position: L{{ editor?.getPosition()?.lineNumber }},C{{ editor?.getPosition()?.column }}
            | Errors: {{ errorCount }}
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
      width: 30%;
      min-width: 250px;
      max-width: 500px;
      background-color: var(--section-background);
      padding: 10px;
      overflow-y: auto;
    }

    .right-panel {
      flex: 1;
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
      cursor: ns-resize;
    }

    .problem-statement-content {
      padding: 10px;
      background-color: var(--section-content-background);
      overflow-y: auto;
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
      overflow-y: auto; /* Enable vertical scrolling */
      height: calc(100% - 40px); /* Adjust height based on header height */
    }

    .collapsible-section {
      margin-bottom: 10px;
    }

    .section-header {
      width: 100%;
      padding: 10px;
      background-color: var(--section-header-background);
      color: var(--text-color);
      border: none;
      text-align: left;
      cursor: pointer;
    }

    .section-content {
      padding: 10px;
      background-color: var(--section-content-background);
      display: none;
    }

    .section-content.expanded {
      display: block;
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

    .status-bar {
      padding: 5px;
      background-color: var(--status-bar-background);
      color: var(--text-color);
      font-size: 12px;
    }

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

  sections = [
    {
      title: 'Problem Description',
      content: ` # Problem Statement  Write a function that finds the sum of all numbers in an array.  ## Example Input/Output  * Input: [1, 2, 3, 4, 5] * Output: 15  ## Constraints - Array length <= 1000 - Numbers are positive integers `,
      expanded: true
    },
    {
      title: 'Hints',
      content: ` 1. Consider using array.reduce() 2. Handle edge cases (empty arrays) 3. Optimize for large inputs `,
      expanded: false
    }
  ];

  languages = [
    { id: 'typescript', name: 'TypeScript' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
    { id: 'python', name: 'Python' },
    { id: 'csharp', name: 'C#' }
  ];

  selectedLanguage = 'typescript';
  output = '';
  errorCount = 0;
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  isDarkMode = true;
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
      input: '[10, 20, 30]',
      expectedOutput: '60',
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

  problemStatementHeight = 300;
  testCasePanelHeight = 150;

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

      this.editor.onDidChangeModelContent(() => {
        this.checkErrors();
      });
    }
  }

  toggleSection(section: any) {
    section.expanded = !section.expanded;
  }

  startResize(event: MouseEvent) {
    const startX = event.clientX;
    const startLeftWidth = (document.querySelector('.left-panel') as HTMLElement)?.offsetWidth || 0;

    const mouseMoveHandler = (e: MouseEvent) => {
      const width = startLeftWidth + (e.clientX - startX);
      const leftPanel = document.querySelector('.left-panel') as HTMLElement;
      if (leftPanel && width >= 250 && width <= window.innerWidth * 0.8) {
        leftPanel.style.width = `${width}px`;
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  startResizeProblemStatement(event: MouseEvent) {
    const startY = event.clientY;
    const startHeight = this.problemStatementHeight;

    const mouseMoveHandler = (e: MouseEvent) => {
      const height = startHeight + (e.clientY - startY);
      if (height >= 100 && height <= window.innerHeight * 0.5) {
        this.problemStatementHeight = height;
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
      const deltaY = e.clientY - startY; // Calculate the difference in Y-axis
      const newHeight = startHeight - deltaY; // Adjust height based on drag direction
  
      // Ensure the height stays within reasonable bounds
      const minHeight = 100; // Minimum height for the test case panel
      const maxHeight = window.innerHeight * 0.8; // Maximum height (80% of the window height)
  
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        this.testCasePanelHeight = newHeight;
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

  async runCode() {
    if (this.editor) {
      const code = this.editor.getValue();
      try {
        this.output = await this.executeCode(code, this.selectedLanguage);
        this.errorCount = 0;
        this.testCases.forEach(testCase => {
          testCase.actualOutput = this.output;
          testCase.passed = testCase.actualOutput === testCase.expectedOutput;
        });
      } catch (error) {
        this.output = error instanceof Error ? error.message : 'An unknown error occurred';
        this.errorCount++;
      }
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
      this.output = '';
      this.errorCount = 0;
      this.testCases.forEach(testCase => {
        testCase.actualOutput = '';
        testCase.passed = false;
      });
    }
  }

  checkErrors() {
    if (this.editor) {
      const model = this.editor.getModel();
      if (model) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        this.errorCount = markers.filter(marker => marker.severity === monaco.MarkerSeverity.Error).length;
      }
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

  private async executeCode(code: string, language: string): Promise<string> {
    // Implement your code execution logic here
    return 'Execution result';
  }
}