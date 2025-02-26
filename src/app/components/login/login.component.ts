import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InviteService } from '../../services/invite.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [InviteService],
})
export class LoginComponent{
  loginForm: FormGroup;
  inviteStatusMessage: string = '';
  inviteData: any = null;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inviteService: InviteService,
    private dataService: DataService
  ) 



  {
    this.loginForm = this.fb.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      // Implement further login logic here
    }
  }

  ngOnInit() {
    this.inviteData = this.dataService.getCurrentData(); // Fetch last stored value
    this.dataService.inviteData$.subscribe(data => {
      this.inviteData = data;
      console.log('Received Data:', this.inviteData);
    });
  }
  

  startTest() {
    

    console.log('Received Data:=======================-------------', this.inviteData);

    if (this.loginForm.valid) {
      console.log('Starting test for:', this.loginForm.value);
      
      // Print invite data details
      if (this.inviteData) {
        console.log('Invite Data:', this.inviteData);
        console.log('Candidate Name:', this.inviteData.validate?.candidateFullName);
        console.log('Assessment Name:', this.inviteData.validate?.assessmentName);
        console.log('Invite Link:', this.inviteData.validate?.inviteLink);
        console.log('Assessment Start Time:', this.inviteData.validate?.assessmentStartTime);
      } else {
        console.warn('No invite data found!');
      }
  
      // this.router.navigate(['/test']);
      alert('Test is starting... Good luck!');
    } else {
      alert('Please fill in the required details before starting the test.');
    }
  }
  
}
