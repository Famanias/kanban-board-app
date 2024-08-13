import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from '../students.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-tasks',
  templateUrl: './edit-tasks.component.html',
  styleUrls: ['./edit-tasks.component.css']
})
export class EditTasksComponent implements OnInit {
  addForm: FormGroup;
  task_id: number | null = null;

  @Output() taskUpdated = new EventEmitter<void>(); // EventEmitter to notify parent component

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentsService,
    public dialogRef: MatDialogRef<EditTasksComponent>, // Inject MatDialogRef
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.addForm = this.formBuilder.group({
      id: [],
      task_name: ['', Validators.required],
      task_desc: ['', [Validators.required, Validators.maxLength(50)]],
      status: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.task_id = this.data.id; // Get the task ID from the data
    if (this.task_id) {
      this.studentService.getSingleTask(this.task_id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.addForm.patchValue(response.data[0]);
          } else {
            console.error('Error fetching task:', response.message);
            alert('An error occurred while fetching the task.');
          }
        },
        error: (error) => {
          console.error('Error fetching task:', error);
          alert('An error occurred while fetching the task.');
        }
      });
    }
  }

  // onEdit() {
  //   if (this.addForm.valid) {
  //     const formValue = { ...this.addForm.value, id: this.task_id };
  //     this.studentService.editTask(formValue).subscribe(
  //       (response: any) => {
  //         if (response.success) {
  //           // Emit event to notify parent component
  //           this.taskUpdated.emit();
            
  //           // Close the dialog
  //           this.dialogRef.close();

  //           alert(response.message);
  //         } else {
  //           alert('An error occurred while editing the task: ' + response.message);
  //         }
  //       },
  //       error => {
  //         console.error('Error:', error);
  //         alert('An error occurred: ' + (error.message || 'Unknown error'));
  //       }
  //     );
  //   } else {
  //     alert('Please fill all required fields.');
  //   }
  // }

  onEdit() {
    console.log('Edit form value:', this.addForm.value); // Log the data being sent
    this.studentService.editTask(this.addForm.value).subscribe(
      (data: any) => {
        console.log('Response received:', data); // Log the response data
        this.taskUpdated.emit();
            
        // Close the dialog
        this.dialogRef.close();
        alert(data.message);
      },
      error => {
        console.error('Error:', error); // Log the error
        this.taskUpdated.emit();
            
        // Close the dialog
        this.dialogRef.close();
        alert('An error occurred: ' + error.message || 'Unknown error');
      }
    );
  }
}
