import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
// import { TestDashboard } from './';
// import { SubjectiveSectionComponent } from './MyComponent/subjective-section/subjective-section.component';
// import { CodingSectionComponent } from './MyComponent/coding-section/coding-section.component';
import { McqSectionComponent } from './components/mcq-section/mcq-section.component';
import { FeedbackComponent } from './components/feedback/feedback';



export const routes: Routes = [
  { path: 'invite/find/:id', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: McqSectionComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];