import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside 
      class="sidebar bg-gradient-to-b from-[#4CAF50] to-[#8BC34A] text-white h-screen transition-all duration-300 ease-in-out"
      [class.collapsed]="collapsed"
    >
      <!-- Toggle Button -->
      <div 
        class="toggle-button absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-[#4CAF50] p-2 rounded-full cursor-pointer shadow-lg hover:bg-gray-100 transition-colors"
        (click)="toggleCollapse()"
      >
        <span class="material-icons text-xl">
          {{ collapsed ? 'chevron_right' : 'chevron_left' }}
        </span>
      </div>

      <!-- Sidebar Content -->
      <div class="p-6 overflow-hidden">
        <h1 
          class="text-2xl font-bold whitespace-nowrap transition-opacity duration-300 ease-in-out" 
          [class.opacity-0]="collapsed"
          [class.invisible]="collapsed"
        >
          InterviewNinja
        </h1>
      </div>
      <nav class="mt-6 overflow-hidden">
        <ng-container *ngFor="let item of menuItems">
          <a 
            href="#" 
            class="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors"
          >
            <span class="material-icons mr-3">{{ item.icon }}</span>
            <span 
              class="whitespace-nowrap transition-opacity duration-300 ease-in-out" 
              [class.opacity-0]="collapsed"
              [class.invisible]="collapsed"
            >
              {{ item.label }}
            </span>
          </a>
        </ng-container>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 16rem; /* Default width */
      position: relative;
      transition: width 0.3s ease-in-out;
    }

    .sidebar.collapsed {
      width: 5rem; /* Collapsed width */
    }

    .toggle-button {
      z-index: 10;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Smooth transition for text */
    .transition-opacity {
      transition: opacity 0.3s ease-in-out;
    }

    .opacity-0 {
      opacity: 0;
    }

    .invisible {
      visibility: hidden;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
      .sidebar {
        width: 5rem; /* Collapsed by default on smaller screens */
      }

      .sidebar:not(.collapsed) {
        width: 16rem; /* Expanded width */
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed: boolean = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  menuItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'description', label: 'Evaluation Reports' },
    { icon: 'edit', label: 'Online Evaluation' },
    { icon: 'chat', label: 'Feedback' },
    { icon: 'bar_chart', label: 'Metrics Dashboard' },
    { icon: 'calendar_today', label: 'Slots' },
    { icon: 'group', label: 'Panels' },
  ];

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}