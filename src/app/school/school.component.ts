import { Component, OnInit } from '@angular/core';
import { AccountService } from '../core/services/account.service';
import { School } from '../shared/domain/school';
import { Student } from '../shared/domain/student';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {

  schools: School[] | undefined;
  selectedStudent: Student | undefined;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getSchoolsByUserId().subscribe((schools: School[]) => {
      this.schools = schools;
    })
  }

  selectStudent(student: Student) {
    this.selectedStudent = student;
  }

}
