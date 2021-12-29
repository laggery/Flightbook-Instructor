import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SchoolService } from 'src/app/core/services/school.service';
import { School } from 'src/app/shared/domain/school';
import { Student } from 'src/app/shared/domain/student';

@Component({
  selector: 'fb-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  @Input()
  school: School | undefined;

  @Output() 
  selectStudentEvent: EventEmitter<Student> = new EventEmitter();

  students: Student[] | undefined

  constructor(private schoolService: SchoolService) { }

  ngOnInit(): void {
    if (this.school?.id){
      this.schoolService.getStudentsBySchoolId(this.school.id).subscribe((students: Student[]) => {
        this.students = students;
      })
    }
  }

  studentDetail(student: Student) {
    this.selectStudentEvent.emit(student);
  }

}
