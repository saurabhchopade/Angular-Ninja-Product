import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
  }[];
  userCode: string;
}
@Injectable({
  providedIn: "root",
})
export class CodeSnippetServiceForReset {
  // Map to store code snippets in memory for quick access
  private codeSnippets = new Map<string, Map<string, string>>();

  // Array to store the list of coding questions
  private codingQuestions: CodingQuestion[] = [];

  // BehaviorSubject to track the current code snippet
  private currentCodeSubject = new BehaviorSubject<string>("");
  currentCode$ = this.currentCodeSubject.asObservable();
  constructor(private http: HttpClient) {
    // Listen to the beforeunload event to clear local storage
    window.addEventListener("beforeunload", () =>
      this.clearLocalStorageForReset(),
    );
  }

  saveCodeSnippetForReset(
    questionId: number,
    languageId: string,
    code: string,
  ) {
    // Initialize a new Map for the question if it doesn't exist
    if (!this.codeSnippets.has(questionId.toString())) {
      this.codeSnippets.set(questionId.toString(), new Map<string, string>());
    }

    // Get the map for the questionId
    const questionMap = this.codeSnippets.get(questionId.toString());

    // Check if the map already has exactly one value
    if (questionMap && questionMap.size !== 1) {
      // Save the code snippet in the Map only if the map does not have exactly one value
      questionMap.set(languageId, code);
      // Persist the code snippet in localStorage
      this.storeCodeForReset(questionId, languageId, code);
    } else {
      console.log(
        `Map for questionId ${questionId} already has exactly one entry. No new value added.`,
      );
    }
  }

  // Retrieve a code snippet for a specific question and language
  getCodeSnippetForReset(
    questionId: number,
    languageId: string,
  ): string | undefined {
    // Check the Map first, then fall back to localStorage
    return (
      this.codeSnippets.get(questionId.toString())?.get(languageId) ||
      this.getStoredCodeForReset(questionId, languageId)
    );
  }

  // Update the current code snippet in the BehaviorSubject
  updateCurrentCodeForReset(code: string) {
    this.currentCodeSubject.next(code);
  }

  // Get the list of coding questions
  getCodingQuestionsForReset(): CodingQuestion[] {
    return this.codingQuestions;
  }

  // Save a code snippet to localStorage
  private storeCodeForReset(
    questionId: number,
    languageId: string,
    code: string,
  ) {
    const key = `code_${questionId}_${languageId}`;
    localStorage.setItem(key, code);
  }

  // Retrieve a code snippet from localStorage
  private getStoredCodeForReset(
    questionId: number,
    languageId: string,
  ): string {
    const key = `code_${questionId}_${languageId}`;
    return localStorage.getItem(key) || "";
  }

  // Clear local storage data
  private clearLocalStorageForReset() {
    localStorage.clear();
  }
}
