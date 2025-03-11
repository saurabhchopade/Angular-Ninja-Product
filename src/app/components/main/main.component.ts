import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { InviteService } from "../../services/invite.service"; // Import the InviteService
import { HttpClientModule } from "@angular/common/http"; // Import HttpClientModule for HTTP calls
import { DataService } from "../../services/data.service"; // Import DataService

@Component({
  selector: "app-main",
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule], // Import HttpClientModule
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .loading-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    /* Enhanced Progress Bar */
    .progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
      overflow: hidden;
    }

    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 30%;
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      animation: progress 1.2s ease-in-out infinite;
      transform: translateZ(0);
      box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
    }

    /* Enhanced Dots Container */
    .dots-container {
      display: flex;
      gap: 12px;
      margin: 32px 0;
      padding: 16px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.05),
        0 8px 30px rgba(76, 175, 80, 0.1);
      backdrop-filter: blur(8px);
    }

    /* Enhanced Dots */
    .dot {
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #4caf50, #8bc34a);
      border-radius: 50%;
      animation: pulse 1.2s ease-in-out infinite;
      transform: translateZ(0);
      box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
    }

    .dot:nth-child(2) { 
      animation-delay: 0.2s;
      background: linear-gradient(135deg, #57b95b, #97c95a);
    }
    
    .dot:nth-child(3) { 
      animation-delay: 0.4s;
      background: linear-gradient(135deg, #66c266, #a3cf6a);
    }

    /* Enhanced Skeleton Elements */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
      border-radius: 12px;
      margin: 12px 0;
      animation: skeleton-loading 1.5s ease-in-out infinite;
      transform: translateZ(0);
      box-shadow: 
        0 2px 10px rgba(0, 0, 0, 0.05),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    }

    .skeleton-text {
      height: 24px;
      width: 250px;
      margin-bottom: 16px;
    }

    .skeleton-block {
      height: 120px;
      width: 100%;
      max-width: 450px;
      margin: 24px 0;
    }

    /* Background Decorative Elements */
    .loading-container::before,
    .loading-container::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      z-index: -1;
    }

    .loading-container::before {
      top: -100px;
      right: -100px;
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
      animation: float 6s ease-in-out infinite;
    }

    .loading-container::after {
      bottom: -100px;
      left: -100px;
      background: linear-gradient(135deg, rgba(139, 195, 74, 0.1), rgba(76, 175, 80, 0.1));
      animation: float 8s ease-in-out infinite reverse;
    }

    /* Enhanced Animations */
    @keyframes pulse {
      0%, 100% { 
        transform: scale(0.8);
        opacity: 0.5;
        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
      }
      50% { 
        transform: scale(1.1);
        opacity: 1;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
      }
    }

    @keyframes progress {
      0% { 
        left: -30%;
        transform: skewX(-15deg);
      }
      100% { 
        left: 100%;
        transform: skewX(-15deg);
      }
    }

    @keyframes skeleton-loading {
      0% { opacity: 0.6; transform: translateX(-10px); }
      50% { opacity: 1; transform: translateX(0); }
      100% { opacity: 0.6; transform: translateX(-10px); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .loading-container {
        padding: 12px;
      }

      .dots-container {
        padding: 12px;
        gap: 8px;
      }

      .dot {
        width: 12px;
        height: 12px;
      }

      .skeleton-text {
        width: 200px;
      }

      .skeleton-block {
        height: 100px;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .progress-bar::after,
      .dot,
      .skeleton,
      .loading-container::before,
      .loading-container::after {
        animation: none;
        transition: none;
      }
    }
  `],
  template: `
    <div class="progress-bar" role="progressbar" aria-label="Loading progress"></div>
    <div class="loading-container">
      <div class="dots-container" aria-label="Loading content, please wait">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-block"></div>
      <div class="skeleton skeleton-text"></div>
    </div>
  `
})
export class MainComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inviteService: InviteService, // Inject the InviteService
    private dataService: DataService, // Inject DataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        console.log("Extracted ID:", id);
        this.checkInviteStatus(id); // Call the service to check invite status
      } else {
        console.error("No ID found in the URL");
        alert("Invalid invite link. No ID found.");
      }
    });
  }

  checkInviteStatus(id: string): void {
    this.inviteService.checkInviteStatus(id).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        if (response.code === 200 && response.status === "SUCCESS") {
          const inviteStatus = response.data.inviteDto.inviteStatus;
          if (inviteStatus === "Published" ||  inviteStatus === "Active") {
            // Allow navigation to the login page with the invite ID as a query parameter
            this.router.navigate(["login"], { queryParams: { inviteId: id } });
          } else {
            alert("Invite link is not active or has expired.");
          }
        } else {
          alert("Invalid invite link. Please check the link and try again.");
        }
      },
      error: (error) => {
        console.error("API Error:", error);
        this.router.navigate(["invalid-invite"]).then((success) => {
          if (success) {
            console.log("Navigation to feedback successful");
          } else {
            console.error("Navigation to feedback failed");
          }
        });
        // alert('An error occurred while validating the invite link. Please try again later.');
      },
    });
  }
}
