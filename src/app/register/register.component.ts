import { Component } from '@angular/core';
import { StudentsService } from '../students.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user = { user_name: '', user_pass: '', user_email: '' };
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private StudentsService: StudentsService,
              private router:Router,
  ){

  }
  register() {
    if (this.user.user_pass !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    
    this.StudentsService.register(this.user).subscribe(response => {
      if (response.success) {
        this.successMessage = response.message;
        this.errorMessage = '';
        this.router.navigate(['/login']);

      } else {
        this.errorMessage = response.message;
        this.successMessage = '';
      }
    }, error => {
      console.error('Registration failed', error);
      this.errorMessage = 'Registration failed. Please try again.';
    });
  }

}
