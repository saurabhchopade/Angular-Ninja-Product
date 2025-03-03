import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AppDashboard } from './app/components/dashboard/dashboard.component';
import { appConfig } from './app/app.config';
import { MainComponent } from '../src/app/components/main/main.component';
import { FeedbackComponent } from '../src/app/components/feedback/feedback';


bootstrapApplication(AppDashboard, appConfig).catch((err) => console.error(err));