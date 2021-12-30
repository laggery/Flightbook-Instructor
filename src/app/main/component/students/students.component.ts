import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AccountService } from 'src/app/core/services/account.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { School } from 'src/app/shared/domain/school';
import { Student } from 'src/app/shared/domain/student';

@Component({
  selector: 'fb-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  school: School | undefined;
  selectedStudent: Student | undefined;
  studentList: Student[];

  students: Student[] | undefined

  constructor(
    private schoolService: SchoolService,
    private accountService: AccountService
  ) {
    this.studentList = [];
   }

  ngOnInit(): void {
    this.accountService.currentSelectedSchool$.subscribe((school: School) => {
      this.selectedStudent = undefined;
      this.studentList = [];
      if (school?.id) {
        this.schoolService.getStudentsBySchoolId(school.id).subscribe((students: Student[]) => {
          this.students = students;
        })
      }
    });
  }

  studentDetail(student: Student) {
    this.selectedStudent = student;
  }

  printStudentList() {
    console.log("PDF export");
    console.log(this.studentList);
  }

  checkboxChange(changeEvent: MatCheckboxChange, student: Student) {
    if (changeEvent.checked) {
      this.studentList.push(student);
    } else {
      let index = this.studentList.findIndex(element => element.user?.id === student.user?.id);
      this.studentList.splice(index, 1)
    }
  }

}