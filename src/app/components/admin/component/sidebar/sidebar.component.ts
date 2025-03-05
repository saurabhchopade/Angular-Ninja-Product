import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-64 bg-gradient-to-b from-[#4CAF50] to-[#8BC34A] text-white h-screen">
      <div class="p-6">
        <h1 class="text-2xl font-bold">InterviewNinja</h1>
      </div>
      <nav class="mt-6">
        <ng-container *ngFor="let item of menuItems">
          <a href="#" class="flex items-center px-6 py-3 text-white hover:bg-white/10 transition-colors">
            <span class="material-icons mr-3">{{item.icon}}</span>
            {{item.label}}
          </a>
        </ng-container>
      </nav>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SidebarComponent {
  menuItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'description', label: 'Evaluation Reports' },
    { icon: 'edit', label: 'Online Evaluation' },
    { icon: 'chat', label: 'Feedback' },
    { icon: 'bar_chart', label: 'Metrics Dashboard' },
    { icon: 'calendar_today', label: 'Slots' },
    { icon: 'group', label: 'Panels' },
  ];
}