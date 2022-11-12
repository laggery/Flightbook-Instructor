import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/core/services/account.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { StudentListPDFService } from 'src/app/core/services/student-list-pdf.service';
import { School } from 'src/app/shared/domain/school';
import { Student } from 'src/app/shared/domain/student';

import {MatDialog} from '@angular/material/dialog';
import { EmailDialogComponent } from '../../component/email-dialog/email-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { DeviceSizeService } from 'src/app/core/services/device-size.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'fb-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit, OnDestroy {
  school: School | undefined;
  selectedStudent: Student | undefined;
  studentList: Student[];
  @ViewChild(MatSidenav) sidenav: MatSidenav | undefined;
  unsubscribe$ = new Subject<void>();

  students: Student[];

  constructor(
    private translate: TranslateService,
    private schoolService: SchoolService,
    private accountService: AccountService,
    private studentListPDFService: StudentListPDFService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private deviceSize: DeviceSizeService
  ) {
    this.studentList = [];
    this.students = [];
  }

  ngOnInit(): void {
    this.deviceSize.isMobile.pipe(takeUntil(this.unsubscribe$)).subscribe((mobile: boolean) => {
      if (!mobile) {
        this.sidenav?.open();
      }
    });

    this.accountService.currentSelectedSchool$.pipe(takeUntil(this.unsubscribe$)).subscribe((school: School) => {
      this.school = school;
      this.selectedStudent = undefined;
      this.studentList = [];
      this.syncStudentList();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  syncStudentList() {
    if (this.school?.id) {
      this.schoolService.getStudentsBySchoolId(this.school.id).pipe(takeUntil(this.unsubscribe$)).subscribe((students: Student[]) => {
        this.students = students.sort(((obj1, obj2) => (obj1.user?.firstname && obj2.user?.firstname && obj1.user?.firstname > obj2.user?.firstname ? 1 : -1)));
        this.selectedStudent = this.students[0];
      })
    }
  }

  studentDetail(student: Student) {
    if (this.deviceSize.isMobile.getValue()) {
      this.sidenav?.close();
    }
    this.selectedStudent = student;
  }

  backButton() {
    this.sidenav?.open();
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
      if (response?.event === "send"){
        this.addStudent(response.value);
      }
    }); 
  }

  addStudent(email: string) {
    const student = this.students.find((student: Student) => student.user?.email?.toLowerCase() == email);
    if (student) {
      this.snackBar.open(this.translate.instant('formMessage.emailAlreadyAdded'), this.translate.instant('buttons.done'), {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    if (!this.school?.id) {
      return;
    }

    this.schoolService.postStudentsEnrollment(this.school?.id, email).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.snackBar.open(this.translate.instant('formMessage.requestSent'), this.translate.instant('buttons.done'), {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }
}
