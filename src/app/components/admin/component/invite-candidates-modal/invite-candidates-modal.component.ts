import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidate, CandidateInviteData } from '../../types/candidate.type';

@Component({
  selector: 'app-invite-candidates-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div 
      *ngIf="isVisible"
      class="fixed inset-0 bg-black/30 z-50 flex justify-end"
      (click)="close()"
    >
      <div 
        class="w-full max-w-2xl bg-white shadow-2xl h-full transform transition-transform duration-300"
        [class.translate-x-0]="isVisible"
        [class.translate-x-full]="!isVisible"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-xl font-semibold text-gray-800">Invite Candidates</h2>
          <button 
            (click)="close()" 
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Content Area -->
        <div class="p-6 h-[calc(100%-128px)] overflow-y-auto">
          <!-- Manual Entry Section -->
          <div *ngIf="!showFileUpload" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-800">Add Candidates</h3>
              <button 
                (click)="showFileUpload = true"
                class="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                <span class="material-icons text-base">upload_file</span>
                Upload multiple candidate details
              </button>
            </div>

            <!-- Candidate List -->
            <div class="space-y-4">
              <div *ngFor="let candidate of candidates; let i = index" 
                   class="p-4 bg-gray-50 rounded-lg space-y-3">
                <div class="flex justify-between items-start">
                  <h4 class="font-medium text-gray-700">Candidate {{i + 1}}</h4>
                  <button 
                    *ngIf="candidates.length > 1"
                    (click)="removeCandidate(i)"
                    class="text-red-500 hover:text-red-700">
                    <span class="material-icons">delete</span>
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <!-- Email -->
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-600 mb-1">
                      Email
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      [(ngModel)]="candidate.email"
                      class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      [class.border-red-300]="!isValidEmail(candidate.email)"
                      placeholder="Enter email address"
                    >
                    <span *ngIf="!isValidEmail(candidate.email)" 
                          class="text-sm text-red-500 mt-1">
                      Please enter a valid email address
                    </span>
                  </div>

                  <!-- First Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                    <input
                      type="text"
                      [(ngModel)]="candidate.firstName"
                      class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter first name"
                    >
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      [(ngModel)]="candidate.lastName"
                      class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter last name"
                    >
                  </div>

                  <!-- Tags -->
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Tags</label>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <span *ngFor="let tag of candidate.tags; let tagIndex = index" 
                            class="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                        {{tag}}
                        <button (click)="removeTag(i, tagIndex)" 
                                class="ml-1 text-gray-500 hover:text-gray-700">
                          <span class="material-icons text-sm">close</span>
                        </button>
                      </span>
                    </div>
                    <div class="flex gap-2">
                      <input
                        type="text"
                        [(ngModel)]="newTags[i]"
                        (keyup.enter)="addTag(i)"
                        class="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Add a tag (max 5)"
                        [disabled]="candidate.tags.length >= 5"
                      >
                      <button 
                        (click)="addTag(i)"
                        [disabled]="candidate.tags.length >= 5"
                        class="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Another Candidate -->
            <button 
              *ngIf="candidates.length < 5"
              (click)="addCandidate()"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2">
              <span class="material-icons">add</span>
              Add Another Candidate
            </button>
          </div>

          <!-- File Upload Section -->
          <div *ngIf="showFileUpload" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-800">Upload Candidates</h3>
              <button 
                (click)="showFileUpload = false"
                class="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                <span class="material-icons text-base">edit</span>
                Add candidates manually
              </button>
            </div>

            <!-- Instructions -->
            <div class="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 class="font-medium text-blue-800 mb-2">Instructions</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Only the first sheet of the Excel file will be considered</li>
                <li>• Email ID is mandatory for each candidate</li>
                <li>• A maximum of 5 tags per candidate can be added</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Supported formats: .xls, .xlsx</li>
              </ul>
            </div>

            <!-- Upload Area -->
            <div 
              class="border-2 border-dashed rounded-lg p-8 text-center"
              [class.border-green-500]="isDragging"
              [class.bg-green-50]="isDragging"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
            >
              <input
                type="file"
                #fileInput
                (change)="onFileSelected($event)"
                accept=".xls,.xlsx"
                class="hidden"
              >
              <span class="material-icons text-4xl text-gray-400 mb-2">upload_file</span>
              <p class="text-gray-600">
                Drag and drop your Excel file here, or
                <button 
                  (click)="fileInput.click()"
                  class="text-green-600 hover:text-green-700 font-medium">
                  browse
                </button>
              </p>
              <p class="text-sm text-gray-500 mt-2">Maximum file size: 5MB</p>
            </div>

            <div *ngIf="selectedFile" class="flex items-center gap-2 text-sm">
              <span class="material-icons text-green-500">check_circle</span>
              <span class="text-gray-700">{{selectedFile.name}}</span>
              <button 
                (click)="removeFile()"
                class="text-red-500 hover:text-red-700 ml-2">
                <span class="material-icons">close</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-between items-center">
          <div class="text-sm text-gray-500">
            {{candidates.length}}/5 candidates added
          </div>
          <div class="flex gap-2">
            <button 
              (click)="close()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              (click)="send()"
              [disabled]="!canSend"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Send Invites
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InviteCandidatesModalComponent {
  @Input() testId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() invitesSent = new EventEmitter<CandidateInviteData>();

  isVisible = false;
  showFileUpload = false;
  isDragging = false;
  selectedFile: File | null = null;
  newTags: string[] = [''];

  candidates: Candidate[] = [{
    email: '',
    firstName: '',
    lastName: '',
    tags: []
  }];

  show() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.closed.emit();
    this.resetForm();
  }

  resetForm() {
    this.candidates = [{
      email: '',
      firstName: '',
      lastName: '',
      tags: []
    }];
    this.newTags = [''];
    this.showFileUpload = false;
    this.selectedFile = null;
  }

  addCandidate() {
    if (this.candidates.length < 5) {
      this.candidates.push({
        email: '',
        firstName: '',
        lastName: '',
        tags: []
      });
      this.newTags.push('');
    }
  }

  removeCandidate(index: number) {
    this.candidates.splice(index, 1);
    this.newTags.splice(index, 1);
  }

  addTag(candidateIndex: number) {
    const tag = this.newTags[candidateIndex].trim();
    if (tag && !this.candidates[candidateIndex].tags.includes(tag) && 
        this.candidates[candidateIndex].tags.length < 5) {
      this.candidates[candidateIndex].tags.push(tag);
      this.newTags[candidateIndex] = '';
    }
  }

  removeTag(candidateIndex: number, tagIndex: number) {
    this.candidates[candidateIndex].tags.splice(tagIndex, 1);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !email || emailRegex.test(email);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      // Handle file too large error
      return;
    }

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      // Handle invalid file type error
      return;
    }

    this.selectedFile = file;
    // Here you would typically parse the Excel file
    // and populate the candidates array
  }

  removeFile() {
    this.selectedFile = null;
  }

  get canSend(): boolean {
    return this.candidates.some(c => c.email && this.isValidEmail(c.email));
  }

  send() {
    if (this.canSend) {
      const validCandidates = this.candidates.filter(c => c.email && this.isValidEmail(c.email));
      this.invitesSent.emit({
        candidates: validCandidates,
        testId: this.testId
      });
      this.close();
    }
  }
}