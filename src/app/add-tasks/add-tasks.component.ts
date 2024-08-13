import { Component, OnInit, Inject, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, Validators, FormGroup  } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from '../students.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.css']
})
export class AddTasksComponent implements OnInit {
  addForm: any;
  userId: number | null = null;

  @Output() taskUpdated = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentsService,
    public dialogRef: MatDialogRef<AddTasksComponent>) {

    const user = localStorage.getItem('user');
    if (user) {
      this.userId = JSON.parse(user).user_id;
    }
    
    this.addForm = this.formBuilder.group({
      task_name: ['', Validators.required],
      task_desc: ['', [Validators.required, Validators.maxLength(50)]],
      status: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.addForm.valid && this.userId !== null) {
      const taskData = {
        ...this.addForm.value,
        user_id: this.userId // Add user ID to task data
      };

      console.log('Form submitted');
      console.log('Form value:', taskData); // Log the form values with user ID

      this.studentService.createTask(taskData).subscribe({
        next: (data: any) => {
          console.log('Response received:', data); // Log the response data
          alert(data.message);
          this.taskUpdated.emit();
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error:', error); // Log the error
          alert('An error occurred: ' + (error.message || 'Unknown error'));
          this.dialogRef.close();
          this.router.navigate(['/']);
          window.location.reload();
        }
      });
    } else {
      alert('Please fill all required fields.');
    }
  }
}
