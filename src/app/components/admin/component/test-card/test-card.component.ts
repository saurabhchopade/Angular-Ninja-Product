import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TestType } from "../../types/test.type";

@Component({
  selector: "app-test-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <!-- Header -->
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-base font-semibold text-gray-800">{{ test.name }}</h3>
        <span [class]="getStatusClass()">{{ test.status }}</span>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div class="flex items-center gap-1">
          <span class="material-icons text-gray-400 text-base">schedule</span>
          <span class="text-gray-600">{{ test.duration }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="material-icons text-gray-400 text-base">group</span>
          <span class="text-gray-600">{{ test.invitedCount }} Invited</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="material-icons text-gray-400 text-base">event</span>
          <span class="text-gray-600">{{ test.testDate }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="material-icons text-gray-400 text-base"
            >check_circle</span
          >
          <span class="text-gray-600">{{ test.completedCount }} Completed</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 mt-4">
        <button
          (click)="onViewReport()"
          class="flex-1 px-3 py-1.5 bg-[#4CAF50] text-white text-sm rounded-md hover:bg-[#43A047] transition-colors flex items-center justify-center gap-1"
        >
          <span class="material-icons text-sm">assessment</span>
          Report
        </button>
        <button
          (click)="onInvite()"
          class="flex-1 px-3 py-1.5 border border-[#4CAF50] text-[#4CAF50] text-sm rounded-md hover:bg-[#4CAF50]/5 transition-colors flex items-center justify-center gap-1"
        >
          <span class="material-icons text-sm">person_add</span>
          Invite
        </button>
        <button
          (click)="onArchive()"
          class="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
        >
          <span class="material-icons text-sm">archive</span>
        </button>
      </div>
    </div>
  `,
})
export class TestCardComponent {
  @Input() test!: TestType;
  @Output() viewReport = new EventEmitter<number>();
  @Output() invite = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();

  getStatusClass(): string {
    const baseClasses = "px-2 py-1 rounded-full text-xs ";
    switch (this.test.status) {
      case "Active":
        return baseClasses + "bg-green-100 text-green-800";
      case "Completed":
        return baseClasses + "bg-blue-100 text-blue-800";
      case "Archived":
        return baseClasses + "bg-gray-100 text-gray-700";
      default:
        return baseClasses + "bg-gray-100 text-gray-800";
    }
  }

  onViewReport() {
    this.viewReport.emit(this.test.id);
  }

  onInvite() {
    this.invite.emit(this.test.id);
  }

  onArchive() {
    this.archive.emit(this.test.id);
  }
}
