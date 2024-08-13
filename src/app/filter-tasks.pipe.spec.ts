import { FilterTasksPipe } from './filter-tasks.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';

describe('FilterTasksPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterTasksPipe();
    expect(pipe).toBeTruthy();
  });
});
