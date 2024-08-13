import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { user_name: '', user_pass: '' };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private StudentsService: StudentsService, private router: Router) {}

  login() {
    this.StudentsService.login(this.user).subscribe(response => {
      if (response.success) {
        this.successMessage = response.message;
        this.errorMessage = '';
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = response.message;
        this.successMessage = '';
      }
    }, error => {
      console.error('Login failed', error);
      this.errorMessage = 'Login failed. Please try again.';
    });
  }
}
