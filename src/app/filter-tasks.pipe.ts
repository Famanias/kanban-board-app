import { Pipe, PipeTransform } from '@angular/core';
import {Tasks} from './students';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Pipe({
  name: 'filterTasks'
})


export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Tasks[], status: string): Tasks[] {
    if (!tasks) {
      return [];
    }
    return tasks.filter(task => task.status === status);
  }
}