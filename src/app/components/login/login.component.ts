import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
  <div class="page-container">
    <nav class="navbar">
      <div class="nav-brand">InterviewNinja</div>
    </nav>
  
    <div class="main-content">
      <div class="login-container">
        <div class="login-box">
          <div class="header-section">
            <h2>Start Your Test</h2>
            <p class="subtitle">Enter your email to begin</p>
          </div>
  
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="Enter your email"
                [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              >
              <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>

            <button type="button" (click)="startTest()" [disabled]="!loginForm.valid" class="start-test-btn">
              <span class="button-icon">🎯</span>
              <span class="button-text">Start Test</span>
            </button>
  
            <div class="form-footer">
              <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
            </div>
          </form>
        </div>
  
        <div class="features-section">
          <div class="feature-card">
            <span class="feature-icon">🏆</span>
            <h3>Test Your Skills</h3>
            <p>Showcase your coding expertise and tackle real-world challenges.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">👥</span>
            <h3>Challenge Yourself</h3>
            <p>Go head-to-head with top coders.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🚀</span>
            <h3>Stay Focused</h3>
            <p>Take the test with confidence!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    /* Global Container */
    .page-container {
      min-height: 100vh;
      background-color: #f8f9fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Navigation */
    .navbar {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 56px;
    }

    .nav-brand {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    /* Main content */
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 1rem 2rem;
    }

    .login-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .login-box {
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .header-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #6c757d;
      font-size: 1.1rem;
    }

    /* Form styles */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 500;
      color: #495057;
    }

    input {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }

    input.error {
      border-color: #e53935;
    }

    .error-message {
      color: #e53935;
      font-size: 0.875rem;
    }

    /* Button styles */
    .start-test-btn {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .start-test-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(76, 175, 80, 0.35);
    }

    .start-test-btn:disabled {
      background: #e0e0e0;
      color: #9e9e9e;
      box-shadow: none;
      cursor: not-allowed;
    }

    .button-icon {
      font-size: 1.25rem;
    }

    /* Features section */
    .features-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      text-align: center;
      transition: transform 0.2s;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .feature-card h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #6c757d;
    }

    .form-footer {
      text-align: center;
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 1rem;
    }

    .form-footer a {
      color: #4CAF50;
      text-decoration: none;
    }

    .form-footer a:hover {
      text-decoration: underline;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .login-container {
        grid-template-columns: 1fr;
      }

      .features-section {
        grid-template-columns: 1fr;
      }

      .login-box {
        padding: 1.5rem;
      }

      h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.startTest();
    }
  }

  startTest() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      console.log('Starting test for email:', email);
      
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}