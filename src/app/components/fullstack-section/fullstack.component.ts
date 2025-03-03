import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-fullstack-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="fullstack-container">
      <div class="section-header">
        <h2>Full Stack Assessment</h2>
        <div class="section-badge">Section 4</div>
      </div>

      <div class="question-container">
        <div class="question-card">
          <div class="question-header">
            <span class="question-number">Question 1</span>
            <span class="question-type">Full Stack Implementation</span>
          </div>
          
          <div class="question-content">
            <p class="question-text">
              Create a simple user management system with the following features:
            </p>
            
            <ul class="requirements-list">
              <li>User registration form with validation</li>
              <li>User login functionality</li>
              <li>Dashboard to display user information</li>
              <li>Ability to update user profile</li>
            </ul>
            
            <p class="instruction-text">
              Implement both frontend and backend components. Upload your solution files below.
            </p>
          </div>
          
          <div class="file-upload-section">
            <div class="upload-container">
              <div class="upload-header">
                <h3>Upload Solution Files</h3>
                <span class="file-format">Accepted formats: .zip, .rar, .tar.gz (Max: 10MB)</span>
              </div>
              
              <div class="upload-area" 
                   [class.drag-over]="isDragging" 
                   (dragover)="onDragOver($event)" 
                   (dragleave)="onDragLeave($event)" 
                   (drop)="onDrop($event)">
                <div class="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <p class="upload-text">Drag and drop files here or</p>
                <label class="upload-button">
                  Browse Files
                  <input type="file" (change)="onFileSelected($event)" multiple hidden>
                </label>
              </div>
              
              @if (uploadedFiles.length > 0) {
                <div class="uploaded-files">
                  <h4>Uploaded Files</h4>
                  <ul class="file-list">
                    @for (file of uploadedFiles; track file.name) {
                      <li class="file-item">
                        <div class="file-info">
                          <span class="file-name">{{ file.name }}</span>
                          <span class="file-size">{{ formatFileSize(file.size) }}</span>
                        </div>
                        <button class="remove-file-btn" (click)="removeFile(file)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
            
            <div class="additional-notes">
              <h3>Additional Notes</h3>
              <textarea 
                placeholder="Add any notes or explanations about your implementation here..."
                rows="4"
                [(ngModel)]="additionalNotes"
              ></textarea>
            </div>
            
            <div class="submission-actions">
              <button class="save-btn">Save Progress</button>
              <button class="submit-btn" [disabled]="uploadedFiles.length === 0">Submit Solution</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* FullStack Section Styles */
    .fullstack-container {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }

    .section-badge {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .question-container {
      margin-bottom: 24px;
    }

    .question-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .question-header {
      padding: 16px 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .question-number {
      font-weight: 600;
      color: #4CAF50;
    }

    .question-type {
      font-size: 0.875rem;
      color: #6c757d;
      background: #e9ecef;
      padding: 4px 10px;
      border-radius: 4px;
    }

    .question-content {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .question-text {
      font-size: 1.1rem;
      color: #2c3e50;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .requirements-list {
      margin: 16px 0;
      padding-left: 24px;
    }

    .requirements-list li {
      margin-bottom: 8px;
      color: #495057;
    }

    .instruction-text {
      color: #6c757d;
      font-style: italic;
      margin-top: 16px;
    }

    .file-upload-section {
      padding: 20px;
    }

    .upload-container {
      margin-bottom: 24px;
    }

    .upload-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .upload-header h3 {
      font-size: 1.1rem;
      color: #2c3e50;
      margin: 0;
    }

    .file-format {
      font-size: 0.75rem;
      color: #6c757d;
    }

    .upload-area {
      border: 2px dashed #ced4da;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      transition: all 0.3s ease;
      background: #f8f9fa;
      cursor: pointer;
    }

    .upload-area:hover, .upload-area.drag-over {
      border-color: #4CAF50;
      background: #e8f5e9;
    }

    .upload-icon {
      color: #6c757d;
      margin-bottom: 16px;
    }

    .upload-text {
      color: #495057;
      margin-bottom: 16px;
    }

    .upload-button {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .upload-button:hover {
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }

    .uploaded-files {
      margin-top: 24px;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
    }

    .uploaded-files h4 {
      font-size: 1rem;
      color: #2c3e50;
      margin: 0 0 12px 0;
    }

    .file-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: white;
      border-radius: 4px;
      margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .file-info {
      display: flex;
      flex-direction: column;
    }

    .file-name {
      font-weight: 500;
      color: #495057;
    }

    .file-size {
      font-size: 0.75rem;
      color: #6c757d;
    }

    .remove-file-btn {
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .remove-file-btn:hover {
      background: #f8d7da;
    }

    .additional-notes {
      margin-bottom: 24px;
    }

    .additional-notes h3 {
      font-size: 1.1rem;
      color: #2c3e50;
      margin: 0 0 12px 0;
    }

    textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ced4da;
      border-radius: 8px;
      resize: vertical;
      font-family: inherit;
      transition: border-color 0.2s ease;
    }

    textarea:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.25);
    }

    .submission-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
    }

    .save-btn {
      background: #e9ecef;
      color: #495057;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .save-btn:hover {
      background: #dee2e6;
    }

    .submit-btn {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .submit-btn:hover {
      background: linear-gradient(90deg, #43A047, #7CB342);
    }

    .submit-btn:disabled {
      background: #ced4da;
      cursor: not-allowed;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
      .fullstack-container {
        padding: 16px;
      }

      .upload-area {
        padding: 20px;
      }

      .upload-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .submission-actions {
        flex-direction: column;
        gap: 12px;
      }

      .save-btn, .submit-btn {
        width: 100%;
      }
    }
  `]
})
export class FullstackSectionComponent {
  isDragging = false;
  uploadedFiles: File[] = [];
  additionalNotes = '';

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
    
    if (event.dataTransfer?.files) {
      const files = event.dataTransfer.files;
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(files: FileList) {
    Array.from(files).forEach(file => {
      // Check if file is already in the list
      if (!this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
        this.uploadedFiles.push(file);
      }
    });
  }

  removeFile(file: File) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}