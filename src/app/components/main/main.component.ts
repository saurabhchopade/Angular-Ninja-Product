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
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
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
          if (inviteStatus === "Published") {
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
