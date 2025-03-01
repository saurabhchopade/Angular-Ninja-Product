import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interfaces remain the same as provided

interface Language {
  languageId: number;
  code: string;
  displayName: string;
  version: string;
  category: string;
  notesJson: string;
}

interface CodingQuestionTemplateResponse {
  id: number;
  codingQuestionId: number;
  language: Language;
  snippet: string;
  snippetHead: string;
  snippetTail: string;
}

interface TestCaseResponse {
  id: number;
  codingQuestionId: number;
  inputData: string;
  expectedOutput: string;
  scoreWeight: number;
  isSample: boolean;
  isPublic: boolean;
  timeLimitOverride: number | null;
  memoryLimitOverride: number | null;
}

interface CodingQuestionResponse {
  id: number;
  questionResponse: {
    id: number;
    type: string;
    title: string;
    problemStatement: string;
    difficultyLevel: string;
    maxScore: number;
    negativeScore: number;
    timeBoundSeconds: number;
    isDraft: boolean;
    aiEvaluationEnabled: boolean;
  };
  editorial: string;
  timeLimit: number;
  memoryLimit: number;
}

interface ApiResponseItem {
  codingQuestionResponse: CodingQuestionResponse;
  codingQuestionTemplateResponse: CodingQuestionTemplateResponse[];
  testcaseResponse: TestCaseResponse[];
}

interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: ApiResponseItem[];
  timestamp: string;
}

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
  }[];
  userCode: string;
}
@Injectable({
  providedIn: 'root',
})
export class CodeSnippetService {
  // Map to store code snippets in memory for quick access
  private codeSnippets = new Map<string, Map<string, string>>();

  // Array to store the list of coding questions
  private codingQuestions: CodingQuestion[] = [];

  // BehaviorSubject to track the current code snippet
  private currentCodeSubject = new BehaviorSubject<string>('');
  currentCode$ = this.currentCodeSubject.asObservable();

  // API endpoint to fetch coding questions
  private apiUrl = 'http://localhost:8080/api/codingQuestion/findByAssessmentIdAndSectionId/assessment/1/section/1';

  constructor(private http: HttpClient) {
    // Listen to the beforeunload event to clear local storage
    window.addEventListener('beforeunload', () => this.clearLocalStorage());
  }

  // Fetch coding questions from the API
  fetchCodingQuestions(): Observable<CodingQuestion[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map((response) => {
        // Map the API response to the CodingQuestion interface
        this.codingQuestions = response.data.map((item: ApiResponseItem) => ({
          id: item.codingQuestionResponse.id,
          title: item.codingQuestionResponse.questionResponse.title,
          problemStatement: item.codingQuestionResponse.questionResponse.problemStatement,
          languages: item.codingQuestionTemplateResponse.map((template: CodingQuestionTemplateResponse) => ({
            id: template.language.code,
            name: template.language.displayName,
            snippet: template.snippet,
            language_id:template.language.languageId
          })),
          testCases: item.testcaseResponse.map((testCase: TestCaseResponse) => ({
            input: testCase.inputData,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '',
            passed: false,
          })),
          // Retrieve the stored code snippet for the default language
          userCode: this.getStoredCode(item.codingQuestionResponse.id, item.codingQuestionTemplateResponse[0].language.code),
        }));
        return this.codingQuestions;
      })
    );
  }

  // Save a code snippet for a specific question and language
  saveCodeSnippet(questionId: number, languageId: string, code: string) {
    // Initialize a new Map for the question if it doesn't exist
    if (!this.codeSnippets.has(questionId.toString())) {
      this.codeSnippets.set(questionId.toString(), new Map<string, string>());
    }
    // Save the code snippet in the Map
    this.codeSnippets.get(questionId.toString())?.set(languageId, code);
    // Persist the code snippet in localStorage
    this.storeCode(questionId, languageId, code);
  }

  // Retrieve a code snippet for a specific question and language
  getCodeSnippet(questionId: number, languageId: string): string | undefined {
    // Check the Map first, then fall back to localStorage
    return this.codeSnippets.get(questionId.toString())?.get(languageId) || this.getStoredCode(questionId, languageId);
  }

  // Update the current code snippet in the BehaviorSubject
  updateCurrentCode(code: string) {
    this.currentCodeSubject.next(code);
  }

  // Get the list of coding questions
  getCodingQuestions(): CodingQuestion[] {
    return this.codingQuestions;
  }

  // Save a code snippet to localStorage
  private storeCode(questionId: number, languageId: string, code: string) {
    const key = `code_${questionId}_${languageId}`;
    localStorage.setItem(key, code);
  }

  // Retrieve a code snippet from localStorage
  private getStoredCode(questionId: number, languageId: string): string {
    const key = `code_${questionId}_${languageId}`;
    return localStorage.getItem(key) || '';
  }

  // Clear local storage data
  private clearLocalStorage() {
    localStorage.clear();
  }
}