import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/core/services/account.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { StudentListPDFService } from 'src/app/core/services/student-list-pdf.service';
import { School } from 'src/app/shared/domain/school';
import { Student } from 'src/app/shared/domain/student';

import {MatDialog} from '@angular/material/dialog';
import { EmailDialogComponent } from '../../component/email-dialog/email-dialog.component';

@Component({
  selector: 'fb-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  school: School | undefined;
  selectedStudent: Student | undefined;
  studentList: Student[];

  students: Student[];

  constructor(
    private schoolService: SchoolService,
    private accountService: AccountService,
    private studentListPDFService: StudentListPDFService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.studentList = [];
    this.students = [];
  }

  ngOnInit(): void {
    this.accountService.currentSelectedSchool$.subscribe((school: School) => {
      this.school = school;
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
    if (!this.school) {
      return;
    }

    this.studentListPDFService.generatePdf(this.studentList, this.school);
  }

  checkboxChange(changeEvent: MatCheckboxChange, student: Student) {
    if (changeEvent.checked) {
      this.studentList.push(student);
    } else {
      let index = this.studentList.findIndex(element => element.user?.id === student.user?.id);
      this.studentList.splice(index, 1)
    }
  }

  openEmailDialog() {
    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: "500px"
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response.event === "send"){
        this.addStudent(response.value);
      }
    }); 
  }

  addStudent(email: string) {
    const student = this.students.find((student: Student) => student.user?.email?.toLowerCase() == email);
    if (student) {
      this.snackBar.open('Diese E-Mail Adresse wurde bereits hinzugefügt', 'Ok', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    if (!this.school?.id) {
      return;
    }

    this.schoolService.postStudentsEnrollment(this.school?.id, email).subscribe(() => {
      this.snackBar.open('Die anfrage wurde gesendet', 'Ok', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }
}
