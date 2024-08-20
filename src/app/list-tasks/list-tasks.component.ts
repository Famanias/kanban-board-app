
import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../students.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditTasksComponent } from '../edit-tasks/edit-tasks.component';
import { AddTasksComponent } from '../add-tasks/add-tasks.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.css'],
  providers: [DatePipe]
})
export class ListTasksComponent implements OnInit {
  tasks: any[] = [];
  todoTasks: any[] = [];
  doingTasks: any[] = [];
  doneTasks: any[] = [];

  constructor(
    private studentservice: StudentsService,
    private datePipe: DatePipe,
    private dialogRef: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.user_id;
    if (userId) {
      this.fetchTasks(userId);
    }
  }

  fetchTasks(userId: number): void {
    this.studentservice.getTasks(userId).subscribe(
      (result: any) => {
        if (result.success) {
          this.tasks = result.data;
          this.updateTaskLists();
        } else {
          console.error('Error fetching tasks:', result.message);
          this.tasks = [];
        }
      },
      (error) => {
        console.error('Error fetching tasks', error);
        this.tasks = [];
      }
    );
  }
  
  deleteTask(task: any): void {
    this.studentservice.deleteTask(task.id).subscribe(
      () => {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
        this.updateTaskLists();
      },
      (error) => {
        console.error('Error deleting task', error);
      }
    );
  }

  drop(event: CdkDragDrop<any[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.updateTaskPositions(event.container.data, status);
  }

  private updateTaskPositions(tasks: any[], status: string) {
    tasks.forEach((task, index) => {
      task.position = index;
      task.status = status;
    });

    this.studentservice.updateTasksPositions(tasks).subscribe(
      () => {
        console.log('Task positions updated successfully');
      },
      (error) => {
        console.error('Error updating task positions', error);
      }
    );
  }

  private updateTaskLists() {
    this.todoTasks = this.tasks.filter((task) => task.status === 'todo').sort((a, b) => a.position - b.position);
    this.doingTasks = this.tasks.filter((task) => task.status === 'doing').sort((a, b) => a.position - b.position);
    this.doneTasks = this.tasks.filter((task) => task.status === 'done').sort((a, b) => a.position - b.position);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, yyyy h:mm a') || '';
  }

  openEditDialog(taskId: number) {
    const dialogRef = this.dialogRef.open(EditTasksComponent, {
      data: { id: taskId }
    });

    dialogRef.componentInstance.taskUpdated.subscribe(() => {
      this.fetchTasks(JSON.parse(localStorage.getItem('user') || '{}').user_id);
    });
  }

  getDueStatus(taskDate: string): string {
    const now = new Date();
    const taskDueDate = new Date(taskDate);

    const diffInTime = taskDueDate.getTime() - now.getTime();
    const diffInHours = diffInTime / (1000 * 3600);

    if (diffInHours < 0) {
      return 'overdue';
    } else if (diffInHours <= 24) {
      return 'due-today';
    } else if (diffInHours >= 48) {
      return 'due-in-2-days';
    } else {
      return 'on-time';
    }
  }

  openDialog(){
    const dialogRef = this.dialogRef.open(AddTasksComponent);
    dialogRef.componentInstance.taskUpdated.subscribe(() => {
      this.fetchTasks(JSON.parse(localStorage.getItem('user') || '{}').user_id);
    });
  }
}
