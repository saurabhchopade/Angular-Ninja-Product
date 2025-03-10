import { Routes } from "@angular/router";
import { MainComponent } from "./components/main/main.component";
import { LoginComponent } from "./components/login/login.component";
// import { TestDashboard } from './';
// import { SubjectiveSectionComponent } from './MyComponent/subjective-section/subjective-section.component';
// import { CodingSectionComponent } from './MyComponent/coding-section/coding-section.component';
import { McqSectionComponent } from "./components/mcq-section/mcq-section.component";
import { FeedbackComponent } from "./components/feedback/feedback";
import { AppDashboard } from "./components/dashboard/dashboard.component";
import { InvalidInviteComponent } from "../app/components/invalid-invite/invalid-invite.component";
import { AssessmentLibraryComponent } from "./components/admin/component/assessment-library/assessment-library";

export const routes: Routes = [
  { path: "api/invite/find/:id", component: MainComponent },
  { path: "login", component: LoginComponent },
  { path: "test", component: McqSectionComponent },
  { path: "feedback", component: FeedbackComponent },
  { path: "dashboard", component: AppDashboard },
  { path: "invalid-invite", component: InvalidInviteComponent },
  { path: "asseesment-library", component: AssessmentLibraryComponent },
  { path: "", redirectTo: "/", pathMatch: "full" },
];
