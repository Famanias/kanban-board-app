import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router, private http:HttpClient) {}

  apiUrl: string = 'http://localhost/phprestAPII/';

  isAuthenticated(): boolean {
    // Check if the token exists
    return !!localStorage.getItem('authToken');
  }

  // register(username: string, password: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/register.php`, { username, password });
  // }

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login.php`, { username, password });
  // }

  // getUserTasks(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/getUserTasks.php`);
  // }

  logout() {
    // Remove the token from local storage or wherever it's stored
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.alert('Logout successfully');
    // Redirect the user to the login page
    this.router.navigate(['/login']);
  }
}
