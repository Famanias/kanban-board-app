import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Tasks {
  id?: number;
  task_name?: string;
  task_desc?: string;
  status?: string;
  date?: Date;
  position?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  // baseUrl: string = 'http://localhost/restAPII';
  baseUrl: string = 'http://localhost/restfulapi';

  constructor(private http: HttpClient) { }
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }

  getTasks(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/tasks`);
  }
  
  getSingleTask(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tasks/${id}`);
  }

  // deleteTask(id: number): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/delete?id=${id}`);
  // }

  // deleteTask(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  // }
  
  // deleteTask(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }

  // createTask(task: any): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/tasks/insert`, task);
  // }

  createTask(task: Omit<Tasks, 'id'>): Observable<Tasks> {
    return this.http.post<Tasks>(`${this.baseUrl}/tasks/tasks`, task);
  }

  editTask(task: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/tasks/tasks`, task);
  }

  updateTasksPositions(tasks: any[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/position`, tasks);
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

}
