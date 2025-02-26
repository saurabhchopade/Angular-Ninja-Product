import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CodeSnippetService {
  private codeSnippets = new Map<string, Map<string, string>>(); // Map<questionId, Map<languageId, code>>

  // BehaviorSubject to track the current code snippet
  private currentCodeSubject = new BehaviorSubject<string>('');
  currentCode$ = this.currentCodeSubject.asObservable();

  constructor() {}

  // Save code snippet for a specific question and language
  saveCodeSnippet(questionId: number, languageId: string, code: string) {
    if (!this.codeSnippets.has(questionId.toString())) {
      this.codeSnippets.set(questionId.toString(), new Map<string, string>());
    }
    this.codeSnippets.get(questionId.toString())?.set(languageId, code);
  }

  // Get code snippet for a specific question and language
  getCodeSnippet(questionId: number, languageId: string): string | undefined {
    return this.codeSnippets.get(questionId.toString())?.get(languageId);
  }

  // Update the current code snippet
  updateCurrentCode(code: string) {
    this.currentCodeSubject.next(code);
  }
}