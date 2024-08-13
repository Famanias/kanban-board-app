import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialog} from '@angular/material/dialog';
import { PopUpComponent } from './pop-up/pop-up.component';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { EditTasksComponent } from './edit-tasks/edit-tasks.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crud';

  
  constructor(private dialogRef: MatDialog){

  }
  openDialog(){
    this.dialogRef.open(AddTasksComponent)
  }

}
