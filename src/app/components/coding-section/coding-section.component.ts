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
    <div class="coding-container" [class.dark-theme]="darkMode">
      <!-- Main Split Container -->
      <div class="split-container">
        <!-- Left Panel -->
        <div class="left-panel">
          <!-- Collapsible Sections -->
          <div class="collapsible-section" *ngFor="let section of sections">
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
          </div>

          <!-- Editor Container -->
          <div class="editor-container">
            <div #editorContainer class="editor"></div>
          </div>

          <!-- Output Section -->
          <div class="output-section">
            <pre>{{ output }}</pre>
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
      background-color: #1e1e1e;
      color: #fff;
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
      background-color: #252526;
      padding: 10px;
      overflow-y: auto;
    }

    .right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #1e1e1e;
    }

    .resizer {
      width: 5px;
      background-color: #333;
      cursor: ew-resize;
    }

    .collapsible-section {
      margin-bottom: 10px;
    }

    .section-header {
      width: 100%;
      padding: 10px;
      background-color: #333;
      color: #fff;
      border: none;
      text-align: left;
      cursor: pointer;
    }

    .section-content {
      padding: 10px;
      background-color: #2d2d2d;
      display: none;
    }

    .section-content.expanded {
      display: block;
    }

    .toolbar {
      padding: 10px;
      background-color: #333;
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

    .output-section {
      padding: 10px;
      background-color: #252526;
      color: #fff;
      max-height: 150px;
      overflow-y: auto;
    }

    .status-bar {
      padding: 5px;
      background-color: #333;
      color: #fff;
      font-size: 12px;
    }
  `]
})
export class CodingSectionComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  sections = [
    {
      title: 'Problem Description',
      content: `
# Problem Statement

Write a function that finds the sum of all numbers in an array.

## Example Input/Output

* Input: [1, 2, 3, 4, 5]
* Output: 15

## Constraints
- Array length <= 1000
- Numbers are positive integers
`,
      expanded: true
    },
    {
      title: 'Hints',
      content: `
1. Consider using array.reduce()
2. Handle edge cases (empty arrays)
3. Optimize for large inputs
`,
      expanded: false
    }
  ];

  languages = [
    { id: 'typescript', name: 'TypeScript' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' }
  ];

  selectedLanguage = 'typescript';
  output = '';
  errorCount = 0;
  editor: monaco.editor.IStandaloneCodeEditor | null = null;

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
        theme: 'vs-dark',
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
  
  
  private async executeCode(code: string, language: string): Promise<string> {
    // Implement your code execution logic here
    return 'Execution result';
  }
}