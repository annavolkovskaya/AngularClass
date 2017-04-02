import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { SpinnerService } from '../../services/spinner.service';
import { CourseObject } from '../../models/course.model';
import { OrderByPipe } from '../../../pipes/orderBy.pipe';

@Component ({
  selector: 'courses-component',
  templateUrl: './courses.component.html',
  providers: [CoursesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CoursesComponent implements OnInit {
  public courses: CourseObject[];

  constructor(
    private coursesService: CoursesService,
    private spinnerService: SpinnerService
  ) {}

  public handleFindCourse = (query) => {
    this.courses = this.coursesService.getFilteredCourses(query);
  }

  public handleDeleteCourse(id) {
    this.spinnerService.show();
    if (confirm('Are you sure you want to delete this course?')) {
      this.coursesService.removeItem(id);
    }
  }

  public ngOnInit(): void {
    this.courses = this.coursesService.getList();
  }
}
