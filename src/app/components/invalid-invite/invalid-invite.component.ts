import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invalid-invite',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="invalid-invite-container">
      <div class="invalid-invite-card">
        <div class="invalid-invite-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h1>Invalid Invitation</h1>
        </div>
        
        <div class="invalid-invite-content">
          <p class="main-message">The invitation link you've used is either invalid or has expired.</p>
          
          <div class="info-box">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div class="info-text">
              <p>This could be due to one of the following reasons:</p>
              <ul>
                <li>The invitation link has expired</li>
                <li>The assessment has been completed</li>
                <li>The invitation has been revoked</li>
                <li>The URL was entered incorrectly</li>
              </ul>
            </div>
          </div>
          
          <div class="action-section">
            <p>If you believe this is an error, please contact the assessment administrator or check your email for a valid invitation link.</p>
            
            <div class="buttons">
              <button class="contact-btn">Contact Support</button>
              <button class="home-btn" routerLink="/">Return to Home</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invalid-invite-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      padding: 24px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .invalid-invite-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 600px;
      overflow: hidden;
    }

    .invalid-invite-header {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      color: white;
      padding: 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .invalid-invite-header h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .invalid-invite-content {
      padding: 24px;
    }

    .main-message {
      font-size: 1.1rem;
      color: #2c3e50;
      text-align: center;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .info-box {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .info-icon {
      color: #4CAF50;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .info-text p {
      margin-top: 0;
      margin-bottom: 12px;
      color: #495057;
    }

    .info-text ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-text li {
      margin-bottom: 8px;
      color: #495057;
    }

    .action-section {
      text-align: center;
    }

    .action-section p {
      color: #6c757d;
      margin-bottom: 20px;
    }

    .buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    .contact-btn, .home-btn {
      padding: 10px 20px;
      border-radius: 30px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-size: 0.9rem;
    }

    .contact-btn {
      background: #e9ecef;
      color: #495057;
    }

    .contact-btn:hover {
      background: #dee2e6;
    }

    .home-btn {
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      color: white;
      box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
    }

    .home-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
    }

    @media (max-width: 576px) {
      .invalid-invite-header {
        padding: 20px;
      }

      .invalid-invite-header h1 {
        font-size: 1.5rem;
      }

      .invalid-invite-content {
        padding: 20px;
      }

      .buttons {
        flex-direction: column;
        gap: 12px;
      }

      .contact-btn, .home-btn {
        width: 100%;
      }
    }
  `]
})
export class InvalidInviteComponent {
  // No additional logic needed for this component
}